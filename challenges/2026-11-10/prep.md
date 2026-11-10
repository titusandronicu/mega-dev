# Prep 2026-11-10 (automated, read-only)

## (a) Reached / not reached
- Reached: this repo (playbook, lessons 1-61, tool-ideas, challenge folders S01E01-S03E01, retros).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403` (agent proxy); WebFetch: `ENOTFOUND hq.mega.dev`. The host is outside this session's allowed network domains and has to be allowed in the environment's network settings.
- Today's Challenge page: not reached, not searched for further.

## (b) Challenge title, code, description
Could not reach the Challenge; content unknown. Not guessing. (Latest folder in the repo is S03E01, solved 2026-11-09.)

## (c) Declared contract
None found. Nothing was fetched from hq.mega.dev, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist applied (docs/playbook.md)
- [ ] Run `tools/preflight` (ran today: gh, git, node, python3, ICU ok) and `tools/whereami`; create `challenges/<code>/` with log.md ("Tries used / left" at top).
- [ ] Find the contract in the page source (schema.json, service-desc, describedby, form fields); quote it before building a body; never send a guess to learn from the error.
- [ ] Read the question literally.
- [ ] Mixed-file requirements (S03E01): read `CLAUDE.md` and `tools/` first; read each source by its kind (transcribe audio, look at images/frames, screenshot canvases); cite file and place; list every tag seen incl. retracted; heard tags are guesses; contradictions go in `conflicts` with one question; first claim sends `receipts: {}`.
- [ ] Text limits: keep list first, count with a script, show the human every cut.
- [ ] Facts that change (models, versions, prices): memory answer, then a dated live source.
- [ ] Recording: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked.
- [ ] Sources: list all, diff the listing against what was read (lessons 36-37); convert clocks on the right date (lesson 45).
- [ ] After every `claim-challenge`: `tools/record-claim`; before any later claim: `tools/pre-claim-gate` (a human re-reads the live page).
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Remote workers/links: read-only reach test first; prompt in its own file; links are keys (lessons 46-48).
- [ ] Never call `rook`. Run `redact.mjs --check` before commit.
- [ ] Retro findings with status `proposed` (need owner approval before applying) exist in: S01E02 (1), S01E03 (1), S01E04 (1), S01E05 (2), S02E01 (12), S02E02 (4), S02E04 (2), S03E01 (2). Counts are grep matches of the word "proposed", not verified findings.

## (e) Open questions for the student
1. Allow hq.mega.dev in the routine environment's network settings so prep can read llms.txt and /challenges? (Same blocker on every prep run since 2026-10-27.)
2. What is today's Challenge code (probably S03E02)? Paste its page source so the contract can be read.
3. Approve or reject the `proposed` retro findings, starting with S02E01 (12)?
