---
title: "booking-v3's own date hint causes the opposite swap on day-first locales"
basis: "src/lib/kb/causes.ts:24"
---

## Problem

This is **not** the same bug as desk ticket #4471's parser issue (filed alongside this one).
The `booking-v3` form shows a `MM/DD/YYYY` hint under its date field (`causes.ts: DATE_HINT`).
Day-first-locale tenants on that form type the date the way their own hint tells them — month
first — so the *form itself* (not the shared parser) reads it correctly as entered, but that's
now the wrong order for a day-first tenant's actual intended date. Different code path,
different fix, same user-visible symptom (a flipped day/month), which is why it has been
sitting inside desk ticket #4471 un-ticketed.

`CauseTable` already shows this distinction in the kb page's own render: the `hint` row
renders with the "not this ticket — no ticket of its own" label, because `ticketCause()`
assigns desk ticket #4471's single-cause ownership to `parser`, not `hint`.

## Count

**33** reports, scoped to the 2026‑10‑04 export, deduped by id, computed via
`causeOf()`/`groupByCause()` (not by the browser-guessed `intakeTag` — 18 of these 33 were
*also* mistagged `hint` by intake, but 15 were mistagged `parser`; see `s01e03/counts.json`
→ `groups[cause=hint].taggedAs`).

## How counted

Same `groupByCause` call as the parser issue filed alongside this one, cause = `'hint'`.
Reproducible via `vite-node scripts/analyze.ts`.

## Evidence (sample ids; full list in `s01e03/counts.json` groups[cause=hint].reportIds)

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275 — 3 tenants on `booking-v3`
(alder.physio / de-DE, copper.studio / es-ES, pale.harbour / pt-PT), 2026‑04‑17 to 2026‑09‑22.

## Suggested fix

Either make the `booking-v3` hint locale-aware (show `DD/MM` to day-first tenants), or have the
form read its own field the same locale-aware way the parser issue's fix should.

## See also

desk ticket #4471 — these 33 are currently merged into desk ticket #4471 but are not its bug;
recommend splitting them into their own ticket, referencing desk ticket #4471 for the shared
symptom history.
