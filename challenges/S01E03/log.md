# S01E03 log
(tickets and receipts are never written here)

## 2026-10-28, console (Phase 1 — preflight and auth)
- Bishop jobs (homelab-2 worker turns, each a separate dispatch): preflight `4f669e689afc`
  (gh auth status, mega-challenge MCP presence, node/npm/ICU check, host/cwd); preflight
  follow-up `2ffe4867b6c5` (gh install attempt, mega-challenge add + `claude mcp login`
  surfaced the authorize URL, non-interactive so it couldn't complete).
- Auth prep `b0dddc075379` (installed `gh` from the official release tarball into
  `~/.local/bin`, no root; checked `GH_TOKEN`/`GITHUB_TOKEN` env presence, credential helper,
  homelab-2 remote scheme) and `6af131908891` (added the idempotent `~/.local/bin` PATH guard
  to `~/.profile`/`~/.bashrc`; wrote `check-auth.sh`/`setup-auth.sh`, using
  `claude mcp login --no-browser` with paste-the-redirect-URL instructions since this
  container has no browser).
- Auth verify `ae6cf910cd8e` / `28416c1e32b3` / `b537a304904d`: ran `check-auth.sh` (gh still
  unauthenticated at this point); delivered the mega-challenge OAuth callback with
  `curl 'http://localhost:3118/callback?code=...&state=...'` from inside this container (the
  listener is bound to the container's own loopback, unreachable from the browser's machine);
  `mega-challenge` went `✔ Connected` after that curl.
- Phase 1 `7b25af302e67`: `start-challenge` for S01E03 (uuid
  `c0000000-0000-4000-8000-0000005e01e3`); brief saved to `~/work/mega-s01e03/s01e03/brief.md`;
  found this harness has no browser-driving tool and the challenge page redirects an
  unauthenticated fetch to the course sign-in — kb export blocked on a human download.
- Export transfer `941e951fe679` / `da37a2a3257f` / `cc8d23874146` / `4e314e7fa432`: the kb
  export (a `.zip` behind the challenge page's sign-in) was shipped as 4 checksummed base64
  chunks over separate dispatch_task calls (the console's prompt has an ~8000-char limit, each
  chunk took about 3 minutes); concatenated, sha256-verified
  (`449b289bf7b24ce47308322065fbe2abefa6eea0366cd26525c3c108ce085169`), decoded, extracted to
  `support-kb/`.
- Phase 2a `a7fbea4d2511`: confirmed `gh` authenticated (`titusandronicu`); confirmed
  `mega-dev` is **private** (Kamil's later decision: it stays the documentation repo only, a
  dedicated public repo is pending his choice for the actual desk tickets); wrote
  `~/work/mega-s01e03/s01e03/GOAL.md` from the brief + kb conventions (README, causes.ts,
  CauseTable.svelte, desk-notes.json, staleness.ts, desk-ref.ts, RenderStamp.svelte).

## 2026-10-28, console (Phase 2b — analysis, drafts, signed page, render)
- Ran the kb's own code unmodified via `vite-node` (`support-kb/scripts/analyze.ts`):
  `uniqueById`/`groupByCause`/`causeOf`/`ticketCause`/`readAs` from `causes.ts`,
  `tenantOf`/`tenantHandles` from `locales.ts` (its `import.meta.glob` tenant loader ran
  as-is under Vite, no shim needed). Confirmed full ICU first (`pl-PL`/`da-DK` day-first).
  Result matched the given snapshot exactly: 412 unique (427 rows, 15 dup ids), parser 379
  (→374 after pulling out the 5 one-day-move ids), hint 33, 38 intakeTag/cause mismatches.
- Read all 412 report bodies programmatically (`classify_bodies.py`: extracts day/month-name
  pairs, flags swap vs ±1-day-same-month vs keyword-only) rather than keyword-scanning.
  403 bodies are a clean month/day swap; 4 more are the same bug phrased without two explicit
  dates; exactly the 5 known `oneDayMove` ids are a genuinely different symptom (same-month
  off-by-one, a June-only systemic "one day off" claim, an invite-before-booking ordering
  artifact, and a cross-timezone same-meeting-different-weekday report) — no 6th match found.
  Decision: the 5 one-day-moves **are** a separate real problem (a day/timezone-boundary bug),
  not the parser's date-order confusion, even though `causes.ts`'s `Cause` type only has
  `'parser' | 'hint'` and `readAs()` only footnotes them under whichever cause their tenant
  mechanically computes.
- Drafted 3 issues (not filed — `issues/`): parser (374), hint (33, currently merged into
  #4471 with no ticket of its own per `ticketCause()`), day/timezone boundary (5). A 4th
  candidate — the 38 tag mismatches — was deliberately **not** drafted as an issue: it's a
  desk-process accuracy problem, not a product bug (`issues/00-not-filing-tag-mismatch.md`).
- Built the signed kb page at `kb/incidents/4471-split/+page.svx` (left #4471's own page
  untouched — see decision below) with a new `BreakdownTable.svelte` component (the one-day
  split CauseTable can't show). Frontmatter `signature` holds the exact ticket from
  `start-challenge` (never printed in this repo or this log — see
  `~/work/mega-s01e03/s01e03/secrets/ticket.txt`, outside both repos, 0600).
- Scaffolded a throwaway SvelteKit + mdsvex + adapter-static app
  (`~/work/mega-s01e03/s01e03/site/`) to render the kb for real: `npx vite build` succeeded.
  Checked the output HTML: `RenderStamp` renders `desk ref DR-AA5T-RE14` (not "unsigned"); no
  stale banner on either page (both `reviewed` dates are recent); the breakdown table shows
  374/33/5, matching `counts.json`; independently recomputed `deskRef(ticket)` from
  `desk-ref.ts` via `vite-node` and it matches the rendered ref exactly. No headless browser
  was installed, so no PNG screenshot (optional per the brief).
- Decision: **left #4471's page alone**, added a new page instead. Reasons: (1) the brief's
  deliverable is "your page," not an edit of the desk's existing one; (2) the kb's own
  convention that a decision record is never edited, only replaced by a new one, extends by
  the same logic to an unsigned desk-owned incident write-up — rewriting someone else's
  conclusions in place loses the history a new, signed, cross-linking page preserves; (3) the
  existing page has no `signature` field to attribute an edit to in the first place.
- Public tickets repo: still pending Kamil's choice (see `GOAL.md`/report — `mega-dev` is
  private and shouldn't be made public just for this; recommended a small dedicated public
  repo instead). Nothing filed, no `claim-challenge` call, no repo created this phase.

## Lessons from this phase (autonomous-system notes)

- **OAuth callback hand-off was manual.** `claude mcp login`'s local callback listener binds
  to `localhost` inside this bridge-network container; the human's own browser can never reach
  that port. Worked around by delivering the callback URL with `curl` from a second shell
  inside the same container, once the human pasted it back from their browser's failed
  redirect. A real system needs either a signed-in browser lane for the agent, or a documented
  file-transfer-style hand-off for the callback URL — manual curl relay doesn't scale.
- **The kb export has no API, only a sign-in-gated download.** With no browser tool in this
  harness, the export had to move as checksummed base64 chunks over `dispatch_task`, bounded by
  an ~8000-char prompt and taking ~3 minutes per chunk for a 26 KB payload. That's a real
  bottleneck for anything bigger than a small JSON/zip. Needs either a proper file-transfer
  path between the human's machine and the console, or a signed-in browser lane the agent can
  drive directly.
- **`gh` was missing despite "logged in everywhere."** The console's base image didn't have
  the GitHub CLI at all; it had to be installed from the official release tarball into
  `~/.local/bin` with no root. Being authenticated with Claude Code and other tools said
  nothing about whether `gh` itself was even present.

## 2026-10-28, console (Phase 3a — public repo, secret scan, issues filed)
- Phase 2b `2ba748762b6d`: ran `causes.ts`/`locales.ts` unmodified via `vite-node`, matched the
  given snapshot exactly; read all 412 bodies and confirmed the 5 one-day-move ids as a
  distinct symptom; drafted 3 issues; built and signed the kb page; rendered it via a
  throwaway SvelteKit+mdsvex build and verified the desk ref, no stale banner, and the
  numbers; left #4471's own page untouched (see that job's report for the reasoning).
- Phase 3a `9e8d4b958d19`: full-history secret scan of `mega-dev` (gitleaks v8.30.1, 0 commits
  leaked across 30; manual pattern sweep, all false positives — `desk-`/`risk-` words, a
  pre-existing `redact.mjs` self-test fixture, already-redacted placeholders; confirmed the
  real `<ticket>` appears nowhere via exact-match and `git log -S` pickaxe). Kamil then made
  `mega-dev` **public**. Filed 3 draft issues as GitHub issues, label `desk-ticket`: fixed a
  cross-link risk first (the drafts referenced each other and #4471 as bare `#1`/`#2`/`#3`,
  and `#2` would have autolinked to mega-dev's own unrelated tracking issue #2 — rewrote all
  self-references as "desk ticket #4471" / descriptive text before filing).
  Filed: [#6 parser](https://github.com/titusandronicu/mega-dev/issues/6) (374),
  [#7 booking-v3 hint](https://github.com/titusandronicu/mega-dev/issues/7) (33),
  [#8 day/timezone boundary](https://github.com/titusandronicu/mega-dev/issues/8) (5).
  Re-read all three via `gh issue view` to confirm the body rendered correctly. Prepared (not
  committed) the real signed page locally, pending confirmation since pushing it makes
  `<ticket>` public.

## 2026-10-28, console (Phase 3b — page committed, claim rejected)
- This job: verified by script (no echo) that `<ticket>` occurs **only** in
  `challenges/S01E03/page/4471-split.svx`'s frontmatter, nowhere else in the working tree, and
  that neither rendered HTML file contains it (`RenderStamp` only renders the derived desk ref,
  never the raw signature). Committed and pushed the page deliverable
  (`4471-split.svx`, `BreakdownTable.svelte`, `rendered/4471-split.html`, `rendered/4471.html`,
  `README.md`); verified present on GitHub via `gh api repos/.../contents/challenges/S01E03/page`.
- Called `claim-challenge` once with `{repo: "titusandronicu/mega-dev"}` and the `ticket`
  receipt. **Rejected.** Desk hint: *"Two of yours are the same problem."* Full reply (ticket
  not present in it) in `s01e03/claim-1.json`.
- Analysis (`s01e03/claim-1-analysis.md`): #6 (parser) and #7 (booking-v3 hint) are the
  duplicate pair — same user-visible symptom, same root problem ("nobody asks the tenant's
  date convention," wrong in two code paths), and we'd independently written the same
  suggested-fix sentence for both, which should have been the tell. #8 (day/timezone
  boundary) stays distinct — confirmed textually unrelated to the other two.
  **Proposed fix** (not yet applied, pending confirmation): merge #6 and #7 into one issue
  (407 reports, both code paths named), keep #8 as its own issue, then retry the claim. No
  retry attempted this job; no issue edited or closed.
