# Prep 2026-10-30 (automated, read-only)

## (a) Reached / not reached
- Repo docs: reached (playbook, lessons-learned, tool-ideas, challenges/S01E01 README; S01E02 and S01E03 have no README, only logs/debriefs).
- https://hq.mega.dev/llms.txt, /challenges and today's Challenge page: NOT reached. `curl` got a 403 on the proxy CONNECT; WebFetch got `ENOTFOUND hq.mega.dev`. hq.mega.dev has to be allowed in this session's network settings.

## (b) Challenge title, code, description
Could not reach the Challenge; its content is unknown and not guessed. The last Challenge in the repo is S01E03 (solved). Today's code is probably the next in sequence, but that is unconfirmed.

## (c) Declared contract
None found (no page reached). Past Challenges declared theirs via `<link rel=service-desc>` in the signed-in page HTML (S01E01 schema at `/challenges/where-the-story-begins/api/schema.json`, per `challenges/S01E01/README.md`). Check the same on today's page.

## (d) Playbook checklist for this Challenge (docs/playbook.md)
- [ ] `tools/preflight` first.
- [ ] Find the contract in page HTML (schema.json, service-desc, describedby, form fields). Use `.claude/skills/read` (save-page, find-contract); quote it before building a body.
- [ ] Never send a guess to learn from the error.
- [ ] Read the question literally.
- [ ] If text has a limit: write the keep list, count with a script, show the human every cut.
- [ ] Facts that change (models, versions, prices): memory answer plus confidence, then a dated live maker source.
- [ ] Recordings: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked.
- [ ] Tickets/kb: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`, `tools/scaffold-kb-render`.
- [ ] After each `claim-challenge`: `tools/record-claim`; before any later one: `tools/pre-claim-gate` (a human re-reads the live page).
- [ ] Never call `rook`. Redact before commit (`redact.mjs --check`). Log in `challenges/<code>/log.md`.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network policy, or paste today's Challenge text.
2. What is today's code (S01E04?) and is it signed-in only?
3. Should the routine also get a way to see signed-in pages (lesson 34: a browserless harness is blind to live state)?
