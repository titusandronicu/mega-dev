# S04E03 retro
Inputs: the lesson "Software Factory Staff the Team" (hq.mega.dev/lessons/s04e03), the owner's transcript `s04e03-transcript.md`, and the Challenge "Three small changes" solved on 2026-11-18 at 09:51:55Z, from `log.md` and the course debrief (`challenges/S04E03/debrief.md`).

## Feedback
> your harness saw it first. check it anyway. (Rook, on the right call)
> Plan by files before anyone works: one owner per file, and a file every change needs goes to one integrator. (debrief, rule 6 for your factory)
> Send every unclear request to a critic first, and let the owner answer before any code changes. (debrief, rule 7 for your factory)
> Before a one-try run, check the dates of any files copied from an earlier folder, because a stale guard can block a run or skip a task. State your readings of vague requests in the plan. (debrief, next time)

## Findings
- A copied Host Desk copies its guard state: yesterday's run marker refused the first run, and yesterday's finished list marked parked task 16 as already paid, so it was skipped until the entry was removed. Proposal: before a one-try run in a copied folder, compare the dates of the copied logs with the new attempt and set stale guard files aside. [evidence: log.md "Run", debrief snag 1] [fix: none] [status: applied]
- The planner refused to post because its own Limits forbade copying tax or discount numbers into a file; only the commission is a house setting read live, and the host's own terms belong in rule modules with a why note. Fix: the Limits now separate house settings from the host's rules. [evidence: log.md "Board", debrief snag 2] [fix: none] [status: applied]
- All three requests changed one payout calculation. Giving each request its own rule module and why note, and the payout script to the integrator alone, gave a clean merge and 0 of 13 flagged hunks. [evidence: log.md "Board", debrief "Split by request, not by file"] [fix: none] [status: applied]
- The host answered only the city-tax questions; for the discount and the cleaning fee it said build as written, so three readings (nights part only, exactly 7 nights qualifies, no tax on the cleaning fee) were my assumptions. Proposal: state each reading in the job's asks and in the report, so the owner can correct it before the run. [evidence: log.md "Board", debrief "The vague request is guessed"] [fix: none] [status: applied]
- A role's report is not the board: the r2 critic said its post was refused and recorded nothing, and the board held questions for r1 and r3 only. Proposal: after every role run, count what the board holds, then rerun once. [evidence: log.md "Board"] [fix: none] [status: applied]
- The practice reply says only "done"; it did not confirm amounts, and the run log does not print each booking's rate and fee, so the three practice payouts were not checked by hand. Proposal: print rate, fee, guests and nights per task in the log so a practice amount can be checked before the single run. [evidence: log.md "Checks before the run"] [fix: none] [status: proposed]

## Applied
Findings 1 to 5 are lessons 86 to 89 in `docs/lessons-learned.md` and rules in the Host Desk checklist (rules 6 and 7, and the board count and copied-log checks). Finding 6 waits for the owner.
