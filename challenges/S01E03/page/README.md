# S01E03 page deliverable — not yet pushed

`4471-split.svx` here carries the **real** `signature` from `start-challenge` (the `<ticket>`),
not the `<ticket from start-challenge>` placeholder in the already-committed copy next to the
analysis (`challenges/S01E03/page/` vs the redacted copy filed alongside `log.md`/`GOAL.md` in
the `31d3f9b` commit — this directory's `4471-split.svx` overwrites that one locally; it is
**uncommitted**, pending confirmation, because it makes the ticket public once pushed).

## How it was rendered

1. Took the kb export (`support-kb/`, sha256-verified, see `challenges/S01E03/log.md`) and
   added `4471-split.svx` + `BreakdownTable.svelte` to a copy of it.
2. Scaffolded a throwaway SvelteKit + mdsvex + `adapter-static` app around that copy
   (`vite.config.js`: `sveltekit({ preprocess: [mdsvex({ extensions: ['.svx'], layoutPropForwarding: 'runbook', layout: { runbook: '.../runbook.svelte' } })], adapter: adapter-static(...), alias: { '#lib': 'src/lib' } })` —
   note `layoutPropForwarding: 'runes'` was required so mdsvex's generated layout-wrapper code
   doesn't collide with Svelte 5 runes mode).
3. `npx vite build` → static HTML in `build/`; copied `build/kb/incidents/4471-split.html` and
   `build/kb/incidents/4471.html` here (`rendered/`).
4. Checked the output, not just the build exit code:
   - `RenderStamp` renders `desk ref DR-AA5T-RE14` (not "unsigned").
   - No stale banner on either page (`reviewed` dates are recent).
   - The breakdown table shows 374 / 33 / 5, matching `challenges/S01E03/counts.json`.
   - Independently recomputed `deskRef(<ticket>)` from `desk-ref.ts` via `vite-node`, outside
     the SvelteKit build — it matches the rendered ref exactly.

No headless browser was installed in that session, so no PNG screenshot was taken (optional
per the brief).

## Why this directory, not `kb/`

mega-dev doesn't run the kb's SvelteKit app itself — it's a docs/work repo, not the kb's own
site. Putting the page under a `kb/` tree here would look like a live route but isn't one; it
's filed next to the rest of this challenge's record instead. The brief's `claim-challenge`
schema only takes `{repo: "owner/name"}` — no fixed path — so this placement is a choice, not
a requirement (see `log.md`/final report for the open question on how the grader actually
locates the page inside the repo).
