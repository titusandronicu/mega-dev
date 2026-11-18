# S04E03 Three small changes - log

Tickets, attempts, keys and receipts are never written here.

## 2026-11-18 mega-start and setup
- Lesson s04e03 "Software Factory Staff the Team"; brief saved to the dashboard. Challenge "Three small changes" (uuid ...5e04e3).
- Read the owner's transcript s04e03-transcript.md (domain agents, glossaries, scenario checks, pull and push). Did the lesson's "Try today" first: a guardrails domain agent for the secret guard (PRs 40 to 42).
- Started the Challenge. Task: give the Host Desk a team (planner written with the owner, critic, worker, integrator), take the host's three change requests on a shared board, run the payout batch on the merged work.

## Setup
- Owner yes: download the team zip only; use the existing model key. Listed the zip first (no unsafe paths), no file clashes.
- Made a new folder from the S04E02 Host Desk and unzipped the team into it. The copy brought yesterday's logs with it (see Snags).
- First setup command was denied by the auto-mode check without a reason. Stopped, asked, redid it as small steps with the repo's own git identity. Fetched the manual once (route /manual; the first guess /api/manual was 404). Practice key put in by the owner in an editor.
- Base fix before any job: the payout script still pointed at the S04E02 challenge URL.

## Board
- Read the board: requests r1 (10 % off for 7+ nights), r2 (city tax 3 EUR per guest per night), r3 (no commission on the cleaning fee).
- Critics (haiku) posted five questions each. The r2 critic's first post was refused with a 422 and nothing was recorded; one rerun posted. The host answered r2 only: 5 nights at most, commission on the tax, bookings made on or after 17 November. r1 and r3: build as written.
- Planner (haiku): first run refused to post (its own Limits forbade copying tax or discount numbers). Fixed the rule; second run posted four jobs with disjoint files: w-r1, w-r2, w-r3 and the merge job m-1.
- Workers claimed and posted. Reviewer: 0 of 6 hunks flagged. Integrator merged three jobs, wired them, posted last. Reviewer again: 0 of 13.

## Checks before the run
- node --check, a diff read, and seven worked examples through the three modules against hand sums (for example 7 nights, 100 EUR, cleaning 50, 2 guests, booked 18 Nov, 16 % gives 604). All matched.
- Practice: 3 paid, 0 flagged. The reply says only that practice is done; it does not confirm amounts.

## Run
- First start refused locally: a run marker copied from S04E02. Its content was dated 2026-11-17; the refused attempt had sent two reads and nothing to the run route. Renamed the marker, ran once.
- Result: 20 answered in 2.8 s, 18 paid (19,757 EUR), 2 parked: BK-98158 (redirect to an unapproved host, key not sent on) and BK-79959 (account other than the one on file).
- Advice given: decline the first, pay the second to the account on file. Owner decided both on the page. First finish skipped task 16 because the copied finished list said it was paid (yesterday's entry). Removed the stale entries (backup kept), finished again: 15 declined, 16 paid 678 EUR.

## Claim
- The first claim was denied by the auto-mode check. Owner said "claim it"; sent once, solved. Debrief saved, then lessons 86 to 89, the debrief file and the Host Desk checklist rules 6 and 7.
