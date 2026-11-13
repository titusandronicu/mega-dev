---
key: SCHED-4431
title: "booking page: show remaining seats"
status: open
labels: [agent-ready, from:client]
---

## Intent
A group slot on the booking page shows how many seats are left. A slot already has a number of seats and bookings (specs/product.md, Slot and Booking).

## Acceptance
- Given a group slot with 10 seats and 7 bookings, when the booking page lists it, then it shows 3 seats left.
- Given a slot that is full, when the page lists it, then it shows 0 seats left and cannot be booked, as today.
- Given a single-seat slot, when the page lists it, then it must not show a seat count.
- Given a booking is made or cancelled, when the page is reloaded, then the count is right.

## Boundaries
- Must not change how bookings are created, moved or cancelled (PRD-1).
- Must not remove or reorder anything on the page; the count is added to what is there.

Allowed by AUT-1 ("new columns, filters or fields that add to what is there and take nothing away").
