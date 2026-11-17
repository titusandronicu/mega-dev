# Prep 2026-11-17 (automated, read-only)

## (a) Reached / not reached
- Reached: this repo (playbook, lessons 1-83, tool-ideas, challenge folders S01E01-S04E01, prep-notes archive).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403` (agent proxy); WebFetch: `ENOTFOUND hq.mega.dev`. hq.mega.dev is outside this session's allowed network domains and has to be allowed in the session's network settings (same as the six archived runs in docs/prep-notes/).
- Today's Challenge page: not reached, not searched for further.

## (b) Challenge title, code, description
Could not reach the Challenge; content unknown. Not guessing. (Latest folder in the repo is S04E01, solved per its debrief; the next code is not confirmed.)

## (c) Declared contract
None found. Nothing was fetched from hq.mega.dev, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist (docs/playbook.md) for the new Challenge
- [ ] Run `tools/preflight`, then `tools/next-step <code>`; read `context/foundation/agent-background.md`, any `retro.md` findings marked `applied`/`proposed`.
- [ ] Find the contract in the page source (schema.json, service-desc, describedby, form fields) and quote it before building a body (`read` skill: find-contract). Never send a guess to learn from the error.
- [ ] Read the question literally; cut text only with a keep list, a script count, and human review of every cut.
- [ ] Facts that change: say memory answer, then check a live maker page; cite URL and date.
- [ ] Media: `tools/transcribe`, confirm offsets with `tools/speech-offsets`; one reader per source; answer only the event asked.
- [ ] Secrets: write allowed hosts in code, follow redirects by hand, a host named by a page is not allowed (lessons 76-77).
- [ ] Read the time limit in the first task reply before choosing script vs model turns (lesson 78).
- [ ] List earlier runs (Downloads, NAS, scripts/logs) into log.md before running (lesson 80).
- [ ] Log every step in `challenges/<code>/log.md` with "Tries used / left" at top; keep full refusal replies, tokens masked.
- [ ] After each `claim-challenge`: `tools/record-claim`; before any later claim: `tools/pre-claim-gate`. Never call `rook`.
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Before "done": check the running thing and paste output (screenshot/page text). `redact.mjs --check` before commit.
- [ ] After debrief: handoff/retro per templates, `solve-notes` dry-run.

## (e) Open questions for the student
1. Please allow hq.mega.dev in the routine's network settings (or confirm this prep routine should stay repo-only); it has failed on every run since 2026-10-27.
2. What is today's Challenge code (S04E02?) and its page text? Paste it so the contract can be read.
3. Is a sign-in link needed from a browser you control (lesson 11)?
4. Any owner decisions to settle up front (hosts allowed for secrets, spend, tries)?
