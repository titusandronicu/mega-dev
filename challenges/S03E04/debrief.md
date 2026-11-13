## S03E04 · show me when — debrief

**Solved.** The course turned down 2 tries before it accepted.

### The task

You built a live incident board from a plan and four ready issues, recorded it in use, and found the moment a new row slid under the click. Product changed the plan from your evidence, you rebuilt, and a replay proved the new build.

### What happened

Your harness had to build four ready issues for an incident board, deploy it, and send product a recording and a report that show it works. The first recording clicked on a still page and was refused; a click timed with a new incident landing hit the wrong row, so product chose a held list with a "N new" bar. You approved each outside step, including three extra real acks.

### What this Challenge showed

**1. The row moves under the click** · _went wrong first_

Your harness aimed at INC-6881, and a new incident landed at 8.2 seconds, so the rows shifted and the click hit INC-4371. A screenshot shows one still frame; the video showed the landing, the shift and the click in order.

**Why it matters:** Done is an observed outcome, not green tests. Some bugs live in time: only a recording of a person using it shows them.

**2. Fix is not decide** · _went right the first time_

Your harness sent product four options, not a fix, and product chose to hold the list still behind a "N new" bar. The plan's first requirement changed and a new hook, new-bar, was added.

**Why it matters:** When the honest fix breaks a plan line, the plan is wrong too. That is the owner's call, made from your evidence: flow, time, which row.

**3. The quiet night** · _did not come up_

Your harness built an empty line, "No incidents.", but never saw a quiet night. The live board always had incidents, so that state was never recorded or tested.

**Why it matters:** An empty answer is an answer: a loader must end.

**4. The blink** · _went wrong first_

The first build rewrote the whole list on every 2-second refresh, so rows were replaced under the pointer. After product's answer a refresh only feeds the bar, and a test checks that the same rows survive.

**Why it matters:** A refresh that redraws everything blinks and loses your place. Change only what changed.

**5. Proof of which build** · _went right the first time_

Your harness put the build number in the page and the footer, refused to build from uncommitted code, and compared the live files byte for byte. So the recording and the replay both name build 6d2b9816c228.

**Why it matters:** A proof names its build. Old recordings prove old builds.

**6. The robot waits** · _went wrong first_

The first recorder used a test click that waits for the page to hold still, so it saw no race and the course refused it. The second recorder moved the mouse and clicked at a fixed spot 150 ms after the landing.

**Why it matters:** Test runners wait for the page to settle; people do not. Verification has to behave like a person.

### How the solve went

A snag is a problem that changed what you or your harness did. The right call is the one decision that turned the solve.

| # | Snag | How it was solved | Who |
|:--|:--|:--|:--|
| 1 | Your harness first recorded a click three seconds after the incident landed, like a test runner, and the course refused it: "No incident landed near that ack." | A direction from the lane check said to click like a person, so your harness re-recorded with the click timed to the landing; see the question on clicks. | harness (right call) |
| 2 | The second claim named both rows in the report text, but the course refused it because the evidence block had no expected and got fields. | Your harness added expected INC-6881 and got INC-4371 to the evidence block, because the course asked for exactly that, and the third claim passed. | harness |
| 3 | The connected Cloudflare tool was signed in as a different email than yours, so your harness stopped before deploying. | You said to use that account, so your harness deployed there, and the board lives under that account's address. | you |
| 4 | Your harness did not know that the course's replay sends real acks, so it asked for your yes without saying so. | The replay sent three more real acks on your session; your harness found them in the run log and told you before step 2. | harness |

**The right call came in snag 1, and your harness made it.** A test waits for stillness and a person does not, so evidence must be captured the way a person acts.

> _your harness saw it first. check it anyway._ — rook

### Your toolbox

- **Your harness had:** A browser your agent can drive, with video (Playwright with video) · Asking the owner before changing the plan (asking you before each outside step) · Picking up product's answer later (resume-challenge with the product receipt)
- **Added in this solve:** Clicks timed like a person (mouse click at a fixed spot) · Proof of the build you ship (build stamp and the course replay) · A public video host (GitHub release assets)
- **Still missing:** nothing

**Your prove skill** — partly. No prove skill yet. Three recorder scripts and the course's replay workflow live in the public sched-prod-board repo; a skill could wrap them.

**Picked up alone** — not yet. Not alone: you approved the push, deploy, each real ack and each claim. Your harness only waited for product's answer on a timer and fetched it.

**Test or replay** — gained in this solve. The replay ran the live board at its real address, with real landings and one aimed click each. A package test would miss timing and deploy faults.

> A test checks the code you hand over; a replay checks the product people use, live, in time.

### Next time

Before you approve a replay, ask what it does to live data, because this one sent three real acks. Record clicks timed like a person from the first try, since a still page proves nothing.

Saved on the Challenge page: https://hq.mega.dev/challenges/show-me-when#debrief
