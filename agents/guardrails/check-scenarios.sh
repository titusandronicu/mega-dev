#!/usr/bin/env bash
# Runs each scenario against the guardrails agent N times (default 3) on its small model.
# Hooks are disabled for these runs: a global Stop hook would otherwise answer in place of the agent.
# Pass only if every run matches the expected pattern. Read-only agent; no files are changed.
# Usage: agents/guardrails/check-scenarios.sh [runs]
set -uo pipefail
cd "$(dirname "$0")/../.."
runs=${1:-3}; fail=0
while IFS=$'\t' read -r id q re; do
  case "$id" in ''|\#*) continue;; esac
  ok=0
  for i in $(seq "$runs"); do
    out=$(claude -p --agent guardrails --model haiku --settings '{"disableAllHooks":true}' "$q" </dev/null 2>&1)
    if printf '%s' "$out" | grep -Eiq -- "$re"; then ok=$((ok+1)); fi
  done
  if [ "$ok" -eq "$runs" ]; then echo "PASS $id ($ok/$runs)"; else echo "FAIL $id ($ok/$runs)"; fail=1; fi
done < agents/guardrails/scenarios.tsv
exit $fail
