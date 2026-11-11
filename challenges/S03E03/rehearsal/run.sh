#!/usr/bin/env bash
# Rehearsal: copy the repo to ./work, run mock tracker + wrangler dev (as "live") + the loop with the real claude.
# After the run, check the order the course enforces: curl -s localhost:8899/_test/dump | ../../../tools/check-ask-order -
# Usage: ./run.sh   then watch work/loop.out ; inject the owner with: curl -X POST localhost:8899/_test/owner -d '{"n":2,"body":"/answer 1"}'
set -euo pipefail
cd "$(dirname "$0")"; rm -rf work; mkdir work
cp -r ../starter/sched-prod-api work/repo
node mock.mjs > work/mock.log 2>&1 & echo $! > work/mock.pid
cd work/repo
sed -i 's#"deploy": ".*"#"deploy": "echo deployed-to-local-dev"#' package.json
npm install --silent >/dev/null 2>&1
printf 'FEED_URL=http://127.0.0.1:8899/feed\n' > .dev.vars
npx wrangler dev --port 8787 > ../wrangler.log 2>&1 & echo $! > ../wrangler.pid
git init -q; git config user.name sched-agent; git config user.email agent@invalid; git add -A; git commit -qm base
sleep 10
TRACKER_URL=http://127.0.0.1:8899 TRACKER_TOKEN=mock-token LIVE_URL=http://127.0.0.1:8787 POLL_MS=5000 nohup node agent/loop.mjs > ../loop.out 2>&1 &
echo $! > ../loop.pid; echo started
