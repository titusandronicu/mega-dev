# S04E02 retro
Inputs: the lesson "Software Factory Build the workspace" (hq.mega.dev/lessons/s04e02), the owner's transcript `s04e02-transcript.md`, and the Challenge "Looks good to me" solved on 2026-11-17 at 08:24:30Z, from `log.md` and the course debrief (`challenges/S04E02/debrief.md`).

## Feedback
> neither of you alone. that's the point. (Rook, on the right call)
> Have every role read its facts (settings, prices, limits) from their source at every start; never copy them into its files. (debrief, rule 4 for your factory)
> Write down why each decision exists, next to the code, and have every role read those notes before it judges or changes anything. (debrief, rule 5 for your factory)
> Before you trust a role, list every fact it copies and make it read each one when it starts. (debrief, next time)

## Findings
- A role that copies a fact (the commission) judges against a stale value: the given reviewer passed the 18 to 15 % cut and was refused three times. Fix: the role reads `GET /settings` at every start. [evidence: log.md "Reviewer run 1", debrief "Facts a role copies go stale"] [fix: none] [status: applied]
- A role that reads no house notes gives generic reasons and misses decisions made on purpose (round down). Fix: `why/` notes next to the code, read at every start through `scripts/read-why.mjs`. [evidence: log.md "Improved reviewer", debrief "A role that reads too little"] [fix: none] [status: applied]
- The payout role's own instructions had no startup reads, although its script read live settings. Fix: ROLE.md startup reads (live facts, why notes, checklist) and `why/house-commission.md`, `why/owner-decides.md`. [evidence: debrief "The other role" (partly)] [fix: none] [status: applied]
- I reused last challenge's payout script without checking what changed: it still pointed at the old challenge URL and paid the full stay total. Found by reading the diff before the run. Proposal: before reusing a script across challenges, diff its base URL and its money rule against the new manual. [evidence: log.md "Payout batch"] [fix: playbook] [status: proposed]
- Running the given role first showed exactly which reads were missing; a refused review did not use up the attempt, so the second post was accepted. Proposal: for a role handed over as given, run it once unchanged, read its failure, then change only the missing read. [evidence: log.md "Reviewer run 1", debrief snag 1 right call] [fix: playbook] [status: proposed]
- The practice and the real batch were run by hand, not through the Pi agent, because of the 6 s limit and the single code call. Proposal: say so in the log each time, and prefer the agent run when the time limit allows. [evidence: log.md "Deviation to state"] [fix: none] [status: proposed]

## Applied
Findings 1 to 3 changed the Host Desk (factory/CHECKLIST.md, why/, roles/reviewer, roles/payout-runner), copied under `challenges/S04E02/host-desk/`. No repo rule or playbook change yet; findings 4 to 6 wait for the owner.
