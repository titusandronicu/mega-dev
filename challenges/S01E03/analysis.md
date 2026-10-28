# #4471 analysis — run from the kb's own code

Ran `s01e03/kb/support-kb/scripts/analyze.ts` via `vite-node` (so `uniqueById`, `groupByCause`,
`causeOf`, `ticketCause`, `readAs` from `causes.ts`, and `tenantOf`/`tenantHandles` from
`locales.ts` — including its `import.meta.glob` tenant loader — run unmodified, under Vite's
own transform). Full output: `s01e03/counts.json`. Full ICU reconfirmed first (`pl-PL`/`da-DK`
day-first via `Intl.DateTimeFormat`, same check as the session preflight).

## Structural counts (from causes.ts, unmodified)

| metric | value |
|---|---|
| rows in `reports-4471.json` | 427 |
| unique ids (`uniqueById`) | **412** |
| duplicate ids (exported twice) | 15 — R-41251/41300/41301/41352/41353/41402/41403/41454/41455/41504/41505/41556/41557/41606/41608 |
| distinct `mergedInto` values across the whole file | `[4471]` only — nothing in this export is unmerged or merged elsewhere |
| merged into #4471 | 412 (= all unique rows) |
| `groupByCause` groups | **parser**: 379 (11 tenants, 2026‑04‑01→2026‑10‑04) · **hint**: 33 (3 tenants, 2026‑04‑17→2026‑09‑22) |
| `ticketCause(groups, 4471)` (the one cause `CauseTable` treats as "owner") | `parser` — so the `hint` row renders with `.wrong` / "not this ticket — no ticket of its own" |
| `intakeTag` vs computed `cause` mismatches | **38** |
| `readAs(group, oneDayMove)` | parser: 5, hint: 0 — all 5 known one-day-move ids mechanically land in the `parser` group |

## Diff vs your snapshot

**None.** Every number matches exactly: 412 unique, hint 33, parser 379 (→374 once the 5
footnoted one-day-moves are pulled out), 38 tag mismatches, and the same 5 one-day-move ids
(R-41202, R-41209, R-41236, R-41344, R-41620). Running the kb's own code reproduces your
snapshot bit for bit — no reimplementation drift.

## Body classification (read all 412 bodies, not keyword-scanned)

Wrote `s01e03/classify_bodies.py`: pulls every `(day, month-name)` pair out of each body and
checks whether two dates are a day/month swap, a same-month ±1-day pair, or neither; bodies
with 0–1 dates get a keyword pass. Full per-report result: `s01e03/bodies-classified.json`.

| class | count | what it is |
|---|---|---|
| clean month/day-swap pair in the text | 403 | e.g. R-41200: "7 April ... went out on 4 July" |
| no explicit date pair, but clearly the same swap bug, phrased differently | 4 | R-41290 ("day first" setting request), R-41417 ("wrong day"), R-41514 (workaround), R-41615 ("October ... for January" — consistent with day=1 swapped to month=1) |
| **not a swap pattern at all** | **5** | exactly the 5 `desk-notes.json` `oneDayMove` ids — see below |

The 5 non-swap bodies, read in full:
- **R-41202** (kettle.books): "Invite says Tuesday 12 May. Calendar says Monday 11 May... turned up on the Monday." → same month, off by exactly 1 day.
- **R-41209** (alder.physio): "Every booking in June is one day off. Only June." → systemic, one specific month, off by 1 day — not a swap.
- **R-41236** (nine.lanterns): "The invite arrived before I made the booking." → no date pair at all; a causality/ordering artifact consistent with a day-boundary rollover, not a parse-order confusion.
- **R-41344** (pale.harbour): "Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice." → a single UTC instant reading as two different local calendar days across timezones — a timezone bug, not a date-field swap.
- **R-41620** (lantern.row): "Tuesday 6 October showed as Monday... I moved it myself." → same-month, off by 1 day again.

None of the 5 mentions two swapped month/day values. All 5 describe a date or weekday shifted
by one day across a boundary (a specific day, a specific month, or a timezone line) — a
different failure mode from "the parser reads day-first dates month-first." No other report
among the 412 showed this pattern; the classifier found exactly these 5 and no more.

## What this means for the problem set

1. **parser** (month/day swap, shared parser): 379 by mechanical grouping, **374** once the 5
   one-day-moves are excluded as a different symptom — all 374+4-atypical-phrasing reports read,
   by body, as a genuine day/month swap.
2. **hint** (booking-v3 form pre-empts the parser): 33, currently merged into #4471 but
   `ticketCause` says #4471's owner cause is `parser` — `hint` has "no ticket of its own."
3. **one-day/timezone boundary**: 5, textually unrelated to either swap mechanism, currently
   invisible as its own issue because `causeOf()`/`groupByCause` only look at tenant+channel,
   never body text, so these 5 get swept into whichever mechanical group their tenant produces
   (here, all 5 happen to compute as `parser`).
4. **intakeTag mismatches** (38): not a user-facing bug — a desk-process accuracy problem
   (browser-guessed tag vs. the tenant-derived real cause). Noted as context, not filed as a
   4th engineering ticket (see `issues/` for the reasoning).
