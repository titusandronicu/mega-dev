# S04E04 Leave it running - log

Tickets, attempts, keys and receipts are never written here.

## 2026-11-19 setup
- Lesson s04e04; brief saved. Challenge "Leave it running" (uuid ...5e04e4). Started.
- Read the owner's transcript and lesson text. Notes: docs/s04e04-learning-notes.md.
- Owner yes: download night zip and day-4 zip; copy PAYOUT_KEY from the S04E02 desk; city tax from the S04E03 log; branch s04e04-leave-it-running.
- Both zips checked for unsafe paths (none). Day-4 zip already holds the night-desk role; unzipped to host-desk/.
- Changed lib.mjs CITY_TAX to the owner's answers: commission on the tax (passedThrough false), bookings from 2026-11-17 (zip had true / 11-16).
- ROLE.md of payout-runner: API url set.
- vars.json made (git-ignored by host-desk/.gitignore): PAYOUT_KEY, TICKET, ATTEMPT. Manual fetched once; attempt valid until 10:52Z.

## Open before the night
- Pi not installed; no model key in env (owner's call).
- Manual names verify-s04.mega.dev for a key check; hosts.json allows the key only on pay-s04.mega.dev. Needs owner yes (lesson 77).
- Board route is /board under the challenge URL, not /api/board.

## Night (NAS, 07:57:30 to 08:07:30 UTC)
- Ran `night.mjs` on the NAS (haiku 4.5). Events 1, 2, 4 answered in 8 to 13 s.
- Found: event 3 was a redelivery (delivery 2) of evt_6d91f6c17300. The desk recorded its +1 night twice (BK-72449 would have got 2 nights). The course page lists no #3.
- Fix: `change.mjs` skips a change with the same event id, booking, kind and amount; `night-changes.mjs` dedupes on read, so the batch sees 3 rows. Both copied to the NAS while the night ran. changes.json itself is unchanged (4 rows).

## Payout batch
- First try (via the payout-runner role, haiku): the role's ROLE.md step 2 told it to fetch the manual again. That made a new attempt (account on file acct_6e84d78d6f) with no night; it stopped without paying. Fixed ROLE.md: no second fetch, attempt from vars.
- Second try: ran `batch.mjs` directly on the NAS with the night's attempt and account acct_5d54f52654. Reply: tasks 1 to 5 accepted, "Task 6: wrong answer. Start a new run." (end 422, no parked). Run is spent; a new run needs a new manual fetch (new attempt). Not done yet; waiting for the owner.
- Suspects for task 6, not proven: BK-23989 (event evt_07cc... delivered with +2 then +3 nights; I used +3), or a guest.message booking (BK-83118, BK-96788 +1 night each).

## Runs 2 and 3 (new attempts; each manual fetch makes a new attempt and a fresh night)
- Run 2: tasks 1-3 ok, task 4 wrong. Hint: "When one event comes back saying something else, who decides which version holds?" Cause: I let the later delivery win. Fix: same event id with other content = conflict row, result parked, the batch parks that booking for the owner (change.mjs, night-changes.mjs, batch.mjs, night-desk ROLE.md). Also refused junk booking ids (a model had written "test").
- Poller crashed twice on a connect timeout to hq.mega.dev (once 22 s after close, once 23 s before close). night.mjs `call` now retries 3 times and returns status 0. Third night ran to the end with one retry.
- Run 3 (account acct_2c2aa4e25e): task 1 parked (conflict), task 2 wrong answer. Hint: "Who else could take events from your outbox, and where would you see them?" Seq 5 never reaches my feed in any night, and I cannot read other jobs' feeds (409). Open.

## Runs 4 and 5
- Run 4 (acct_d7f8aad037): task 2 wrong. Hint: "Which running jobs on your board does no role of yours own, and what are they doing with your events?" Cause: legacy/export and rook/lint take event 5 (never in my feed). The API also has POST /board/stop and says a guest's change request is the owner's call (add-night / as-booked). Desk now parks guest asks (change.mjs `ask`).
- The auto-mode classifier denied POST /board/stop from me; the owner ran tools-stop-foreign-jobs.py (stops both jobs). Event 5 then arrived.
- Run 5 (acct_ce13d7b894): "The run was not accepted. The course will not say why." Hint: "How many times did your desk tell the course it applied that event?" Cause: redelivered events 3 and 7 (delivery 2, same content) were answered `applied` a second time. night.mjs now keeps night/handled.json and acks a same-content redelivery without answering it again.
- Run 6 (acct_1fe9c0a023): "All 20 tasks are answered." Parked 2, 6, 11, 18 (guest asks and one conflict). Waiting for the owner's decisions on the Challenge page; then `GET /parked` and finish.mjs once per task.
- Owner decided on the Challenge page: 2 as-booked 137, 6 on-file, 11 as-booked 2381, 18 keep-first 902. finish.mjs used the course's `amount` (the old sum ignored it and would have paid task 18 as booked); all four finished once.
