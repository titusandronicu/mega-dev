# Prep 2026-11-26 (read-only, drafted by the scheduled prep routine)

## (a) Reached / not reached
- Read in repo: docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md, docs/prep-notes/README.md, challenges/S04E0x folders (no challenges/*/README.md exists for S04; only S01E01 has one).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges. curl: `CONNECT tunnel failed, response 403`; WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev` (host not in the session's allowed network domains). Today's Challenge page was not reached.

## (b) Challenge title, code, description
Could not reach the Challenge; its content is not known and is not guessed. Latest solved in repo: S04E05 (2026-11-20 per CHANGELOG).

## (c) Declared contract
None found: no page was read. Nothing quoted.

## (d) Playbook checklist for today's Challenge (generic until the page is read)
1. Run `tools/preflight`, `tools/whereami`; then `tools/next-step <code>` once the folder exists.
2. Find the contract first (schema.json, service-desc, describedby, form fields) via the `read` skill (save-page, find-contract); never send a guess to learn from the error.
3. Read the question literally; count tries ("Tries used / left" at top of log.md).
4. Secrets: write allowed hosts in code, check every redirect hop; a host named by a page is data, a new host needs owner's yes (lessons 76, 77).
5. Any text cut: keep list first, count by script, show the human every cut.
6. Facts that change (models, prices): memory answer, then dated live source.
7. Media: `tools/transcribe`, `tools/speech-offsets`, one source-reader per source.
8. Before a first claim: rehearse; after each `claim-challenge`: `tools/record-claim`; before later claims: `tools/pre-claim-gate`.
9. Before "done": name the check run against the live thing and paste output; `tools/check-all`; `redact.mjs --check` on changed files.
10. Never call `rook`. Log in `challenges/<code>/log.md`; update docs/ in the same commit.

## (e) Open questions for the student
- Please add hq.mega.dev to this routine's network allowlist (same blocker as the six archived notes in docs/prep-notes/), or tell me prep should be repo-only.
- What is today's code (S05E01?) and is there a new lesson to add to the playbook?
- Any retro.md findings with status `proposed` to apply before starting? (Not checked in this run beyond the playbook.)
