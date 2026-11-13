---
key: SCHED-4486
title: "audit log: keep 90 days"
status: open
labels: [needs-human, from:finance]
---

## Question
Finance wants audit log entries kept for 90 days, then deleted. Do we start deleting stored audit entries after 90 days?

## Options
1. Delete entries older than 90 days from now on, and delete the older ones that exist today.
2. Delete entries older than 90 days from now on, but keep what is stored today until a person has checked that nobody needs it.
3. Keep everything, and only hide entries older than 90 days in the interface.

## Recommendation
Option 2.

## Why
Because the change deletes data that is already stored, and AUT-2 says deleting or rewriting stored data needs a person. Option 2 gives finance the rule without an irreversible first run.
