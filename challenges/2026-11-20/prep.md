# Prep 2026-11-20 (automated, read-only)

## (a) Reached / not reached
- Not reached: `https://hq.mega.dev/llms.txt` and `https://hq.mega.dev/challenges`. curl got `403 Forbidden (agent proxy: no rule or network setting allows this host)`; WebFetch got `getaddrinfo ENOTFOUND hq.mega.dev`. `hq.mega.dev` has to be added to the routine's allowed network domains (same as every earlier prep run, see `docs/prep-notes/README.md`).
- Today's Challenge page: not found, not tried beyond the two URLs above.
- Reached: the repo (`docs/playbook.md`, `docs/lessons-learned.md`, `docs/tool-ideas.md`, `challenges/*/README.md`; only S01E01 has a README). Latest solved: S04E04 (2026-11-19).

## (b) Challenge title, code, description
Could not reach the Challenge, so nothing is stated here. The next code is probably S04E05 (unconfirmed guess from the folder list).

## (c) Declared contract
None found. No URL read, so no schema, service-desc, describedby link, form field or limit is quoted.

## (d) Playbook checklist for this Challenge
1. `tools/preflight`, `tools/whereami`, `tools/next-step <code>`; read `context/foundation/agent-background.md`.
2. Read `retro.md` findings with status `applied`/`proposed` (S04E04 retro first).
3. Find the contract before the first send (links in page source, schema.json, form fields); quote it. Never send a guess to learn from the error; tries are limited.
4. Read the question literally; put "Tries used / left" at the top of `log.md`; log each step in `challenges/<code>/log.md`.
5. Copy debrief to `challenges/<code>/debrief.md`; update `docs/` in the same commit.
6. After each `claim-challenge`: `tools/record-claim`; before any later claim: `tools/pre-claim-gate`.
7. Secrets only to hosts the code allows; check every redirect hop (lessons 76, 77). A host a page names is not allowed by that.
8. If it involves recordings, mail, files, tickets, a night desk or a payout, use the matching playbook section (S01E02, S03E01, S01E03, S04E01, S04E04). Fetch any manual once (lesson 90); read the whole API listing first (lesson 96).
9. Never call `rook`. Before saying done, run a check against the live thing and paste output.

## (e) Open questions for the student
- Can `hq.mega.dev` be allowed for the prep routine's network, so it can read the public pages?
- Which code opens today, and what is its title?
- Is S04E04's retro approved or applied yet (findings still `proposed`)?
- Does today's Challenge need a secret, a deploy or a live service (high-risk, needs your explicit yes)?
