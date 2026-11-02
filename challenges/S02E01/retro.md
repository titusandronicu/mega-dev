# S02E01 retro
Inputs: the session transcripts of the two teams, the course replies, and this session's log. Drafted 2026-11-02, before the claim was accepted.

## Feedback
> Your plan doesn't say which image version. / Your plan doesn't say which port. / Something changed since your check-in. Check again.

## Findings
- The compaction summary kept the store (SQLite) but dropped the ORM (Drizzle); only the original proposal and approval carry both. Cite the proposal and the approval, never the summary. [evidence: session 7f3c2a91 10:20Z summary vs 09:41Z proposal] [fix: playbook] [status: proposed]
- The plan draft was dated 15:30 CEST on 30 Oct, before the 14:48Z Postgres decision of the same day; it was already stale when handed over. Compare the draft's date with the newest session before trusting any row. [evidence: plan-draft.md header, session 019a35d2] [fix: playbook] [status: proposed]
- Nine sessions held three kinds of noise: another project (shelf-labels, Postgres 15 on 5435), a 904-line heartbeat log, and subagent comparisons that proposed nothing. Only a proposal plus an approval is a decision. [evidence: transcripts of 884e2b73, agent-a91f3e07, agent-a3d70b5e] [fix: playbook] [status: proposed]
- Two session files appeared in the archive after the first plan check-in. Re-list the archive after every check-in and after every "something changed" reply. [evidence: archive index before and after 13:51Z] [fix: tool] [status: applied]
- The checker reads one row per fact: it refused the plan for no image version and then for no port, though both sat inside the Job store row. Give Image and Port their own rows. [evidence: two rejections, claim log] [fix: playbook] [status: proposed]
- The late subagent was asked to "fix the CI side" and wrote "same settings locally" on its own. Scope that the human did not grant goes back to the human before it enters the plan. [evidence: session c41e7b02 13:10Z request vs 13:16Z note; owner chose same everywhere] [fix: claude-md] [status: applied]
- Docker was missing in WSL, so the store runs on the NAS over SSH; the host key and the key install needed the human, and 5432 was already bound there. Probe the host first (docker, free port) and list what only the human can do. [evidence: ssh checks on 2 Nov] [fix: playbook] [status: proposed]
- A hook that fetched the archive failed silently on a 403 because Python's default User-Agent is refused. Run a new hook once against the real endpoint and once with a forced change. [evidence: stop-check.py first run wrote no baseline] [fix: tool] [status: applied]
- A schema typo (t.name for t.night) went into a submit although the file on disk was right, because the payload was retyped by hand. Build the payload from the files with a script. [evidence: build attempt 5] [fix: tool] [status: proposed]
- Six plan variants and eight builds were rejected with the same line, "Something changed since your check-in": 17 on 5471 everywhere, split local 16 and CI 17, and local 16 on 5432 with the CI-only change as its own row. Plan check-ins were accepted each time; the course never says why a build fails. After the third identical refusal, stop rotating variants and ask the owner what the live page and the course show. [evidence: claim log 2 Nov, builds 3 to 8; live page re-read 14:19Z unchanged] [fix: playbook] [status: proposed]

## Applied
Findings 4, 6 and 8: `.claude/hooks/stop-check.py` and the project `.claude/settings.json` in `found-out-late`; the human chose "same everywhere, 17 on 5471" on 2026-11-02. Findings 1-3, 5, 7 and 9 are proposed. The claim was still being rejected when this was drafted: unsolved after eight builds (2 Nov 2026).
