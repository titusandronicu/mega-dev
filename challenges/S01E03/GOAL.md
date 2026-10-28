# S01E03 "what it shows" — what this challenge is actually teaching

Grounded in `s01e03/brief.md` and `s01e03/kb/support-kb/` (README.md, src/lib/kb/causes.ts,
CauseTable.svelte, desk-notes.json, staleness.ts, desk-ref.ts, RenderStamp.svelte,
src/routes/kb/incidents/4471/+page.svx, decisions/0001-dedupe-by-subject).

## What "what it shows" points at

Two different things claim to describe #4471, and they can disagree:

1. **Prose**, written once by a person: the incident page's words ("By 4 October the desk had
   **412 reports**", `status: known`, the `<Callout>` "Known. One issue, one fix queued.").
   Prose is frozen the moment it's written.
2. **What the page renders**, computed live by `<CauseTable ticket={4471} />` and
   `<QueueTimeline ticket={4471} />` from `reports-4471.json` + `desk-notes.json` +
   `tenants/*.json`, via `causes.ts` (`uniqueById`, `groupByCause`, `causeOf`, `ticketCause`,
   `readAs`). The README's own rule names this split: *"A number that can be computed belongs
   in a component"* — i.e. the page's words should never be the only source of a number the
   code can derive.

The title's lesson: **trust what the component computes over what the prose claims**, and go
looking for where the two disagree — that gap is where a real, unticketed problem hides.
`CauseTable` even renders the disagreement directly: any cause-group whose `cause !== owner`
(the one cause `ticketCause` assigns the whole ticket) gets a `.wrong` row and the label "not
this ticket — no ticket of its own." That row *is* the thing the brief asks you to find.

## Traps a quick solution falls into

- **Trusting the headline.** `status: known` and "Known. One issue, one fix queued." read as
  closed. But "known" describes the desk's belief, not a guarantee that #4471 holds exactly
  one cause — `groupByCause` can (and, per `causes.ts`'s own distinction between `parser` and
  `hint`, plausibly does) split the merged reports into more than one group.
- **Trusting `intakeTag`.** `meta.intakeTag` is explicitly "a guess" taken from the reporter's
  browser at intake; `causeOf()` derives the real cause from tenant locale + form + channel,
  independent of the tag. Counting by `intakeTag` instead of by `causeOf()`/`groupByCause`
  double-trusts a guess the desk's own code says disagrees "more often than intake would like."
- **Duplicate export rows.** `uniqueById()` exists because "the ticket system exports in pages
  that overlap: a report can come twice." Counting the raw array length (427 rows) instead of
  deduping by `id` inflates every count.
- **Typed numbers vs computed ones.** "412 reports" in the prose is itself a number the
  component should produce, not a given fact to copy forward — and whether it still matches
  `uniqueById(reports).filter(r => r.mergedInto === 4471).length` on *this* export is exactly
  what needs checking, not assuming.
- **The stale-reviewed banner is not a correctness check.** `runbook.svelte` only warns when
  `reviewed` is `>180` days old (`staleness.ts`); the incident page's `reviewed: 2026-09-30` is
  recent, so no banner shows. A quick solution can read "no stale banner" as "this page is
  still right" — but staleness only measures how long since a human last looked, not whether
  the merged-reports data underneath it still matches the prose.
- **Signature wrong, mistyped, or missing.** `RenderStamp.svelte` renders "no desk ref: this
  page isn't signed" only when `signature` is *absent* from frontmatter — a mistyped or
  truncated ticket string still produces a desk ref (via `deskRef()`'s deterministic FNV-1a
  hash), just the wrong one, with no visible error. The ticket must go into `signature:`
  **exactly as given**, before it expires (2026-10-29T08:00:05Z here), or the page silently
  carries a ref nobody can trace back.
- **One-day moves aren't a third `Cause`.** `causes.ts` defines `Cause` as only `'parser' |
  'hint'` (plus the `'unplaced'` fallback `groupByCause` assigns when there's no tenant/no
  day-first locale). The five ids in `desk-notes.json`'s `oneDayMove` are reports the desk
  read as a timezone/one-day shift rather than the parser's month/day swap — but `causeOf()`
  never reads report bodies, only channel + tenant, so it cannot detect this distinction
  itself. `CauseTable` only *footnotes* them (`readAs()`) under whichever cause their tenant
  already computes to; it does not re-bucket them. That design choice is itself a signal:
  the course is showing that some "problems" are judgment calls on report *text*, not
  something `groupByCause` can resolve — a solution has to read the bodies and decide, with
  reasons, whether that's a separate real problem or correctly stays footnoted under `parser`.
- **The desk keeps working.** The kb export's own README says it was "Exported 2026-10-04";
  nothing in the brief offers a live endpoint. Treating this export's counts as a permanent,
  final truth about #4471 — rather than counts scoped explicitly to *this* snapshot — misses
  that more reports may already exist past it.
- **Rendering environment changes the answer.** `dayFirst()` asks `Intl.DateTimeFormat` for
  each tenant's locale at render time ("Asked of the platform, never typed in a list"). A
  Node build without full ICU (small-icu) silently falls back to a default date order for
  every non-English locale, so `dayFirst()` would wrongly return `false` everywhere, every
  `causeOf()` call would return `null`, and every report would land in `'unplaced'` — a
  wrong answer caused by the environment, not the data. (This session's Node was already
  checked for full ICU during preflight — `pl-PL` formatted day-first correctly — but that
  check needs repeating in whatever environment actually runs the analysis.)

## What a smart solution must do

1. Verify the export (checksum) and run the kb's **own** code — `uniqueById`, `groupByCause`,
   `causeOf`, `ticketCause`, `readAs` from `causes.ts` — via `node`/`tsx`, instead of
   reimplementing the logic, so the found "problems" match what the rendered page would show.
2. Confirm full ICU before trusting any `dayFirst()`-derived number.
3. Dedup by `id` before any count.
4. Report `intakeTag` (guessed) and computed `cause` (derived) separately, and treat their
   mismatch rate as its own finding, not noise to discard.
5. Treat any cause-group under #4471 where `cause !== owner` as a real, distinct problem
   (its own ticket, with its own report count) wrongly merged into the "known" ticket.
6. Decide — explicitly, with the report bodies as evidence — whether the one-day-move ids
   are a separate real problem or correctly stay footnoted under `parser`, instead of
   guessing either way.
7. Scope every count to this export explicitly (cite its export/received date) rather than
   claiming a final, unconditional number.
8. Sign the new page with the ticket string exactly as given, before its expiry, and confirm
   `RenderStamp` would render a desk ref (not "unsigned") before treating the page as done.
9. Set the new page's own `reviewed:` to today, not a copied date.
10. File one GitHub Issue per distinct real problem found this way, each stating how many
    reports it covers — matching the brief's deliverable, not a ticket per tenant or per row.
