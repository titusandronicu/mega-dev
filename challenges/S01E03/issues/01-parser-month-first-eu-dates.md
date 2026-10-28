---
title: "Date parser reads EU day-first dates month-first"
---

## Problem

The shared booking-date parser reads every date month first. Tenants whose locale writes the
day first (confirmed via `Intl.DateTimeFormat`, not hand-typed — see `causes.ts: dayFirst()`)
get their day and month swapped on every booking that enters through a channel other than the
booking-v3 form's own month-first hint field (see issue #2 for that split).

## Count

**374** reports, scoped to the kb export dated 2026‑10‑04 (`support-kb/README.md`), after:
- deduping by `id` (`uniqueById` — the export has 15 rows exported twice),
- grouping by computed cause, not by the browser-guessed `intakeTag` (`groupByCause`/`causeOf`
  in `causes.ts`), which gives 379 for this mechanical group,
- then excluding the 5 reports that are a different symptom entirely (one-day/timezone
  boundary shift, not a month/day swap — see issue #3) and are currently only footnoted under
  this group by `readAs()`, not actually caused by this bug.

374 = 379 − 5.

## How counted

`groupByCause(uniqueById(reports).filter(r => r.mergedInto === 4471), tenantOf)` from
`src/lib/kb/causes.ts`, cause = `'parser'`, minus the 5 ids `readAs()` flags as one-day-moves.
Reproducible: `vite-node scripts/analyze.ts` in `support-kb/`.

## Evidence (sample ids; full list in `s01e03/counts.json` groups[cause=parser].reportIds,
minus the 5 one-day-move ids)

R-41200, R-41201, R-41203, R-41204, R-41206, R-41208, R-41210, R-41211, R-41212, R-41213 —
each body states two dates whose day and month are swapped relative to each other, e.g.
R-41200: "Our 7 April reminder went out on 4 July." (7/4 → 4/7).

11 tenants affected, spanning 2026‑04‑01 to 2026‑10‑04 (all channels: app, email, and
non-hinted form submissions).

## Suggested fix

Make the parser locale-aware: ask the tenant's locale (same `Intl.DateTimeFormat` call
`dayFirst()` already uses) before assuming month-first, instead of a single hardcoded order.

## See also

#4471 (the ticket these are currently merged into — this is #4471's majority/owning cause per
`ticketCause()`, so it correctly stays there; issues #2 and #3 are reports from the same ticket
that are a *different* bug and don't belong under #4471's "known" story).
