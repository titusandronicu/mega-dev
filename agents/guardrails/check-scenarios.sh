#!/usr/bin/env bash
# Runs each scenario against the guardrails agent N times (default 3) on its small model.
# Pass only if every run matches the expected pattern. Read-only agent; no files are changed.
# Scenarios run in parallel, so the whole check takes about as long as the slowest one.
# Hooks are disabled for these runs: a global Stop hook would otherwise answer in place of the agent.
# Usage: agents/guardrails/check-scenarios.sh [runs]
set -uo pipefail
cd "$(dirname "$0")/../.."
runs=${1:-3}
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
ask() { claude -p --agent guardrails --model haiku --settings '{"disableAllHooks":true}' "$1" </dev/null 2>&1; }
run_one() {  # id question regex -> writes "PASS/FAIL id (ok/runs)" to $tmp/<n>
  local n=$1 id=$2 q=$3 re=$4 ok=0 out
  for i in $(seq "$runs"); do
    out=$(ask "$q")
    # one retry only when the run returned nothing (a transient failure); a wrong answer is never retried
    [ -z "$out" ] && out=$(ask "$q")
    printf '%s' "$out" | grep -Eizq -- "$re" && ok=$((ok+1))
  done
  if [ "$ok" -eq "$runs" ]; then echo "PASS $id ($ok/$runs)"; else echo "FAIL $id ($ok/$runs)"; fi > "$tmp/$n"
}
n=0
while IFS=$'\t' read -r id q re; do
  case "$id" in ''|\#*) continue;; esac
  n=$((n+1)); run_one "$n" "$id" "$q" "$re" &
done < agents/guardrails/scenarios.tsv
wait
fail=0
for f in $(ls "$tmp" | sort -n); do cat "$tmp/$f"; grep -q '^FAIL' "$tmp/$f" && fail=1; done
exit $fail
