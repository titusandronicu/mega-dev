# Prep 2026-11-13 (automated, read-only)

## (a) Reached / not reached
- Could NOT reach hq.mega.dev: curl got `CONNECT tunnel failed, response 403` from the session proxy; WebFetch got `getaddrinfo ENOTFOUND hq.mega.dev`. `hq.mega.dev` is not in this session's allowed network domains.
- Reached: this repo only (playbook, lessons, tool-ideas, challenges/S01E01/README.md; latest challenge folders end at S03E04).
- Could not reach today's Challenge, so its content is not guessed.

## (b) Challenge title, code, description
Unknown. Not reached. Do not infer the code from the folder list (S03E02 and S03E04's successor are not confirmed).

## (c) Declared contract
None found: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges were not fetched.

## (d) Playbook checklist (docs/playbook.md), to apply once the page is open
1. `tools/preflight`, `tools/next-step <code>`; read `retro.md` findings with status `applied`/`proposed`.
2. Find the contract before any body: page HTML links (schema.json, service-desc, describedby), form fields, hidden "unavailable" links. Quote it. Use the `read` skill (save-page, find-contract; needs signed-in browser from the human).
3. Never send a guess to learn from the error; note "Tries used / left" at the top of `log.md` and `handoff.md`.
4. Read the question literally; check live dated sources for facts that change.
5. If text must be cut: keep list first, count by script, show the human every cut.
6. Media: `tools/transcribe`, `tools/speech-offsets`; cite file and place; list every tag, conflicts go to the owner.
7. Joining sources: write each clock and offset (Europe/Warsaw is UTC+1 now).
8. After each `claim-challenge`: `tools/record-claim`; before any later claim: `tools/pre-claim-gate`.
9. Remote workers/links: one read-only request from the remote place to the course host first; links expire in about a day.
10. Before "done": check against the running thing and paste output; `redact.mjs --check` before commit; one log per challenge in `challenges/<code>/log.md`; never call `rook`.

## (e) Open questions for the student
- Please allow `hq.mega.dev` in this routine's network settings, or paste today's Challenge page and `llms.txt`, so the next prep can read them.
- What is today's Challenge code (needed for the folder name and `tools/next-step`)?
- Is a signed-in browser available today for contract reading?
