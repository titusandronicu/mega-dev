# S01E03 page deliverable

Two signed pages here, both carrying the **real** `signature` from `start-challenge` (the
`<ticket>`) — the only place it's allowed to appear in this repo:

- `4471-split.svx` — the new page, added alongside #4471. Final version: 2 problems (parser
  379, hint 33), the one-day-move reports footnoted under parser (not a third problem — an
  earlier version of this page split them out as one; `causes.ts`'s own comments say that's
  wrong, see `log.md`).
- `4471.svx` — a revision of #4471's own incident page: `status` changed from `known` to
  `split`, stale "412 reports"/"Known, one issue" prose replaced with the real breakdown
  (links to desk ticket #6 and #7), `reviewed` set to today, and now signed (it wasn't before —
  this revision is attributed to us). Left as the desk's page in every other way: owner stays
  `support desk`, `CauseTable`/`QueueTimeline` unchanged.

## How it was rendered

1. Took the kb export (`support-kb/`, sha256-verified, see `challenges/S01E03/log.md`), edited
   both pages (and `BreakdownTable.svelte` for the first) in a copy of it.
2. Scaffolded a throwaway SvelteKit + mdsvex + `adapter-static` app around that copy
   (`vite.config.js`: `sveltekit({ preprocess: [mdsvex({ extensions: ['.svx'], layoutPropForwarding: 'runes', layout: { runbook: '.../runbook.svelte' } })], adapter: adapter-static(...), alias: { '#lib': 'src/lib' } })` —
   `layoutPropForwarding: 'runes'` is required so mdsvex's generated layout-wrapper code
   doesn't collide with Svelte 5 runes mode; also don't manually destructure frontmatter
   fields with `$props()` in a page's own `<script>` — mdsvex already injects
   `const { ...keys } = metadata;` for every frontmatter key, so `{signature}` is already in
   scope).
3. `npx vite build` → static HTML in `build/`; copied `build/kb/incidents/4471.html` and
   `build/kb/incidents/4471-split.html` here (`rendered/`).
4. Checked the output, not just the build exit code:
   - `RenderStamp` renders `desk ref DR-AA5T-RE14` on **both** pages (same signature, same
     ref — not "unsigned").
   - No stale banner on either page (`reviewed` dates are recent).
   - `4471.html`: `CauseTable`'s own sum line reads "412 reports merged into #4471 · 2 causes";
     table rows parser 379 / hint 33; footnote "5 reports read as a one-day move; filed under
     parser by tenant"; status pill reads `split`.
   - Independently recomputed `deskRef(<ticket>)` from `desk-ref.ts` via `vite-node`, outside
     the SvelteKit build — matches the rendered ref on both pages.

No headless browser was installed in that session, so no PNG screenshot was taken (optional
per the brief).

## Why this directory, not `kb/`

mega-dev doesn't run the kb's SvelteKit app itself — it's a docs/work repo, not the kb's own
site. Putting the page under a `kb/` tree here would look like a live route but isn't one; it's
filed next to the rest of this challenge's record instead. The brief's `claim-challenge` schema
only takes `{repo: "owner/name"}` — no fixed path — so this placement is a choice, not a
requirement.
