# Prep 2026-11-19 (automated, read-only)

## (a) Reached / not reached
- Could NOT reach hq.mega.dev. curl: proxy answered 403 to CONNECT; WebFetch: host does not resolve (outside the session's allowed network domains). Nothing from llms.txt, /challenges or today's page was read.
- Read locally: docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md, challenges/*/README.md (only S01E01 has one). Latest local folder: S04E03.

## (b) Challenge title, code, description
Unknown: not reachable, not guessed. Last challenge in the repo is S04E03; today's code is unconfirmed.

## (c) Declared contract
None found (no live page read). Earlier contract location for reference only: S01E01 schema at `/challenges/where-the-story-begins/api/schema.json`. Check page source for schema.json / service-desc / describedby links before building any body.

## (d) Playbook checklist (docs/playbook.md) for today's Challenge
- [ ] `tools/preflight`, `tools/whereami`; read retro.md findings with status applied/proposed.
- [ ] Find and quote the contract (page HTML links, form fields) before any body; never send a guess to learn from the error.
- [ ] Read the question literally; decoys in recordings/text.
- [ ] Text cuts: keep list first, count with a script, show human every cut.
- [ ] Facts that change: memory answer + live dated source.
- [ ] Recordings: `tools/transcribe`, `tools/speech-offsets`; one source-reader per recording.
- [ ] Keep log in `challenges/<code>/log.md` with "Tries used / left" on top; tokens redacted.
- [ ] After each claim: `tools/record-claim`; before 2nd claim: `tools/pre-claim-gate`; human re-reads live page after a refusal.
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Never call `rook`; secrets only to allowed hosts; `redact.mjs --check` before commit.
- [ ] Before "done": run a check against the live thing and paste output/screenshot.

## (e) Open questions for the student
1. Please allow hq.mega.dev in this routine's network settings, or paste today's challenge page/llms.txt.
2. Today's code (S04E04?) and the number of tries allowed?
3. Is the hq.mega.dev sign-in needed for the brief (prep cannot sign in)?
