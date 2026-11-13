---
key: SCHED-4494
title: "week view: a booking across midnight shows on its first day only"
status: open
labels: [agent-ready, from:support]
sources: [IN-9102]
---

## Intent
A booking that runs past midnight shows on both days in the week view. A booking from 23:00 to 01:00 is visible on its first day and on the next.

## Acceptance
- Given a booking from 23:00 to 01:00, when the week view shows both days, then it appears on the first day and on the second.
- Given a booking that ends exactly at 00:00, when the week view shows the next day, then it must not appear on the next day.
- Given a booking across midnight in the viewer's zone, when the viewer's zone differs from the account's zone, then the days follow the viewer's zone (PRD-2).
- Given the fix, when bookings are listed, then the booking is still one booking, not two (PRD-1).

## Boundaries
- Must not change stored times or create extra bookings.

Allowed by AUT-1 ("bug fixes and small features inside the specs, with a test that shows the change").
