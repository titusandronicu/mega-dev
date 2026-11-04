# Prep 2026-11-04 (automated, read-only)

## (a) Reached / not reached
- Reached: this repo (playbook, lessons, tool-ideas, challenge folders S01E01-S02E02, docs/prep-notes).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403` (agent proxy); WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev`. hq.mega.dev is outside this session's allowed network domains.
- Today's Challenge page: not reached, not searched for.

## (b) Challenge title, code, description
Could not reach the Challenge; content unknown. Not guessing. (Latest folder in the repo is S02E02, which has a debrief and retro.)

## (c) Declared contract
None found. Nothing was fetched from hq.mega.dev, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist (docs/playbook.md)
- [ ] `tools/preflight` and `tools/whereami`; create `challenges/<code>/` with log.md ("Tries used / left" at top).
- [ ] Find the contract in the page source (schema.json, service-desc, describedby, form fields); quote it before building a body; never send a guess to learn from the error.
- [ ] Read the question literally.
- [ ] Text limits: keep list first, count with a script, show the human every cut.
- [ ] Changing facts (models, versions, prices): memory answer plus confidence, then a dated live maker source.
- [ ] Recordings: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked.
- [ ] Agent-by-email: run `node evals/rehearse.mjs 2` in `challenges/S02E02/agent` before the first claim; enforce answer format in code; only the trusted sender gets work.
- [ ] After each `claim-challenge`: `tools/record-claim`; before a later claim: `tools/pre-claim-gate` (human re-reads live page).
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Never call `rook`. Run `redact.mjs --check` before commit. Read `retro.md` findings with status `proposed`/`applied` first.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network settings so prep can read llms.txt and /challenges?
2. What is today's Challenge code (probably S02E03)? Paste its page source so the contract can be read.
3. Approve or reject the `proposed` retro findings (S01E04, S01E05, S02E01, S02E02) before they are needed?
