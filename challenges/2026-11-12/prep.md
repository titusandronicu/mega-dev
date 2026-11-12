# Prep 2026-11-12 (automated, read-only)

## (a) Reached / not reached
- Reached: this repo (playbook, lessons 1-64, tool-ideas, challenge folders S01E01-S03E03, retros).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403` (agent proxy); WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev`. hq.mega.dev has to be allowed in this routine's network settings.
- Today's Challenge page: not reached, not searched for.

## (b) Challenge title, code, description
Could not reach the Challenge; content unknown. Not guessing. (Latest folder in the repo is S03E03.)

## (c) Declared contract
None found. Nothing was fetched from hq.mega.dev, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist applied (docs/playbook.md)
- [ ] Run `tools/preflight`, `tools/whereami`, then `tools/next-step <code>`; create `challenges/<code>/` with log.md ("Tries used / left" at top).
- [ ] Read retro findings with status `proposed` first (several remain in S01E04, S01E05, S02E01, S02E02, S02E04, S03E01); they need owner approval before being applied.
- [ ] Find the contract in the page source (schema.json, service-desc, describedby, form fields); quote it before building a body; never send a guess to learn from the error. Use `.claude/skills/read` (save-page, find-contract).
- [ ] Read the question literally.
- [ ] Text limits: keep list first, count with a script, show the human every cut.
- [ ] Facts that change (models, versions, prices): memory answer, then a dated live source.
- [ ] Recordings/mixed files: `tools/transcribe`, `tools/speech-offsets`; one reader per source; list every tag incl. retracted; screenshot canvases (lessons 57-60).
- [ ] Archives/sources: diff listing against what was read (lessons 36-37); convert clocks on the right date (lesson 45).
- [ ] Claims: `receipts` on every call (lesson 61); `tools/record-claim` after each; `tools/pre-claim-gate` before any later one (a human re-reads the live page).
- [ ] Unattended owner rounds: only the ship line `asked` before the owner's answer; answer is a thread entry (lessons 62-64); `tools/check-ask-order`.
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Remote workers/shared hosts: read-only reach test first, one action per call, links are keys (lessons 40, 47, 48).
- [ ] Never call `rook`. Run `redact.mjs --check` before commit.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network settings? Seven prep runs now (10-27 to 11-12 minus archived ones) have had no course content.
2. What is today's Challenge code (S03E04?)? Paste its page source so the contract can be read.
3. Approve or reject the `proposed` retro findings so they can be applied before they are needed?
