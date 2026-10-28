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

## 2026-10-28, console (Phase 4 — fix per claim-1, claim-2 "progress")
- Kamil rejected the merge proposal (10:20) and pointed at `causes.ts` itself. Re-read it:
  - lines 37–39: *"The shared parser reads every date month first. A day-first tenant's dates
    come out flipped: that is `parser`. Through booking-v3's form the tenant's people type
    what the hint tells them, month first, and the form reads it the tenant's way: that is
    `hint`, a different bug."* — `parser` and `hint` are explicitly two bugs, so #6/#7 are
    correctly separate; the previous job's merge proposal was wrong.
  - lines 93–96: *"Reports the desk read differently from their cause (desk-notes.json):
    counted where they're filed, footnoted under it."* (comment on `readAs()`) — the 5
    one-day-move ids are **parser** reports (assigned by tenant + channel, same as the other
    374), just read differently by the desk; they're a footnote, not a separate cause. So #8
    duplicated #6, not the other way round.
- Fixed: edited #6 to 379 (includes the 5, with a new "Read as one-day moves" section quoting
  `readAs()`'s comment and removing the "separate bug" claim); commented on and closed #8 as a
  duplicate of #6 (`gh issue close 8 --reason "not planned"`); #7 needed no edit (never
  referenced #8 or a 3-way split). `BreakdownTable.svelte` no longer subtracts the 5 into a
  third row — it now shows 2 rows (parser 379, hint 33) plus a footnote line, mirroring
  `CauseTable`'s own `readAs()` behaviour; page prose and links updated to 2 tickets. Re-built
  via the throwaway SvelteKit site and checked: 379/33, footnote "5 reports read as a one-day
  move; filed under `parser` by tenant," desk ref unchanged (`DR-AA5T-RE14`), no stale banner.
  Ticket-scanned (only in the `.svx` frontmatter) before committing/pushing
  (`4fb3dbd`).
- Called `claim-challenge` again (same receipts). **Status: `progress`**, not `solved` and not
  `rejected` — a third state the earlier task framing didn't cover. Message: *"Step one
  passed: the course accepted your tickets. Not solved yet. When the work on #4471 is done,
  close your tickets, then send the repo again."* Desk: *"Two tickets, both real. The desk
  isn't done with #4471 yet. When it is, close yours and submit again."* Full reply in
  `s01e03/claim-2.json` (no ticket in it).
- **Stopped here, did not close #6/#7 or resubmit.** Closing real GitHub issues and claiming
  again on "work is done" needs a human call on what "done" means in this challenge (there is
  no real parser code to patch here — only the ticket-filing/documentation work this challenge
  actually asked for) before acting on it. See the report for the open question to Kamil.

## 2026-10-28, console (Phase 5 — read-only investigation, job `56ac17a8d033`)
- Printed `claim-1.json`/`claim-2.json` verbatim and the brief's "desk keeps working"/`done`
  sections (ticket confirmed absent from both files). Re-read all `mega-challenge` tool
  descriptions: `rook`'s own text says "never on your own, and never to work on a Challenge" —
  not called, despite the task's conditional allowance, because this would have been exactly
  that. `mega-start`/`check-lane` unrelated, not called. `list-challenges`: S01E03 still
  `solved: false`, description unchanged. `resume-challenge` (uuid + ticket receipt): returned
  `"That challenge has nothing to pick back up."` — no async resumable state exists.
- GitHub: `issues/{2,6,7,8}/timeline` and `/comments` — every event actored by `titusandronicu`
  only; `repos/.../hooks` → `[]`; one collaborator; `/installations` → 404. No desk/bot
  activity anywhere on GitHub, ever.
- Conclusion: the time/async-gate and desk-acts-on-GitHub hypotheses had no supporting
  evidence. The strongest lead was that `#4471`'s own kb page still said `status: known` and
  "Known. One issue, one fix queued." after we'd already filed #6/#7 — the kb itself was
  self-inconsistent. Recommended updating it over waiting or closing tickets.

## 2026-10-28, console (Phase 6 — page update, tickets closed, claim-3 rejected, job `e1e71bfec5ee` then this job)
- Edited `#4471`'s own page (`challenges/S01E03/page/4471.svx`, commit `7a3db63`): `status:
  known` → `split` (triage is done, the incident turned out to be two real, separately-ticketed
  problems — not "resolved," the underlying bugs aren't fixed); `reviewed: 2026-10-28`; signed
  (it wasn't before — this revision is ours); dropped the hard-typed "412 reports"/"Known, one
  issue" Callout for the real breakdown with links to desk ticket #6 (379) and #7 (33); noted
  that `CauseTable`'s `hint` row still reads "no ticket of its own" because `ticketCause()`
  names the *owning* cause, not ticket existence — left the component unedited, explained the
  gap in prose instead; fixed the Lessons section (merge-by-subject-doesn't-check-cause,
  dedupe-by-id-before-counting). Did **not** touch `decisions/0001` and did **not** add a new
  decision record superseding it: a decision record needs named deciders (0001 lists "Rune
  (product), support desk"); we have evidence motivating a *policy* reconsideration but no
  authority to accept one on the desk's behalf — that observation went into the incident page's
  own Lessons section instead, which is in scope. Re-rendered both pages: desk ref
  `DR-AA5T-RE14` on both (same signature); `CauseTable`'s own sum line reads "412 reports
  merged into #4471 · 2 causes"; table 379/33; footnote "5 reports read as a one-day move;
  filed under `parser` by tenant"; status pill `split`; no stale banner. Ticket re-scanned:
  present only in the two `.svx` frontmatters (`4471.svx`, `4471-split.svx`), nowhere else,
  not in either rendered HTML.
- Closed #6 (comment: "Triage of desk ticket #4471 is done... this ticket holds 379 reports,"
  then `gh issue close 6 --reason completed`) and #7 (same, 33 reports, `completed`). #8 stays
  closed as `not planned` from Phase 4. #2 untouched throughout.
- Called `claim-challenge` a third time (same receipts). **Rejected again.** Message: *"Not
  accepted: your tickets are closed, but not the way the course expects. Check them against
  the task, then send the repo again."* Desk: *"Closed, but not the way the desk would.
  Things moved since your first submit."* Full reply in `s01e03/claim-3.json` (no ticket in
  it). **Stopped per instructions — no retry, no further issue edits, no debrief** (status is
  `rejected`, not `solved`).

## 2026-10-28, console (Phase 7 — closed the way the desk would, solved, job `9fd1351df5d8` then this job)
- New evidence: the coordinator (Bishop) read the live challenge page in their own browser
  (this harness's console still has none) and found a "DESK UPDATE": engineering closed desk
  ticket #4471 on 05 Oct — parser **fixed** (`fix(dates): parse dd/mm for eu locales`), hint
  **won't fix** (`booking-v3` form retired). Re-downloaded kb export was byte-identical
  (same sha256): the data/counts hadn't changed, only the desk's own state had, and this
  harness had no way to see that on its own.
- Reopened #7, commented "Won't fix: the booking-v3 form was retired...", closed
  `--reason "not planned"`. Commented on #6 "Fixed upstream: fix(dates): parse dd/mm for eu
  locales..." (already `completed` from Phase 6, left as-is). Verified via
  `gh api .../issues/{6,7,8}`: #6 `closed`/`completed`, #7 `closed`/`not_planned`, #8
  `closed`/`not_planned`. #2 untouched.
- Updated `4471.svx`: `status: known→closed`; Callout rewritten to state the close reasons
  with ticket links; `4471-split.svx`'s "What to do" section (still phrased as a pending
  action — "File the hint reports as their own ticket") rewritten to "What happened," past
  tense, matching the closed state. Re-rendered: status pill `closed`, `CauseTable`'s own sum
  line "412 reports merged into #4471 · 2 causes", table 379/33, footnote "5 ... filed under
  parser", desk ref `DR-AA5T-RE14` on both pages, no stale banner. Ticket re-scanned: present
  only in the two `.svx` frontmatters. Pushed: `bc08e23`.
- Called `claim-challenge` a fourth time (same receipts). **`status: "solved"`**, accepted on
  this try after 2 rejections (`solvedAt: 2026-10-28T09:50:32.000Z`). Full reply in
  `s01e03/claim-4.json` (no ticket in it).
- Called `debrief` once, per its probes (C1 "the rendered view," C2 "the desk's update," T1–T3
  on the render setup / ticket routine / claim sourcing). Saved the course's returned sheet to
  `~/work/mega-s01e03/s01e03/debrief.md` and the course's own link
  (https://hq.mega.dev/challenges/what-it-shows#debrief); a compiled, S01E02-style version is
  `challenges/S01E03/debrief.md` in this repo.

## 2026-10-28, console (Phase 8 — turn the lessons into mechanisms, this job)
- Grouped `docs/lessons-learned.md` #1-#35 into recurring patterns: stale live state vs
  cached data (#30, #32-#34), overlapping/duplicate tickets (#25, #27-#28), close-reason
  semantics (#35), autolink collisions (#26), browserless/manual auth hand-offs (#11, #22-#24,
  #34), claim status not binary (#29).
- Built, under `tools/`, and tested each against real history or real repo state:
  - `pre-claim-gate` (+ `pre-claim-gate.test`): refuses a claim after a non-solved reply until
    a human has logged a live-page recheck since. Replayed S01E03's real `claim-log.jsonl`
    (reconstructed here with approximate timestamps for claims 1-3, exact `solvedAt` for
    claim 4) at each checkpoint: fails before claims 2, 3 and 4 with no recheck logged, passes
    once the one real recheck (before claim 4) is added - i.e. it would have forced the
    browser check 2 attempts earlier than it actually happened.
  - `safe-issue-refs`: while testing it against the already-committed issue drafts, found a
    real, still-present bug - `challenges/S01E03/issues/01-03*.md` here were never
    re-synced after the bare-`#N` fix was applied locally before filing (the real GitHub
    issues #6-#8 are correct; this repo's copies were the stale pre-fix text, with exactly
    the `#2`-autolink risk lesson 26 describes). Fixed by re-copying the correct local files.
  - `close-ticket` (`--check` mode verified, not re-mutated): confirmed #6/#7's real
    `state_reason` and correctly flagged a fabricated wrong-expectation case.
  - `preflight`: run for real in this session - all checks pass (gh, full ICU already fixed
    in earlier phases); prints the exact fix command for each if they weren't.
  - `record-claim`: tested against the real `claim-2.json` (progress), appended a normalized
    line and printed the right next step instead of assuming solved/rejected.
  - `scaffold-kb-render`: tested against a **fresh**, unmodified copy of the kb export (not
    the already-built `site/`) - `npm install` + `npx vite build` succeeded from scratch.
  - `subset-check`: run against the real `counts.json`, correctly flags
    `oneDayMoveIds ⊆ groups[cause=parser].reportIds` - the actual mechanism of the real
    claim-1 duplicate (not, as first guessed, similar fix-text between #6 and #7).
- **Correction, not just addition**: lesson #25's original diagnosis doesn't hold up under
  remeasurement - the two "nearly identical" fix paragraphs it blamed are only 33% similar by
  string distance. Dropped the tool that would have tested that false premise
  (`duplicate-fix-check`, never committed) in favor of `subset-check`, which demonstrably
  catches the real mechanism. Corrected the lesson's text in place, dated, rather than quietly
  rewriting history.
- Added `docs/lessons-index.md` (every lesson → mechanism, or "prose only" with why), updated
  `CLAUDE.md` and `docs/playbook.md` with the new tools, one `CHANGELOG.md` entry.
