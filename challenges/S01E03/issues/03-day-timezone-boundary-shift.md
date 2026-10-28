---
title: "A day/timezone-boundary shift, footnoted under parser but not a date swap"
---

## Problem

Five reports merged into desk ticket #4471 describe a symptom that is **not** a month/day swap,
read body by body (`s01e03/analysis.md`, `s01e03/bodies-classified.json`):

- R-41202, R-41620: same month, specific date off by exactly **one day**.
- R-41209: "Every booking in June is one day off. Only June." — systemic, one month only.
- R-41236: "The invite arrived before I made the booking." — an ordering artifact, no date pair.
- R-41344: the same meeting shows Tuesday to a client in Lisbon and Monday to a client in
  Toronto — a single instant crossing midnight differently per timezone, "held it twice."

None of the 412 merged reports' bodies match this pattern except these 5 (checked
programmatically against all of them, not just these ids — see `classify_bodies.py`). They are
mechanically swept into the `parser` cause group by `groupByCause()`/`causeOf()` (which only
looks at tenant + channel, never body text) and only *footnoted* there by `readAs()` — the kb's
own code structurally cannot re-bucket them, because `Cause` is only `'parser' | 'hint'`.

**This is a real, separate problem**, not a parser symptom: a day/timezone-boundary rollover
(DST or UTC-offset-vs-local-date handling), independent of date-field order. R-41344 in
particular (two timezones, one instant, two different local weekdays) cannot be a date-order
parsing bug by construction — there's only one date being parsed, read correctly, and the
inconsistency is between two *renderings* of the same instant.

## Count

**5**, scoped to the 2026‑10‑04 export: R-41202, R-41209, R-41236, R-41344, R-41620
(`desk-notes.json: oneDayMove`, cross-checked against every body in the export).

## How counted

`readAs(group, notes.oneDayMove)` from `causes.ts`, confirmed independently by running
`classify_bodies.py` over all 412 bodies and finding no 6th match.

## Evidence

Bodies quoted above; tenants: kettle.books, alder.physio, nine.lanterns, pale.harbour,
lantern.row — spans both `parser`-cause and (by locale) would-be-`hint`-cause tenants, another
sign this isn't the same mechanism as either the parser or hint issues filed alongside this
one.

## Suggested fix

Investigate day-boundary/DST handling separately from date-field parsing: check whether
booking timestamps are stored/rendered in UTC vs tenant-local time, and whether a rollover
near midnight (or a DST transition) accounts for the June-specific and cross-timezone reports.

## See also

desk ticket #4471 — these 5 are currently inside its merge and footnoted, not re-ticketed; this
issue is the re-ticketing.
