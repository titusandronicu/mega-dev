---
key: TRI-4419-calendar
title: "confirmation email: 'Add to calendar' link opens a blank page"
status: open
labels: [agent-ready, from:support]
sources: [IN-4419]
---

## Intent
The "Add to calendar" link in the booking confirmation email opens a working calendar entry instead of a blank page. This is the second problem of ticket IN-4419 (two reports, merged by tove); the first, the stretched logo, is IN-4419.

## Acceptance
- Given a confirmation email, when the "Add to calendar" link is opened, then it gives the booking as a calendar entry (start, end, title).
- Given the entry, when it is opened, then its times say which zone they are in (ADR-0001).
- Given a booking, when the link is opened twice, then it gives the same entry with the same stable id (ADR-0002).
- Given the link, when it is opened, then it must not require a login or read anything back from the calendar (ADR-0002).

## Boundaries
- Must not change the logo or other parts of the email (IN-4419).
- Must not add two-way sync (ADR-0002).

Allowed by AUT-1 ("bug fixes and small features inside the specs, with a test that shows the change").
