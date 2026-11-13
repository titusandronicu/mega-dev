---
key: SCHED-4452
title: "calendar sync: Outlook events arrive twice"
status: open
labels: [agent-ready, from:support]
---

## Intent
After a sync, each booking appears once in an Outlook calendar. ADR-0002 says each booking is pushed once, with a stable id, so a calendar can tell an update from a new event. The duplicate means a push goes out without that id or is repeated.

## Acceptance
- Given a booking that is pushed to Outlook, when the sync runs twice, then the calendar holds one event for it.
- Given a booking that changes, when it is pushed again, then the existing event is updated, not added.
- Given a booking, when it is pushed, then its event carries the same stable id every time.
- Given the sync, when it runs, then it must not read events back from the external calendar (ADR-0002).

## Boundaries
- Must not add any two-way sync or read from external calendars.
- Must not delete events in a client's calendar that sched-prod did not push.

Allowed by AUT-1 ("bug fixes and small features inside the specs, with a test that shows the change"); the spec is ADR-0002.
