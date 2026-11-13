# S03E02 nothing ships unmarked
Tries used / left: claim 0 used so far (unknown total); claim #1 being sent
- 2026-11-10 start-challenge OK. Session saved in session.txt (git-ignored below; expires 2026-11-11T08:58Z).
- Repo zip: https://hq.mega.dev/media/nothing-ships-unmarked/sched-prod-3e6e841d.zip ; API https://hq.mega.dev/challenges/nothing-ships-unmarked/api (?t=session)
- Do NOT call start-challenge again: it deals a new set of requests and a new session.
- 2026-11-10T09:03:24Z tracker triaged (36 files, 18 requests); skill ~/.agents/skills/triage; about to claim #1
- claim #1 REJECTED: "Not yet. 4 intents not accounted for · 1 issue open that should not be." Cause: 4 new requests arrived after my last poll (IN-4109, IN-1384, IN-8901, IN-9102); IN-1384 withdrew IN-3541, so IN-3541 was the open issue that should not be.
- Fixed: IN-3541 + IN-1384 closed not-planned; IN-4109, IN-8901 agent-ready; IN-9102 closed duplicate of SCHED-4494 (added to its sources). Re-poll: 0 new. check.mjs: 40 files, 22 requests, CHECK OK.
- Lesson: channels keep delivering after a claim; poll again right before each claim and read for withdrawals.
- Blocked on tools/pre-claim-gate: needs a human to re-read the live challenge page and append a line to live-recheck.log.
- 2026-11-10T09:16:59Z claim #2 SOLVED. stats: 22 requests -> 25 issues; 21 agent-ready, 3 needs-human.
