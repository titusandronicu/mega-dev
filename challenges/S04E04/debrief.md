# S04E04 Leave it running: debrief

Solved on 2026-11-19 at 10:53:22Z. The course accepted the claim on the sixth night; five runs were refused, four of them with a hint.

## What happened
- Your harness gave the Host Desk a night desk: a poller on the NAS that pulls booking events, starts a role once per event and posts the result. All roles ran on haiku 4.5.
- Event 5 never reached the feed on the first four nights. The hints led to two course jobs no role of yours owns (`legacy/export`, `rook/lint`). You ran a script that stopped them, and event 5 arrived.
- A redelivered event was answered `applied` twice and the course refused the run. A changed repeat under the same id (+2, then +3 nights) needs the owner, not "later wins".
- Guest requests and a message with no booking are parked, not applied. The batch parked 4 of 20 tasks; you decided them (as booked 137 and 2,381 EUR, the account on file, keep the first version 902 EUR).

## Snags
1. The payout role fetched the manual again: a new attempt with no night.
2. The poller died on a 10-second network timeout, twice.
3. The desk applied a guest's request as +1 night.
4. The auto-mode check blocked the stop call after the owner's yes; the owner ran a script instead.

## Lessons added
90 to 94 in docs/lessons-learned.md.
