#!/usr/bin/env node
// check-notes.mjs: check a Notion notes draft before it leaves this machine.
//
//   node check-notes.mjs < draft.md    exit 1 and list problems; exit 0 if the draft may go
//   node check-notes.mjs --self-test
//
// It fails on: course tokens and magic links (via ../../read/scripts/redact.mjs), private strings
// (home paths, private IPs, tailnet hosts, emails, the owner's secrets folder, bearer tokens, API keys),
// a missing required section, and a quoted passage of 150 characters or more (a copy of course text).
// It warns on second-person wording, because the notes are written in the owner's first person.
// Reads stdin only. Writes nothing. No network. Plain Node.js 18 or newer, no dependencies.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REDACT = resolve(here, '../../read/scripts/redact.mjs');

const PRIVATE = [
  [/\/home\/[A-Za-z0-9_.-]+/, 'home path'],
  [/\b(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/, 'private IP address'],
  [/\b[\w-]+\.ts\.net\b/, 'tailnet host'],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/, 'email address'],
  [/\.config\/mega-hq/, "the owner's secrets folder"],
  [/\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/, 'bearer token'],
  [/\bsk-[A-Za-z0-9_-]{16,}/, 'API key'],
  [/\b(?:api[_-]?key|secret|password)\s*[:=]\s*\S{6,}/i, 'key or password assignment'],
];

const SECTIONS = [
  [/^## Lesson/m, '## Lesson: what it teaches'],
  [/^## Story/m, '## Story'],
  [/^## Challenge:/m, '## Challenge: <course title>'],
  [/^## What changed in my harness/m, '## What changed in my harness'],
  [/^## Open/m, '## Open'],
];

function check(text) {
  const fail = [];
  const warn = [];
  if (!existsSync(REDACT)) {
    fail.push(`redact.mjs not found at ${REDACT}`);
  } else {
    const r = spawnSync(process.execPath, [REDACT, '--check', '--stdin'], { input: text, encoding: 'utf8' });
    if (r.status !== 0) fail.push(`token or magic link: ${(r.stdout + r.stderr).trim()}`);
  }
  text.split('\n').forEach((line, i) => {
    for (const [re, what] of PRIVATE) if (re.test(line)) fail.push(`line ${i + 1}: ${what}`);
    // match quotes in pairs (open, close), so text between two separate quotes is not read as one
    if ([...line.matchAll(/"([^"\n]*)"/g)].some((m) => m[1].length >= 150)) {
      fail.push(`line ${i + 1}: quoted passage of 150 characters or more (summarise it)`);
    }
    if (/\byour (approval|log|human|repo)\b/i.test(line)) warn.push(`line ${i + 1}: second person; write in the owner's first person`);
  });
  for (const [re, name] of SECTIONS) if (!re.test(text)) fail.push(`missing section: ${name}`);
  return { fail, warn };
}

function selfTest() {
  const good = [
    '## Lesson: what it teaches', 'x', '## Story', 'x', '## Challenge: demo', 'x',
    '## What changed in my harness', 'x', '## Open', 'x',
  ].join('\n');
  assert.deepEqual(check(good), { fail: [], warn: [] });
  const bad = (extra) => check(`${good}\n${extra}`).fail;
  const token = ['v1', 'abcdefghij12', 'klmnopqrst34'].join('.');
  assert.ok(bad(`see ${token}`).some((m) => m.startsWith('token')));
  assert.ok(bad('at /home/someone/repo').some((m) => m.includes('home path')));
  assert.ok(bad('host 192.168.1.20').some((m) => m.includes('private IP')));
  assert.ok(bad('https://box.tail1234.ts.net/').some((m) => m.includes('tailnet')));
  assert.ok(bad('mail a.b@example.com').some((m) => m.includes('email')));
  assert.ok(bad('in ~/.config/mega-hq/x').some((m) => m.includes('secrets folder')));
  assert.ok(bad(`"${'long words '.repeat(20)}"`).some((m) => m.includes('quoted passage')));
  assert.ok(check(good.replace('## Open', '## Later')).fail.some((m) => m.includes('missing section: ## Open')));
  assert.equal(check(`${good}\nafter your approval`).warn.length, 1);
  assert.deepEqual(bad('a short "quoted line" is fine, so is https://hq.mega.dev/challenges/x'), []);
  assert.deepEqual(bad(`"one short quote" then ${'plain words between '.repeat(12)} then "another short one"`), []);
  console.log('self-test ok');
  return 0;
}

function main(argv) {
  if (argv.includes('--self-test')) return selfTest();
  const { fail, warn } = check(readFileSync(0, 'utf8'));
  for (const w of warn) console.log(`warn: ${w}`);
  for (const f of fail) console.log(`FAIL: ${f}`);
  console.log(fail.length ? `result: FAIL (${fail.length})` : 'result: ok');
  return fail.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
