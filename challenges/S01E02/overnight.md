# S01E02 overnight run: stopped at step 2

Run time: 2026-10-27 05:20 CET, fired by the one-shot job scheduled for 05:12.

## Result
Nothing was sent to the course. No sign-in was attempted, no email was read, no body or form answer was sent.

## Why it stopped
Step 2 needs the `mega-challenge` MCP tools (`mega-start`, `list-challenges`). Both calls failed with:

> Its MCP server 'mega-challenge' needs the user to re-authorize it before its tools work again.

The server dropped out of the session. Only `authenticate` and `complete_authentication` were left, and they start an OAuth approval in a browser ("press Sign in and Approve") that only the human can finish. The approved scope was a course sign-in by email link. It did not cover granting the harness a new OAuth access, and the MCP instructions say not to run OAuth by hand. So the run stopped, as the playbook says: "stop whenever the challenge says the human must read, decide or approve".

## Read before stopping
- docs/playbook.md and docs/lessons-learned.md (followed).
- No challenge text for S01E02 was read, so there is no contract, no limit and no draft.

## Waiting for the user
1. Re-authorize the course MCP: in Claude Code run `/mcp`, pick `mega-challenge`, and complete the sign-in (email link, then Sign in and Approve). Then say "mega start".
2. Optional: tell me if a future overnight run should be allowed to finish the MCP sign-in through Gmail. That is a separate approval.

## Answer I would give, and how sure
None. There is no question to answer yet.

## For next time
- Overnight jobs that depend on the course MCP can fail if its OAuth session lapses overnight. Either re-authorize before sleeping (check with `/mcp`) or approve a fallback that works from the website only.
- The cloud prep routine (05:10) does not use this MCP, so it is unaffected. Check its run log for the real prep.
