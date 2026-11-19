# S04E04 retro
Inputs: the lesson "Software Factory Wake the Team" (hq.mega.dev/lessons/s04e04), the owner's transcript `s04e04-transcript.md`, and the Challenge "Leave it running" solved on 2026-11-19 at 10:53:22Z, from `log.md` and the course debrief (`challenges/S04E04/debrief.md`).

## Feedback
> Handle each event once: keep its id and body hash; skip a repeat, send a changed repeat to the owner. (debrief, rule 8 for your factory)
> Every running job has an owner among your roles; stop the others by job id and keep yours running. (debrief, rule 9 for your factory)
> When an event names no clear target, change nothing and park it for the owner. (debrief, rule 10 for your factory)
> Read each refusal's hint literally before changing code, because every hint here named the cause. (debrief, next time)

## Findings
- A role that fetches the manual again makes a new attempt, so the payout role's own startup read split the night from the batch. Fix: the role reads the attempt from vars and never fetches twice. [evidence: log.md "Payout batch"] [fix: none] [status: applied]
- A poller that dies on one network timeout ends the night early (twice, once before the window closed). Fix: three retries on every request and a status 0 answer. [evidence: log.md "Runs 2 and 3"] [fix: none] [status: applied]
- A redelivered event, same id and same body, was answered `applied` twice and the run was refused. Fix: keep each answered event's id and body on disk; ack a repeat, answer nothing. [evidence: log.md "Runs 4 and 5"] [fix: none] [status: applied]
- The same id with other content is a change, not a retry; "later wins" was wrong and the owner decides. Fix: a conflict row, result `parked`, and the batch parks that booking. [evidence: log.md "Runs 2 and 3"] [fix: none] [status: applied]
- A guest's change request, or a message with no booking id, is never applied by the desk. Fix: an `ask` row, result `parked`; no booking means `conflict`. [evidence: log.md "Runs 4 and 5"] [fix: none] [status: applied]
- Jobs on the board that no role of yours owns took event 5 for four nights, and the board never showed it. Proposal: at the start of every night read the board and stop the jobs no role owns, before the window opens. [evidence: log.md "Runs 4 and 5", debrief "Jobs no role of yours owns"] [fix: none] [status: proposed]
- I learned the stop route and the guest decisions late because I read only part of the API listing. Proposal: print every route of the API listing, not only the ones the first task names, before the first run. [evidence: log.md "Runs 4 and 5"] [fix: none] [status: proposed]
- The auto-mode check denied a key check and the stop call after the owner's yes in chat. Proposal: when a call is denied, write a small owner-run script and ask the owner to run it, instead of asking again. [evidence: log.md] [fix: none] [status: proposed]

## Applied
Findings 1 to 5 are lessons 90 to 94 in `docs/lessons-learned.md`. Findings 6 to 8 wait for the owner.
