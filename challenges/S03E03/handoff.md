# Hand-off: S03E03 (out of office)

A new session reads this first, then `challenges/S03E03/log.md`, then `docs/playbook.md`. No secret is in this file: the tracker token, the round receipt and the Cloudflare token live on the NAS (see "Where things are").

## Sources
- `challenges/S03E03/log.md`: the running log of this Challenge, written during the work. Times are UTC unless marked.
- `challenges/S03E03/reply2.json`, `reply3.json`: the two refusals, quoted with tokens masked. `reply1.json` is the round-open reply, masked.
- `challenges/S03E03/claim-log.jsonl`: written by `tools/record-claim`, one line per claim.
- `challenges/S03E03/starter/sched-prod-api/`: the API plus the agent (skill, tracker CLI, loop). Same files are on the NAS in `~/out-of-office/sched-prod-api`.
- The start-challenge reply and the hint tool (`check-lane` need `hint`): read in session, quoted in log.md.

## Facts
- Tries used / left: 3 claims used (the open, `no_ask`, `built_before_answer`). The course gave no limit, so the count of tries left is unknown. [source: claim-log.jsonl, reply2.json, reply3.json]
- Round 1 is over. The course said "Don't claim this round again" and told us to open a new one with `{ "open": true }` and nothing else. [source: reply3.json, field next]
- Claim 2 was refused with `no_ask`: "#2: No question to the owner in the issue." The agent's first ask on #2 had no question mark and no numbered list. Hint at tries 1: "Was that issue a call your agent could make alone?" [source: reply2.json; log.md, "CLAIM 2"]
- Claim 3 was refused with `built_before_answer`: "#2: Work on it started before the owner answered." The agent declined and closed #2 at 09:56Z on the owner's chat instruction. The owner entry `/answer 1` reached the thread at 10:06:28Z. [source: reply3.json; log.md, "CLAIM 3" and "Cause (mine)"]
- The owner's `/answer` and record signature made on the round page did not reach the tracker for about 25 minutes. The first signature that landed was made in a second browser, at 10:02:18Z. The `/answer 1` that landed at 10:06:28Z followed a clearer question. The cause on the course side is unknown. [source: log.md, entries 09:30Z to 10:06Z]
- Five of six issues were handled correctly and live: #1 `GET /incidents/{id}` shipped, #3 CSV export declined by signed record 0003, #4 `?status=` and #5 `?since=` shipped, #6 `/debug` declined because it would expose `PROD_ADMIN_TOKEN`. [source: log.md, 09:27Z to 09:45Z entries; status.sh output]
- Each shipped change was checked on the live address by hand (200 on the new call, 404 body `{"error":"not found"}` on an unknown id or path, `/incidents` unchanged with the same five fields). [source: log.md, "My live check"]
- The live API is `https://sched-prod-api-production.mega-kamil.workers.dev`, a Worker named `sched-prod-api-production` on the Cloudflare account `Nowosad.kamil@gmail.com's Account`. The first deploy was made through the Cloudflare MCP connection. Later deploys run from the NAS with `npm run deploy` and a token in `~/out-of-office/cf.env`. [source: log.md, deploy entries]
- The starter's `.dev.vars.example` held a production feed admin token (`PROD_ADMIN_TOKEN`) that can write and delete. Our copy blanks it, and the skill forbids any use of it. [source: log.md, "Finding"]
- The NAS runs the agent as a systemd user service `out-of-office-agent.service`, installed with the owner's approval and still active against the dead round-1 tracker. [source: log.md, NAS service entries]
- The `triage` skill is `.agents/skills/triage/SKILL.md` in the repo, linked as `.claude/skills`. Its ask step was changed after claim 2 to write a literal question, numbered options one per line, a recommendation and `/answer <n>`. [source: log.md, "Skill changed"; SKILL.md step 4]

## Decisions
- Runner: a loop on the NAS that starts one restricted `claude -p` run per issue, chosen over a cloud agent. The owner chose it ("go with recommended"). [source: log.md, "Owner chose"]
- Cloudflare account: the owner's, confirmed by `wrangler whoami`. The owner created the API token and wrote it to `cf.env` on the NAS. [source: log.md, deploy entries]
- Option 1 on #2 (decline) was the owner's choice. Their words in chat were "use recommended". [source: log.md, 09:56Z entry]
- Clarifying comment on #2 (option 1 of 3): chosen by the owner after claim 2. It restated the ask and did not change the decision. [source: log.md, 10:05Z entries]
- Rule going forward (mine, to be approved by the owner): nothing on an issue changes before an owner entry exists in its thread. A chat instruction is not an answer. If the page loses an answer, retry in the second browser and wait. [source: log.md, "Lessons for round 2"]

## Open
- Round 2 is not opened. Opening it starts a new clock of about 20 minutes, so the owner must be at the round page first. Only the owner says "open a new round". [owner]
- Before opening: stop the service, clear `agent/state.json` and `agent/loop.log` on the NAS, run `tools/pre-claim-gate S03E03` (it needs a fresh dated line from the owner in `live-recheck.log`), then claim with `{ "open": true }` only. [agent]
- After the open: write the new tracker URL, token and `LIVE_URL` into `agent.env`; set the new feed URL in `wrangler.toml` under `[env.production.vars]`; redeploy; check `/incidents` live; start the service. About 3 minutes. [agent]
- The final claim sends the new round receipt and the live address as flat fields `round` and `url`. Never send the `open` or `verdict` keys. [agent]
- Debrief is not written because the Challenge is not solved. After a solve: `debrief`, then `challenges/S03E03/retro.md` update, then `tools/retro-check`. The existing S03E03 retro is about the lesson, not this Challenge; add Challenge findings to it. [agent]
- Cleanup after the Challenge ends: `systemctl --user disable --now out-of-office-agent`, delete the unit and `~/out-of-office` on the NAS, and delete the Worker if the owner wants it gone. Roll the Cloudflare token. [owner]

## How the pieces work (what, why, and which tool)
Goal: an agent that handles product and support issues alone, ships them to a public https address, asks the owner only what is the owner's to decide, and keeps a ship log. The course checks the thread, the records and the live address.

- `mega-challenge` MCP: `list-challenges` shows the entry; `start-challenge` returns the task, the starter and the rules; `claim-challenge` with `{ "open": true }` opens a round; a second claim with `{ "round", "url" }` ends it; `check-lane` `hint` gives a hint for a refusal code, more direct each time the same code returns; `debrief` is for after a solve. `rook` is never called.
- `agent/loop.mjs` (code, not a prompt): polls the tracker every 20 seconds, writes the pick-up comment and a `waiting` ship line the moment an issue appears (the 5-minute rule), then starts one `claude -p` run per issue that has news. It retries a failed run up to three times and pings the owner's phone through ntfy when the agent has asked. Why: code decides when to work and who is trusted, the model decides what to build.
- `agent/tracker.mjs`: the only door from the agent to the tracker and the live API. The token comes from the environment and is never printed. It builds the ship line in the exact format. Why: the model never holds a secret and cannot mistype the format.
- `.agents/skills/triage/SKILL.md`: the decision rules per issue. Order: never write to the feed or use an admin token; follow signed records; build alone only an additive read; ask the owner for anything that changes what an existing answer carries; only a thread entry `by: owner` counts as an answer. Why: the contract says an additive read needs no record, and a changed field needs a record and the owner.
- `wrangler` (on the NAS): `npm run deploy` ships the Worker. The Cloudflare MCP connection was used once, for the first deploy; it cannot read or create API tokens.
- `systemd --user` on the NAS: keeps the loop running and restarts it. The loop's allowed tools are limited to the tracker CLI, `node --check`, a few `git` commands, file edits and `npm run deploy`. No `--yolo`.
- `challenges/S03E03/rehearsal/run.sh`: runs the loop with the real `claude -p` against a mock tracker and a local `wrangler dev`. It rehearsed build, ask, answer and decline before the live round. It did not rehearse the owner page losing an answer, or the order rule that the course enforces.
- `challenges/S03E03/status.sh`: read-only view of the issues, the ship log and the loop log from the host.
- `tools/record-claim`, `tools/pre-claim-gate`, `tools/preflight`, `tools/check-handoff`: the repo's own guards. `pre-claim-gate` blocks any claim after the first until the owner re-reads the live challenge page and adds a dated line to `live-recheck.log`.

## Where things are (no secrets here)
- NAS (`ssh ugreen`, user Funky): `~/out-of-office/sched-prod-api` (repo with git history), `~/out-of-office/cf.env` (Cloudflare token, mode 600), `~/out-of-office/agent.env` (tracker settings and the ntfy URL, mode 600), `~/out-of-office/round-receipt` (round 1 receipt, now dead), `~/.config/systemd/user/out-of-office-agent.service`.
- Host: this repo, `challenges/S03E03/`. The folders `starter-dl/` and `rehearsal/work/` are scratch and can be deleted.
- The lesson map at http://192.168.50.63:18082/ already has the S03E03 lesson retro (PR #26, merged). The Challenge itself is not on it yet.
