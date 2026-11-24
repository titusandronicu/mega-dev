# Prep 2026-11-24 (automated, read-only)

## (a) Reached / not reached
- Could NOT reach hq.mega.dev. `curl https://hq.mega.dev/llms.txt` and `/challenges`: proxy "CONNECT tunnel failed, response 403". WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev` (host is outside this session's allowed network domains).
- Reached: repo files only (docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md). No `challenges/*/README.md` exists; folders hold log.md/debrief.md/retro.md. Latest solved per CHANGELOG: S04E05 (2026-11-20).

## (b) Challenge title, code, description
Not reached; content not guessed. (The code of today's Challenge is unknown.)

## (c) Declared contract
None found: no page was fetched. Nothing to quote.

## (d) Playbook checklist (generic, not yet applied to a known Challenge)
- Run `tools/preflight`; `tools/next-step <code>` once the code is known; read any `retro.md` findings with status `applied` or `proposed`.
- Before the first send: find the contract in the page HTML (schema.json, service-desc, describedby, form fields) and quote it; never send a guess to learn from the error; read the question literally.
- Cutting text: keep list first, count by script, show the human every cut.
- Facts that change: state memory answer and confidence, then check a dated maker page.
- Recordings: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked.
- Secrets: allowed hosts in code, check every redirect hop; a host a page names is not allowed (lesson 77).
- Claims: `tools/record-claim` after each; `tools/pre-claim-gate` before any second claim; record "Tries used / left" at top of log.md.
- Remote workers: one read-only request from the worker to the course host first.
- Before commit: `redact.mjs --check`; `tools/check-all` before merge. Never call `rook`.

## (e) Open questions for the student
1. Can `hq.mega.dev` be added to this routine's allowed network domains? Without it, daily prep cannot read anything.
2. What is today's Challenge code (probably the start of a new season, S05E01?), so the folder can be renamed from the date?
3. Should prep keep using a date-named folder when the code is unknown?
