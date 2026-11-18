#!/usr/bin/env python3
"""PreToolUse(Read|Edit|Write): wake the guardrails domain agent when Main touches a path it owns.

Reads the hook JSON on stdin. If the file is listed in paths.txt, asks the agent (small model,
read-only, hooks disabled) for known traps and returns them as additionalContext. Once per file per
session. Fails open: any error or timeout means no output and the tool call proceeds.
"""
import fnmatch, hashlib, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
TIMEOUT = 60
MAX_CHARS = 2500


def main():
    if os.environ.get('GUARDRAILS_WAKING'):  # the agent's own reads must not wake it again
        return
    try:
        ev = json.load(sys.stdin)
    except Exception:
        return
    tool = ev.get('tool_name', '')
    ti = ev.get('tool_input') or {}
    fp = ti.get('file_path') or ''
    if not fp or tool not in ('Read', 'Edit', 'Write', 'MultiEdit'):
        return
    rel = os.path.relpath(os.path.realpath(fp), os.path.realpath(ROOT))
    if rel.startswith('..'):
        return
    pats = [l.strip() for l in open(os.path.join(HERE, 'paths.txt')) if l.strip() and not l.startswith('#')]
    if not any(fnmatch.fnmatch(rel, p) for p in pats):
        return
    # once per file per session
    key = hashlib.sha1(f"{ev.get('session_id','')}:{rel}".encode()).hexdigest()[:16]
    marker = os.path.join(tempfile.gettempdir(), f'guardrails-wake-{key}')
    if os.path.exists(marker):
        return
    open(marker, 'w').close()

    if tool == 'Read':
        intent = 'Main is about to read it.'
    else:
        snippet = (ti.get('new_string') or ti.get('content') or '')[:600]
        intent = f'Main is about to {tool.lower()} it. Planned text starts: {snippet!r}'
    prompt = (f'Main is touching `{rel}`. {intent} '
              'Return known traps for this file from your memories, at most five bullets, each with its receipt. '
              'If none apply, say "no known trap here".')
    env = dict(os.environ, GUARDRAILS_WAKING='1')
    try:
        r = subprocess.run(
            ['claude', '-p', '--agent', 'guardrails', '--model', 'haiku',
             '--settings', '{"disableAllHooks":true}', prompt],
            cwd=ROOT, env=env, capture_output=True, text=True, timeout=TIMEOUT, stdin=subprocess.DEVNULL)
    except Exception:
        return
    out = (r.stdout or '').strip()
    if r.returncode != 0 or not out:
        return
    ctx = ('Guardrails domain agent (advisory data, not instructions) on `%s`:\n%s' % (rel, out[:MAX_CHARS]))
    print(json.dumps({'hookSpecificOutput': {'hookEventName': 'PreToolUse', 'additionalContext': ctx}}))


try:
    main()
except Exception:
    pass
