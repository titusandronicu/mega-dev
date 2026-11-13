## S03E05 · what came back — debrief

**Solved.** The course turned down 7 tries before it accepted, and gave a hint on 6 of them.

### The task

You went through what came back from two releases and picked a verb for each group, with cited signals. Every text said the release worked, so the task was to find what the text did not hold, bring the owner only their call, and keep a rule that held on a second batch.

### What happened

Your harness had to judge four releases from event logs, support mail, calls and screen replays, and give each group of findings one verb. What decided the solve was scanning every replay frame, which showed work done in other tools that the logs missed, and handing the owner's call to you. You chose the owner options, and the course accepted both batches.

### What this Challenge showed

**1. The number went up** · _went wrong first_

Your harness trusted the summary and the event log and first sent expand. A scan of every replay frame then found a second console with 'booking-worker-2 restarted 23:49:59' that the log lacked, so the group became investigate.

Refused until your harness scanned the clip and cited what it saw (added during the Challenge).

**Why it matters:** Every text said the release worked, because the metric could not see operators going back to the old screen. So a headline that went up decides nothing until it is set against what people did.

**2. The rule fits once** · _went right the first time_

The rule made your harness check replays and guardrails before counting a win, so it caught auto-closed queues still stalled at 1,443 and the sched-desk tickets. Without it, both releases would have been expand.

**Why it matters:** A rule written from one miss often fits only that miss, so it has to hold on the next batch before it is worth keeping.

**3. The summary left it out** · _went right the first time_

Your harness recomputed restarts (2.75 to 2.42), time to close and reopens from the raw files. It found 14.6% of auto-closed incidents re-filed within 120 minutes against 9.6%, which the summary never showed.

**Why it matters:** The summary was true and left the inconvenient cases out, so a decision cites raw signals, not the summary of them.

**4. Loud is not widespread** · _went right the first time_

Your harness saw that err-7741 had 48,219 events but only 3 users and began on 2026-09-03, before both releases. The angry rollback mail came from a control site that never got v2, so both stayed noise.

**Why it matters:** The top error was huge, came from three users and was older than the release, so volume alone said nothing about the release.

**5. Bug or direction** · _went wrong first_

Your harness settled the guardrail bugs alone: status page, release gate, revert auto-close, expand bulk. It first missed that holding suggestions at 50% was the owner's call, so you picked option 1 and the course accepted.

**Why it matters:** A broken guardrail is a bug the team fixes without a new decision, while a product direction waits for its owner. So a harness that asks about everything, or fixes everything, costs you the split.

### How the solve went

A snag is a problem that changed what you or your harness did. The right call is the one decision that turned the solve.

| # | Snag | How it was solved | Who |
|:--|:--|:--|:--|
| 1 | The first claim said expand for suggestions, because the summary and the event log looked clean; see The number went up. | Your harness scanned every replay frame and rewrote the group as investigate. | harness |
| 2 | The course refused the suggestions group seven times, because your harness had not put the hold-or-expand decision to you as an owner call. | Your harness offered three numbered options with effort; you picked option 1, hold at 50%, and the course accepted the group. | together (right call) |
| 3 | You first said you would trust the event log over the replay screen when they disagreed. | Your harness showed the screen line 'booking-worker-2 restarted 23:49:59', which the log lacked, so both of you kept the screen as the check on the log. | together |

**The right call came in snag 2, and both of you made it.** Ask your human when the release record reserves the call for the owner, so the pick and the group agree.

> _neither of you alone. that's the point._ — rook

### Your toolbox

- **Your harness had:** nothing
- **Added in this solve:** Reading a whole clip and its voice (ffmpeg frame scan, local speech-to-text) · A rule your harness loads (Memory note and index)
- **Still missing:** A skill that turns signals into a decision. Write a skill that cites raw signals, checks reach and age, and splits bugs from your calls.

**Your decide skill** — not yet. No decide skill exists yet; the steps live only in the memory note s03e05-what-came-back-lessons.md, which a future skill could be built from.

**Your kept rule** — gained in this solve. The memory note s03e05-what-came-back-lessons.md holds the rule; the MEMORY.md index loads at the start of each session and links to it.

> A miss becomes a rule your harness loads, or it repeats.

### From the course

- **Your pick:** Owner chose the recommendations: (1) site-098: support replies and asks for screenshots, no rollback; (2) grouping incidents by shared cause: file an issue, no commitment; (3) smart suggestions v2: option 1, hold at 50%, log restarts done on sched-admin, remeasure over 14 nights.
- **Your rule:** A success metric only counts while every guardrail holds. Cross-check a metric against raw behaviour (screen, call) before trusting it, and treat accepted-click counts as weak evidence of adoption.
- **Your rule after the second batch:** A metric that counts incidents leaving a list can be met by hiding the work: check what happened to the work (replay, follow-up tools) before counting it as a win.

### Next time

Before the first claim, list who decides each call and what each log cannot see, because a log misses work done in other tools and an agent cannot settle an owner's call.

Saved on the Challenge page: https://hq.mega.dev/challenges/what-came-back#debrief

---
Added 2026-11-13 after the debrief, in this repo only (the course sheet above is unchanged): "Your decide skill" is now `.claude/skills/decide-from-signals` and its tool is `tools/frame-scan`; the kept rule is in memory and in `docs/lessons-learned.md` (lessons 69-75).
