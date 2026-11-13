---
key: SCHED-4446
title: "CSV export: times carry no UTC offset"
status: open
labels: [agent-ready, from:analytics]
sources: [IN-1783]
---

## Intent
The CSV export says which zone its times are in: add a UTC offset column next to the start and end times. The start and end columns stay exactly as they are. ADR-0001 says anything that leaves the product as data says which zone a time is in. Analytics (IN-1783) says their tool shifts every slot because it assumes UTC.

## Acceptance
- Given an export, when it is opened, then each row has a UTC offset column for its start and end times (for example `+02:00`).
- Given a booking at 09:00 in a +02:00 account, when it is exported, then the start column reads as before and the offset reads `+02:00`.
- Given an existing export, when the new column is added, then every column it had before is still there with the same header and values (PRD-3).
- Given the export, when it is produced, then it must not change the date format of any existing column.

## Boundaries
- Must not touch the date format (mm/dd or dd/mm) of existing columns: that is the open question in IN-8686.
- Must not change how times are stored (PRD-2).

Allowed by AUT-1 ("new columns, filters or fields that add to what is there and take nothing away").
