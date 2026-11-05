# Prep 2026-11-05 (automated, read-only)

## (a) Reached / not reached
- Repo files read: docs/playbook.md, docs/lessons-learned.md, docs/tool-ideas.md, challenges/S01E01/README.md (only README present).
- NOT reached: https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges.
  - curl: `CONNECT tunnel failed, response 403` (agent proxy blocks the host).
  - WebFetch: `getaddrinfo ENOTFOUND hq.mega.dev` (host outside the session's allowed network domains).
- hq.mega.dev has to be added to this routine's environment network allowlist for prep to work.

## (b) Challenge title, code, description
Could not reach the Challenge, so none is known. Not guessing. Latest local folders: S02E01, S02E02 (both with debrief/retro); today's code is unknown (probably S02E03, unconfirmed).

## (c) Declared contract
None found (no page fetched). Nothing quoted.

## (d) Playbook checklist (docs/playbook.md), applied
- [ ] `tools/preflight`, then `tools/whereami` if a command fails.
- [ ] Read any `retro.md` findings with status `applied`/`proposed` (S02E01, S02E02).
- [ ] Find the contract before building a body: page HTML links (schema.json, service-desc, describedby), form fields; quote it. Don't send a guess to learn from an error.
- [ ] Read the question literally; ask the human before changing a sent answer.
- [ ] Text cutting: keep list first, count with a script, show every cut, log what the server says was lost.
- [ ] Changing facts (newest model/price): state memory answer + confidence, check a live maker page, cite URL and date.
- [ ] Recording challenge: `tools/transcribe`, confirm with `tools/speech-offsets`, answer only the event asked.
- [ ] Agent-by-email challenge: run `node evals/rehearse.mjs 2` in challenges/S02E02/agent until "REHEARSAL PASSED"; trusted sender only; keys never in repo.
- [ ] Tickets: `tools/subset-check`, `tools/safe-issue-refs`, `tools/close-ticket`.
- [ ] Claims: `tools/record-claim` after each; `tools/pre-claim-gate` before any later claim.
- [ ] Create `challenges/<code>/` with log.md; put "Tries used / left" at top. Never call `rook` on your own.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network settings (or paste today's challenge page)?
2. What is today's code (S02E03?) and its title/description?
3. Is the Challenge type one of the known shapes (recording, kb, agent-by-email, form)?
4. Tries limit and any contract link visible after sign-in?
