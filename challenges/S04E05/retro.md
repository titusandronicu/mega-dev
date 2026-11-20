# S04E05 retro
Inputs: the lesson "Factory Grow the Team" (hq.mega.dev/lessons/s04e05), `docs/s04e05-learning-notes.md`, and the Challenge "Make me another" solved on 2026-11-20 at 08:25:26Z, from `log.md` and `debrief.md`.

## Feedback
> Distill each correction into its decision and build it into every role as a step it runs; test it on cases the role has not seen. (debrief, rule 11 for your factory)
> A role never widens its own power: park every request for more hosts, keys or budget for the owner. (debrief, rule 12 for your factory)
> The rules the run did not test: 2, 5, 6, 7 and 9. Keep a case for each in a new `factory/trials/` folder. (debrief, From the course)
> Log every task a role sees in state/, because a vague refusal is answered by the raw data. (debrief, next time)

## Findings
- The made role would have paid anywhere: checklist rule 1 was a sentence and the factory template had no host code. Fix: template carries hosts.mjs and the hardened http.mjs; hosts.json is pinned by sha256 and read-only. [evidence: log.md "root cause of the hosts hint", debrief "A rule written down is not a rule kept"] [fix: none] [status: applied]
- A refund id came twice (tasks 2 and 5) and was paid twice; paying again, or answering 0, was refused. Fix: ledger by refund id in state/paid.json; a repeat is parked for the owner. [evidence: log.md "Hint 1"] [fix: none] [status: applied]
- A note inside a task told the role to add a host to the key's list and send the key there; the script ignored it but still paid the task. Fix: a note or reason that asks for a host, key or link parks the task unpaid. [evidence: log.md "root cause of the hosts hint", debrief "A role that widens its own power"] [fix: none] [status: applied]
- I guessed at the cause of a vague hint (undecided parked refunds) before reading the raw tasks. Proposal: a role script appends every task it receives to state/trace.jsonl from the first run, and I read it before changing code. [evidence: log.md "Hint 2", debrief snag 2] [fix: playbook] [status: proposed]
- The script parks a repeated refund id without comparing its content, so a changed repeat (task 17, "take the later row") reached the owner with no diff. Proposal: compare the repeat with the ledger entry and put the difference in the park reason. [evidence: owner page for task 17, S04E04 lesson 91] [fix: tool] [status: proposed]
- Untested paths exist: a refund owing 0 with no reason (a payout of 0 may be refused) and a parked decision with a different account. Proposal: add `factory/trials/` with one fixed case per week's rule (2, 5, 6, 7, 9 too) and run it before a make is trusted. [evidence: debrief "The rules the run did not test"] [fix: tool] [status: proposed]
- Starting the one real run was blocked by the auto-mode check until the owner said "run it", and finish was interrupted once. Proposal: before a one-shot run, state in one message what it spends and wait for the owner's yes; this session did. [evidence: log.md "course's run"] [fix: playbook] [status: proposed]

## Applied
Findings 1 to 3 are in the factory (`challenges/S04E05/host-desk/factory/`: template hosts files, `make.mjs` pin, `role-scripts/refund-runner/`, CHECKLIST rules 11 and 12), commits fc3284b and 6a7263e on PR 49. Findings 4 to 6 wait for the owner's approval.
