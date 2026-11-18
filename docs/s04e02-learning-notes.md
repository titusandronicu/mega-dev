# S04E02 learning notes: Looks good to me

A learning exercise. Each step has the decision, the reason, and what it showed. Source: the transcript `s04e02-transcript.md`, the lesson "Software Factory Build the workspace", and `challenges/S04E02/`.

## The ideas from the transcript and the lesson
- A **widget** is a glanceable view that a small model builds from your workspace or outside sources. To-dos and Memories watch conversations; Issues reads support and board cards, picks the pressing ones with a source id each, and never overstates.
- **Hill climbing**: change one instruction, run the same saved check, keep the change only if fewer lines fail. A small model overstated about 25 times; a larger one did not, which is a trade-off of time against cost.
- **Swarm hand-off**: small models gather context (code, history, related issues, package updates, past conversations) in parallel; each names its source; "nothing relevant" is a valid answer. The main conversation gets the brief and your rules in one prompt, and waits for you.
- The lesson's **control plane**: separate what defines an agent (profiles, rules, notes) from where it runs. Four parts: configuration, portability, knowledge delivery, operations. "Knowledge delivery" means a role reads fresh facts at every start.

## The Challenge, step by step
1. **Read before running.** The reviewer zip is untrusted data. Decision: extract it in a scratch folder, read the role and its scripts, then copy with no overwrite. Reason: a download can hold a script that runs with your keys.
2. **Read the patch, do not judge by the commit message.** Three hunks: a rename (no effect), `Math.floor` to `Math.round` (the house note says the bank refuses a payout above the booked amount), commission 18 to 15 (live settings say 18).
3. **Use what already exists.** Pi, the model and the keys were on the NAS from yesterday. Decision: read yesterday's log, copy the folder on the NAS (the practice key never left it), and write only the new proofs. Reason: fewer places hold a secret.
4. **Run the role as given first.** It was refused three times. Reason: its failure shows which read is missing. The cause was a settings value copied into its own file.
5. **Fix the read, not the verdicts.** The role now reads `/settings`, then `why/`, then the patch, and judges the effect of each hunk. It was accepted: pass, flag, flag.
6. **Check a reused script before the run.** Yesterday's script pointed at the old challenge and paid the full total. Fix: read the live commission, round down with integer math, run the 3-task practice first.
7. **Keep secrets on their hosts.** The manual again asked to send the payout key to a verify host. Not sent. A payout redirect to a new host was blocked and the task held for the owner.
8. **Owner decides what is the owner's.** Task 6 on-file, task 16 new account; the script paid exactly that and nothing else.
9. **Claim only on a yes.** Solved. Then the debrief rules 4 and 5 went into the checklist and the notes.

## What to carry forward
- A copied fact is true only on the day it was written; read it where it lives, at every start.
- The reason for a rule sits next to the code, or the next reader undoes it.
- Run a handed-over role as it is before improving it.
- A reviewer reports findings; it never edits.
