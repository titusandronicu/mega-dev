# Prep 2026-11-11 (automated, read-only)

## (a) Reached / not reached
- Reached: this repo (playbook, lessons-learned 1-61, tool-ideas, challenge folders S01E01-S03E01, prep-notes archive).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403` (agent proxy); WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev`. hq.mega.dev has to be allowed in the routine's network settings.
- Today's Challenge page: not reached, not searched for further.

## (b) Challenge title, code, description
Could not reach the Challenge; content unknown. Not guessing. (Latest folder in the repo is S03E01, solved 2026-11-09; no folder for 2026-11-10 either.)

## (c) Declared contract
None found. Nothing was fetched from hq.mega.dev, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist (docs/playbook.md)
- [ ] `tools/preflight`, `tools/whereami`; create `challenges/<code>/` with log.md ("Tries used / left" at top); read retro findings with status `applied`/`proposed`.
- [ ] Find the contract in the page source (schema.json, service-desc, describedby, form fields); quote it before building a body; never send a guess to learn from the error. Use the `read` skill.
- [ ] Read the question literally.
- [ ] Text limits: keep list first, count with a script, show the human every cut.
- [ ] Facts that change (models, versions, prices): memory answer, then a dated live maker page; ask before changing a sent answer.
- [ ] Recordings: `tools/transcribe`, confirm with `tools/speech-offsets`, answer only the asked event; one source-reader per source, never mix clocks.
- [ ] Mixed-file requirements (S03E01): read CLAUDE.md and `tools/` first; cite each requirement to file and place; list every tag incl. retracted; conflicts go to the owner, not picked.
- [ ] First `claim-challenge`: `receipts: {}`; then `tools/record-claim`; before any later claim `tools/pre-claim-gate` (human re-reads live page).
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Publishing a page/link: read served bytes for marker and external refs; check from outside the tailnet.
- [ ] Hand-offs: label every fact with its source; `handoff.md` + `tools/check-handoff`.
- [ ] Never call `rook`. Redact before commit.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network settings so prep can read llms.txt and /challenges (same blocker as the six archived prep notes in docs/prep-notes/)?
2. What is today's Challenge code (probably S03E03; S03E02 has no folder here, was it skipped or unrecorded)? Paste its page source so the contract can be read.
3. Approve or reject the retro findings still marked `proposed` (e.g. S01E02 subagent-per-source skill) before they are needed?
