# Prep 2026-11-09 (Monday)

## (a) Reached / not reached
- Not reached: `https://hq.mega.dev/llms.txt` and `https://hq.mega.dev/challenges`. curl: proxy answered CONNECT 403. WebFetch: DNS failed (host not in the session's allowed network domains). Today's Challenge page was not found.
- Reached: this repo (playbook, lessons-learned, tool-ideas, challenges/*). Latest recorded Challenge: S02E05, solved 2026-11-06.

## (b) Challenge title, code, description
Not reached; nothing guessed. The next code is probably S02E06 or a new season, but that is unconfirmed.

## (c) Declared contract
None found, nothing was read. Playbook step 1 still applies once the page is open: look in the HTML for schema.json, service-desc, describedby links and form fields.

## (d) Playbook checklist for this Challenge
1. Run `tools/preflight` and `tools/whereami`. Read `docs/playbook.md` and any `retro.md` findings marked `applied` or `proposed`.
2. Find the contract first (`find-contract.mjs <saved page> --base <url>`). Quote it before building a body. Never send a guess to learn from an error.
3. Read the question literally. Write the keep list first if there is a character limit; count with a script; show the human every cut.
4. Facts that change (newest model, price): give the memory answer, then check a live maker page and cite URL and date.
5. Recording challenge: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, answer only the event asked, convert clocks to one zone in the log.
6. Remote worker or public link: make one read-only request from that place to the course host first. Check the link as the other side opens it.
7. Log in `challenges/<code>/log.md` with "Tries used / left" at the top. After each claim run `tools/record-claim`. Before a second claim run `tools/pre-claim-gate`. Never call `rook`.
8. Before a commit run `redact.mjs --check`. Before "done", name a check run against the live page and paste its output.

## (e) Open questions for the student
- Add `hq.mega.dev` to the routine's network allowlist. The prep notes archived in `docs/prep-notes/` all hit the same block, so the routine has never read Challenge content.
- Paste today's Challenge page (or its saved HTML) so the contract can be extracted.
- Which code is today's, and how many tries does it allow?
