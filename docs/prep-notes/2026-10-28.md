# Prep 2026-10-28 (read-only, automated)

## (a) Reached / not reached
- Repo docs: reached (playbook, lessons-learned, tool-ideas, challenges/S01E01/README.md; S01E02 has no README).
- https://hq.mega.dev/llms.txt and https://hq.mega.dev/challenges: NOT reached. Host did not resolve (getaddrinfo ENOTFOUND); hq.mega.dev is not in this session's allowed network domains.
- Today's Challenge page: not reached.

## (b) Challenge title, code, description
Could not reach the Challenge, so nothing is known. Repo history ends at S01E02 (solved); the code of today's Challenge is not confirmed (likely S01E03, unverified).

## (c) Declared contract
None found. No URL was readable, so no schema, service-desc, describedby link, form fields or limits to quote.

## (d) Playbook checklist for this Challenge
Before the first send
- [ ] Find the contract in page HTML (schema.json, service-desc, describedby, form fields); a link marked "unavailable" may still exist in the source. Quote it before building a body.
- [ ] Never send a guess to learn from the error.
- [ ] Read the question literally.
If text must be cut: keep list first, count with a script (cut-diff.mjs), show the human every cut, log what was lost.
If a fact can change (newest model, version, price): give memory answer + confidence, check a live maker page, cite URL and date; ask before changing a sent answer.
If a recording: `tools/transcribe`, confirm offsets with `tools/speech-offsets`, majority of several runs, answer only the event asked (beware decoy times). Use source-reader per recording; never give untrusted recordings to a --yolo/shell worker.
Session: log in challenges/<code>/log.md with tokens redacted; run `redact.mjs --check` before commit; install/read the `read` skill; run mega-start and read the whole startPoint before the first call; one short message per step ending with "Needed from you". After a 429, stop.
Lessons relevant: 1, 2, 3, 5, 9, 15, 16, 17.

## (e) Open questions for the student
1. Allow hq.mega.dev in this routine's network settings so prep can read llms.txt and the public Challenge list?
2. What is today's Challenge code (S01E03?) so the folder can be renamed from 2026-10-28?
3. Does the Challenge need the signed-in page (save-page.mjs from your browser session)? This agent never signs in.
