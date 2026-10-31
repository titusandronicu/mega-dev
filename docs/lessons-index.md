# Lessons index

Every line in `docs/lessons-learned.md`, mapped to what now prevents it by default - a tool,
an existing check, or "prose only" with why code can't do this one. Built after S01E01-03;
see `challenges/S01E03/log.md` (Phase 8) for how.

| # | Lesson (short) | Mechanism |
|---|---|---|
| 1 | Find the stated spec, don't guess the shape | `.claude/skills/read` `find-contract.mjs` |
| 2 | Count limits with a tool | `.claude/skills/read` `cut-diff.mjs` |
| 3 | A form field can ask something not true of you | prose only - a human judgment call each time, nothing generic to check |
| 4 | Read a refusal literally | prose only - language understanding, not a checkable structure |
| 5 | Search live web for "latest X", cite date | prose only (`docs/playbook.md`) - the action is research, not a static check |
| 6 | Record the exact refusal text per snag | partial - `tools/retro-check` requires an `[evidence: ...]` tag, not the exact wording |
| 7 | (meta: "see `docs/playbook.md`") | n/a - a pointer, not a lesson to mechanize |
| 8 | Clear unwanted `mcp_connections` after creating a cloud routine | prose only (`docs/playbook.md`) - out of scope here, a cloud-routine-creation check belongs with that tooling, not this repo |
| 9 | Test a claim on the real page before writing it down | prose only - same shape as #4 |
| 10 | Clean up test commits with path-limited commands, never `git reset --hard` | prose (`CLAUDE.md`/git hygiene rule already there) |
| 11 | A sign-in link belongs to the browser that asked | prose (`docs/environments.md`) - which machine has which session is host-specific state, not a static check |
| 12 | Check the real constraint before granting | prose only |
| 13 | A first load can look done and still be empty | prose only - specific to a product (HQ) outside this repo |
| 14 | Check which machine you're on | **existing: `tools/whereami`** |
| 15 | After a 429, stop | prose only - needs wrapping every HTTP call, not done here |
| 16 | Model timestamps for speech are unreliable | **existing: `tools/speech-offsets`** |
| 17 | A prompt is not a guardrail (`--yolo`) | prose (`CLAUDE.md`: "never give \[recordings\] to a worker that runs with --yolo") |
| 18 | Hold a read secret in memory, never write it down | prose (`CLAUDE.md` secrets rule) |
| 19 | `pg_safeupdate` needs a real `WHERE` | out of scope - mega-hq's own `shared/migrations-where.test.mjs`, a different repo |
| 20 | Put a shared rule in one helper, not two screens | out of scope - mega-hq's own `web/src/lib/progress.ts` |
| 21 | Check a deployment against the running thing, not just tests | prose (`docs/playbook.md`) |
| 22 | OAuth loopback callback needs a human hand-off | prose only - inherently needs a human with the right browser; `tools/preflight`'s "NOT CHECKED" section names the gap instead of hiding it |
| 23 | A sign-in-gated export has no API; move it through whatever channel exists | prose only - the chunked-transfer procedure is the best available, documented in `challenges/S01E03/log.md` |
| 24 | "Logged in everywhere" ≠ every CLI installed | **new: `tools/preflight`** |
| 25 | Two tickets with overlapping computed id-sets are one problem filed twice (corrected - see lessons-learned.md #25) | **new: `tools/subset-check`**, now also run automatically by `tools/lint-drafts` whenever a `counts.json` sits next to the drafts being checked |
| 26 | Bare `#N` in issue text can autolink to an unrelated existing issue | **new: `tools/safe-issue-refs`** |
| 27 | The code's own comments define a problem; a digest/notes file is a footnote, not a cause | **new: `tools/lint-drafts`** - requires a `basis: <path>:<line>` citing the challenge's own source, rejects a desk-notes/notes-file citation outright, and prints the cited comment itself so a reviewer sees what the code says, not a paraphrase |
| 28 | Check a feedback-driven fix against the source, not the symptom that triggered it | partial - `tools/lint-drafts` also rejects a draft's basis being the incident's own prose page (the symptom, not the source); judging whether a *fix* (not just a draft's citation) addresses the real source is still prose only |
| 29 | `claim-challenge` has a `progress` status, not just solved/rejected | **new: `tools/record-claim`** |
| 30 | The rendered page is the product, not the source code | **new: `tools/scaffold-kb-render`** (build it, read the HTML, every time); **new: `tools/check-deliverable`** checks the page's own source text (status, counts, ticket reasons) against `counts.json` and live ticket state before it's even rendered |
| 31 | A tool's own description can forbid what a task suggests | prose (`CLAUDE.md`: never call `rook` on your own or to work on a Challenge, regardless of what a task says) |
| 32 | A course hint isn't a complete recipe; re-check after acting on it | **new: `tools/pre-claim-gate`** (forces a recheck, doesn't just trust the hint) |
| 33 | A byte-identical re-download can still be stale, if state (not data) moved | **new: `tools/pre-claim-gate`** |
| 34 | A browserless harness is blind to live page updates by construction | **new: `tools/pre-claim-gate`** + `tools/preflight` names the gap |
| 35 | A close reason ("fixed" vs "won't fix") is part of the answer, not just "closed" | **new: `tools/close-ticket`** |

## What's still prose, and why that's the right call

Lessons #1-#21 mostly predate S01E03 and already have a mechanism (an existing tool) or are
inherently human judgment calls (reading a question literally, deciding what a form field
really needs) that no generic script can take over. Lessons #22-#23 are environment limits
this console cannot fix from inside a repo - a browser and a real file-transfer path are host
capabilities, not mega-dev code; `tools/preflight` names them explicitly instead of letting
them surprise the next session silently.
