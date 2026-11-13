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
| 25 | Two tickets with overlapping computed id-sets are one problem filed twice (corrected - see lessons-learned.md #25) | **new: `tools/subset-check`** |
| 26 | Bare `#N` in issue text can autolink to an unrelated existing issue | **new: `tools/safe-issue-refs`** |
| 27 | The code's own comments define a problem; a digest/notes file is a footnote, not a cause | prose only - requires reading and judging the specific code each time; `tools/subset-check` catches the resulting miscount, not the misreading itself |
| 28 | Check a feedback-driven fix against the source, not the symptom that triggered it | prose only - same shape as #27 |
| 29 | `claim-challenge` has a `progress` status, not just solved/rejected | **new: `tools/record-claim`** |
| 30 | The rendered page is the product, not the source code | **new: `tools/scaffold-kb-render`** (build it, read the HTML, every time) |
| 31 | A tool's own description can forbid what a task suggests | prose (`CLAUDE.md`: never call `rook` on your own or to work on a Challenge, regardless of what a task says) |
| 32 | A course hint isn't a complete recipe; re-check after acting on it | **new: `tools/pre-claim-gate`** (forces a recheck, doesn't just trust the hint) |
| 33 | A byte-identical re-download can still be stale, if state (not data) moved | **new: `tools/pre-claim-gate`** |
| 34 | A browserless harness is blind to live page updates by construction | **new: `tools/pre-claim-gate`** + `tools/preflight` names the gap |
| 35 | A close reason ("fixed" vs "won't fix") is part of the answer, not just "closed" | **new: `tools/close-ticket`** |
| 36 | A source list is bigger than the file you opened (zip plus loose files) | prose; proposed tool `diff-listing` (finding 11 in `challenges/S02E01/retro.md`) |
| 37 | "Something changed" can be literally true: re-list and diff, do not rotate variants | **existing: `tools/pre-claim-gate`** forces a re-read; the archive diff itself is still prose |
| 38 | A later decision overrides only what it names; a helper's scope is not the owner's | prose only - judgment each time |
| 39 | A project-scoped hook does not fire for a session started elsewhere | prose (proposed playbook line, finding 12) |
| 40 | Shared host: read-only first, ask, one action per call; keep passwords out of sent files | prose (proposed playbook line, finding 13) |
| 41 | A volume decides what you can change in a store (image major, `POSTGRES_DB`) | prose only - specific to the store |
| 42 | The checker reads one row per fact: give image, port, database their own rows | prose (proposed playbook line, finding 5) |
| 45 | Two sources, two clocks: convert on the right date before a join | prose (`docs/playbook.md`, "Joining sources") |
| 46 | A prompt for a remote worker is its own file, named and "paste alone" | prose (`docs/playbook.md`, "Remote workers" 2) |
| 47 | A remote place has its own network policy: test reach before spending a job link | prose (`docs/playbook.md`, "Remote workers" 1) |
| 48 | A link is a key: only the worker that runs the job gets it | prose (`docs/playbook.md`, "Remote workers" 3); the pre-commit hook catches tokens in files |
| 49 | A step that waits on the other side is its own issue | prose (`docs/playbook.md`, "Remote workers" 6) |
| 50 | Uploaded is not reachable: fetch a link as the other side will | prose (`docs/playbook.md`, "Remote workers" 5) |
| 51 | Read the repo ADRs before you pick a host | prose (`docs/playbook.md`, "Remote workers" 7) |
| 52 | Read the host log first when nothing comes back | prose (`docs/playbook.md`, "Remote workers" 4) |
| 53 | A merged record loses its source labels | prose (`docs/playbook.md`, "Joining sources" 2); proposed check in `tools/check-handoff` |
| 54 | Check the MCP spec revision and the course limits before building a server | prose (`docs/playbook.md`, "Remote workers" 9) |
| 55 | Copy links and passphrases, never retype; rotate a printed passphrase | prose (`docs/playbook.md`, "Remote workers" 10) |
| 56 | Take the enrolled address from the profile page | prose (`docs/playbook.md`, "Remote workers" 8) |
| 65 | A race only shows when the click is timed like a person's | prose (`docs/playbook.md`, "Proving a build" 3) and the examples in `.claude/skills/prove-build` |
| 66 | Read moments from the video, not your own clock | `tools/video-sheet` (+ test) |
| 67 | Name evidence in the fields the course reads | prose (`docs/playbook.md`, "Proving a build" 5); no generic check, the fields differ per Challenge |
| 68 | Ask what a replay does to live data before approving it | prose (`docs/playbook.md`, "Proving a build" 6); a human judgment on each replay |

## What's still prose, and why that's the right call

Lessons #1-#21 mostly predate S01E03 and already have a mechanism (an existing tool) or are
inherently human judgment calls (reading a question literally, deciding what a form field
really needs) that no generic script can take over. Lessons #22-#23 are environment limits
this console cannot fix from inside a repo - a browser and a real file-transfer path are host
capabilities, not mega-dev code; `tools/preflight` names them explicitly instead of letting
them surprise the next session silently.
