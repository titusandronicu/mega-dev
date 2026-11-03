# Prep 2026-10-29 (prep only, nothing sent to the course)

## (a) Reach
- Could not reach hq.mega.dev. `curl` to https://hq.mega.dev/llms.txt and /challenges: proxy CONNECT tunnel 403. `WebFetch`: host does not resolve (outside the session's allowed network domains).
- Not reached: llms.txt, /challenges, today's Challenge page.
- Read in this repo: docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md, challenges/S01E01/README.md (the only README; S01E02 and S01E03 have none).

## (b) Challenge title, code, description
Could not reach the Challenge, so title, code and description are unknown. I did not guess. The folder is named by date for that reason.

## (c) Declared contract
None found, because nothing was reachable. Nothing quoted.

## (d) Playbook checklist for today's Challenge
Run `tools/preflight` first, then read any `retro.md` findings with status `applied` or `proposed` (S01E02 has a retro.md).
- [ ] Find the contract before building a body: page HTML links (schema.json, service-desc, describedby), form fields. Use `find-contract.mjs <saved page> --base <url>` after `save-page.mjs`. A file marked "unavailable" may still have a real link in the source. `--open` has no cookies, so read signed-in contracts from the browser session.
- [ ] Never send a guess to learn from the error; each refusal can cost a try.
- [ ] Read the question literally (a fact lookup is not a question about me).
- [ ] Text to a limit: keep list first, count with a script (`cut-diff.mjs`), show the human every cut before posting.
- [ ] Facts that change (newest model, version, price): give memory answer plus confidence, then check a live maker page; cite URL and date; ask the human before changing a sent answer.
- [ ] Recordings: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked (decoy times).
- [ ] Tickets / kb: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`, `tools/scaffold-kb-render`.
- [ ] After each `claim-challenge`: `tools/record-claim <code> <reply.json>`; before any later claim: `tools/pre-claim-gate <code>`. Handle `progress`, not just solved/rejected. A human must re-read the live page after a non-solved reply (lessons 33-34).
- [ ] Never call `rook`. After a 429, stop. Run `redact.mjs --check` before commit.
- [ ] Write `log.md` per step, `handoff.md` before handing over, then debrief, `retro.md` and the HQ ingest (dry-run first).

## (e) Open questions for the student
1. hq.mega.dev is not in this session's allowed network domains. Allow it, or paste today's Challenge page / llms.txt, if you want a real prep.
2. What is today's Challenge code (S01E04?) so the folder can be renamed?
3. Is the S01E02 retro.md still waiting on owner approval of its proposals?
