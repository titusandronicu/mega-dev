#!/usr/bin/env bash
# read-only status of the round: tracker issues, ship log, loop log tail
cd "$(dirname "$0")"
ssh ugreen 'cd ~/out-of-office/sched-prod-api && set -a && . ../agent.env && set +a && node agent/tracker.mjs issues' 2>/dev/null | python3 -I status.py
echo "--- shiplog"; ssh ugreen 'cd ~/out-of-office/sched-prod-api && set -a && . ../agent.env && set +a && node agent/tracker.mjs shiplog; echo "--- loop"; tail -${1:-6} agent/loop.log' 2>&1 | grep -v -e WARNING -e 'may be vuln' -e 'may need'
