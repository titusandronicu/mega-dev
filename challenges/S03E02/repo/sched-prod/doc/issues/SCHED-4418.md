---
key: SCHED-4418
title: "week view: first day of the week follows the account locale"
status: open
labels: [agent-ready, from:support]
---

## Intent
The week view starts on the day the account's locale says (Monday for most of Europe, Sunday for the US) instead of always on Sunday. The account already has a locale (specs/product.md, Account).

## Acceptance
- Given an account with a locale whose week starts on Monday, when the week view opens, then the first column is Monday.
- Given an account with a locale whose week starts on Sunday, when the week view opens, then the first column is Sunday, as today.
- Given a booking, when the first day of the week changes, then the booking still shows on the same date and time.
- Given an account with no locale set, when the week view opens, then it must not fail: it keeps today's Sunday start.

## Boundaries
- Must not touch stored times (PRD-2) or the booking data.
- Must not add a new setting: the locale decides.

Allowed by AUT-1 ("bug fixes and small features inside the specs, with a test that shows the change"); the test covers the locales above.
