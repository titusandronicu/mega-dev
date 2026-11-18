#!/usr/bin/env bash
# Checks paths.txt and wake.py. Cheap, mostly no model. One real wake (a few seconds on the small model).
#   1. paths.txt still lists every required path, and each one exists in the repo
#   2. wake.py stays silent for: an unowned file, the recursion guard, garbage input, a repeat touch
#   3. wake.py wakes the agent for an owned file and returns labelled context
#   4. settings.json still wires wake.py as a PreToolUse hook that covers Read and Edit
# Usage: agents/guardrails/check-wake.sh   (exit 0 = all pass)
set -uo pipefail
cd "$(dirname "$0")/../.."
fail=0
pass() { echo "PASS $1"; }
bad()  { echo "FAIL $1"; fail=1; }
W=agents/guardrails/wake.py
REQUIRED="hooks/pre-commit hooks/token-allowlist .claude/skills/read/scripts/redact.mjs tools/check-all CLAUDE.md"

# 1. owned paths
miss=""
for p in $REQUIRED; do grep -qxF "$p" agents/guardrails/paths.txt || miss="$miss $p"; done
[ -z "$miss" ] && pass "paths-required-present" || bad "paths-required-present (missing:$miss)"
gone=""
while IFS= read -r p; do case "$p" in ''|\#*) continue;; esac; [ -e "$p" ] || gone="$gone $p"; done < agents/guardrails/paths.txt
[ -z "$gone" ] && pass "paths-all-exist" || bad "paths-all-exist (not found:$gone)"

# 2. silence cases
sid="chk-$$-$RANDOM"
ev() { printf '{"tool_name":"%s","session_id":"%s","tool_input":{"file_path":"%s"}}' "$1" "$2" "$PWD/$3"; }
out=$(ev Read "$sid" README.md | python3 -I $W); [ -z "$out" ] && pass "silent-unowned-file" || bad "silent-unowned-file"
out=$(ev Read "$sid-r" tools/check-all | GUARDRAILS_WAKING=1 python3 -I $W); [ -z "$out" ] && pass "silent-recursion-guard" || bad "silent-recursion-guard"
out=$(echo nope | python3 -I $W); rc=$?; { [ -z "$out" ] && [ $rc -eq 0 ]; } && pass "silent-bad-input" || bad "silent-bad-input"

# 3. a real wake, then a repeat of the same touch
out=$(ev Read "$sid-w" hooks/pre-commit | python3 -I $W)
if printf '%s' "$out" | python3 -I -c 'import json,sys; c=json.load(sys.stdin)["hookSpecificOutput"]; assert c["hookEventName"]=="PreToolUse" and "Guardrails domain agent" in c["additionalContext"]' 2>/dev/null; then pass "wakes-on-owned-file"; else bad "wakes-on-owned-file"; fi
out=$(ev Read "$sid-w" hooks/pre-commit | python3 -I $W); [ -z "$out" ] && pass "silent-repeat-touch" || bad "silent-repeat-touch"

# 4. wiring
python3 -I - <<'PY' && pass "settings-wires-wake" || bad "settings-wires-wake"
import json,re,sys
h=json.load(open('.claude/settings.json'))['hooks']['PreToolUse']
ok=any(re.search(r'Read',e['matcher']) and re.search(r'Edit',e['matcher']) and any('guardrails/wake.py' in x['command'] for x in e['hooks']) for e in h)
sys.exit(0 if ok else 1)
PY
exit $fail
