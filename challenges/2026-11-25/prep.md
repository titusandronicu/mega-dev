# Prep 2026-11-25 (prep only, nothing sent to the course)

## (a) Reached / not reached
- Read in repo: docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md, challenges/*/ (latest folder S04E05; last CHANGELOG entry 2026-11-20).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. WebFetch failed with `getaddrinfo ENOTFOUND hq.mega.dev` (host is not in this session's allowed network domains, or does not resolve). A first `curl` GET returned HTTP 000 and a second was blocked by the permission classifier; I did not retry around it.
- Today's Challenge page: not reached. Not guessed.

## (b) Challenge title, code, description
Could not reach the Challenge, so title, code and description are unknown. (Probably S05E01 or the next code after S04E05, but unconfirmed.)

## (c) Declared contract
None found: nothing was fetched from hq.mega.dev.

## (d) Playbook checklist (docs/playbook.md), generic until the page is read
1. `tools/preflight`, then read `docs/playbook.md` and any `retro.md` findings with status applied/proposed.
2. Find the contract first (schema.json, service-desc, describedby links, form fields). Never send a guess to learn from the error. Read the question literally.
3. Texts: write the keep list first, count by script, show the human every cut.
4. Facts: state memory answer plus confidence, then check a live dated source.
5. Media: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, one source-reader per source, label each fact with its source.
6. Tickets/analysis: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
7. Claims: `tools/record-claim` after every `claim-challenge`; `tools/pre-claim-gate` before any later one; a human re-reads the live page after a refusal.
8. Secrets only to allowed hosts, check redirect hops; new host needs owner's yes. Never call `rook`.
9. Log each step in `challenges/<code>/log.md`; write handoff.md before handing over.

## (e) Open questions for the student
- Please add `hq.mega.dev` to this environment's allowed network domains, or paste today's Challenge text, so the next prep can read it.
- What is today's Challenge code and title?
- Are there declared contract links on the page (schema, service-desc, describedby)?
