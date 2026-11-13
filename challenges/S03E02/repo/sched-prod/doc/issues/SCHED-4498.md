---
key: SCHED-4498
title: "confirmation email: the cancel link opens the login page"
status: open
labels: [agent-ready, from:support]
---

## Intent
The cancel link in the booking confirmation email opens the booking without a login, the same way the cancel link in the reminder email already does. People who booked have no account.

## Acceptance
- Given a confirmation email, when the cancel link is opened without a session, then the booking opens and can be cancelled.
- Given the reminder email, when its cancel link is opened, then it works exactly as before.
- Given a cancel link for one booking, when it is used on another booking, then it must not open that booking.
- Given an expired or used link, when it is opened, then it shows an inline error and not a login page (DES-4).

## Boundaries
- Must not change the reminder email or how its link works.
- Must not give the link access to anything except the one booking it was sent for.

Allowed by AUT-1 ("bug fixes and small features inside the specs, with a test that shows the change").
