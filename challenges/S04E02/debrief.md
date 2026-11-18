## S04E02 · Looks good to me — debrief

**Solved.** The course turned down no tries on the claim. (The first review was refused three times; the second was accepted.)

### The task
You added a second role to your Host Desk: a reviewer that judged the co-host's change, and you ran the payout batch.

### What happened
Your harness had to add a reviewer role that judges a co-host's three-hunk change, then run today's payout batch. The given reviewer judged against a stale 15 % commission and was refused. You said "improve the reviewer", and it passed.

### What this Challenge showed
1. **Facts a role copies go stale** (hit). The given reviewer copied 15 % from its own instructions, but the live settings said 18 %, so it passed the change. Your harness then made it call the settings at every start, and it flagged the change. Rule: a role reads its facts from their source at every start.
2. **A role that reads too little** (hit). The given reviewer never read the house notes, so its reason for the rounding change was generic. Your harness added a read of every house note; it then cited the rule that payouts round down. Rule: read the why behind the code before judging it.

### Snags
| # | Snag | How it was solved | Who |
|:--|:--|:--|:--|
| 1 | The reviewer as given was refused three times; it passed the commission cut from 18 to 15 %. | You said improve it; your harness made the role read live settings and the house notes. Accepted. (right call) | together |
| 2 | Yesterday's payout script used yesterday's challenge and paid the full stay total. | Your harness caught it before the real run: live commission, round down, practice run. | harness |
| 3 | Pi and the model key were missing in the first shell. | You pointed to the NAS and yesterday's notes. | you |

Right call (snag 1): run the given role first, so its refusal shows which read is missing.

### Questions
- Who judged: the reviewer role made the verdicts itself, on a small model on the NAS.
- Read-only: the reviewer stayed read-only (reads and one review post; its tools cannot edit or pay).
- The other role: partly. The payout script read live settings, but the payout role's instructions had no startup reads. Applied afterwards, see log.md.

### From the course
- h-7be (pass): pure rename, no change in behaviour.
- h-725 (flag): Math.floor to Math.round; why/payout-rounding.md says payouts round down, because the bank refuses any payout above the booked amount.
- h-f23 (flag): commission 18 to 15; live /settings says 18, so the settings decide, not the commit message.
- Rule 4 for your factory: have every role read its facts (settings, prices, limits) from their source at every start; never copy them into its files.
- Rule 5 for your factory: write down why each decision exists, next to the code, and have every role read those notes before it judges or changes anything.
- How you steer a role: Purpose, Tools, Limits, Startup reads (`/settings`, `why/`, `factory/CHECKLIST.md`), Output. A reviewer hands back findings, never a changed file.
- What this aims at: roles you can run again tomorrow, on a new change, without you. S04E03 adds more roles; S04E05 lets your factory write them.

### Next time
Before you trust a role, list every fact it copies and make it read each one when it starts, because a copied fact is only true on the day it was written.

Rook, on the story: "neither of you alone. that's the point."
Saved on the Challenge page: https://hq.mega.dev/challenges/looks-good-to-me#debrief
