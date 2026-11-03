# Prep 2026-10-27 (S01E02 expected, opens 05:00 Europe/Warsaw)

## (a) Reached / not reached
- Could NOT reach hq.mega.dev. curl to /llms.txt and /challenges: proxy answered 403 to CONNECT for hq.mega.dev:443 (network policy denial). WebFetch: DNS lookup failed (ENOTFOUND).
- Read locally: docs/playbook.md, lessons-learned.md, tool-ideas.md, challenges/S01E01/README.md.
- No workaround attempted (policy block respected).

## (b) Challenge title, code, description
Not reached; content unknown. Nothing guessed. (Repo notes only say S01E02 opens Tue 27 Oct 05:00 CET.)

## (c) Declared contract
None found. For reference, S01E01's schema lived at `/challenges/where-the-story-begins/api/schema.json`, declared via `<link rel=service-desc>` in the signed-in page; today's will need the same check.

## (d) Playbook checklist for this Challenge
- [ ] Install/read the `read` skill; read the whole startPoint before the first call.
- [ ] Find the contract: save the signed-in page (save-page.mjs), run find-contract.mjs <file> --base <url>; check service-desc, describedby, form fields, "unavailable" links. Quote it before building any body.
- [ ] Never send a guess to learn from the error (each refusal can cost a try).
- [ ] Read the question literally (fact lookup vs. about me).
- [ ] Limits: write keep list first, count with cut-diff.mjs, show every cut to the human.
- [ ] Facts that change (newest model/price): state memory answer + confidence, check live maker page, cite URL and date; ask before changing a sent answer.
- [ ] Log in challenges/<code>/log.md with tokens redacted; run redact.mjs --check before commit.
- [ ] One short step message, end with "Needed from you".

## (e) Open questions for the student
1. hq.mega.dev is blocked in this routine's environment (403 on CONNECT). Add it to the environment's allowed domains if you want public pages prepped?
2. Challenge folder name: use the course code once known (e.g. S01E02)?
3. Everything behind sign-in must be read by you in the browser session; shall the contract be saved at 05:00 via save-page.mjs?
