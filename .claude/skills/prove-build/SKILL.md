---
name: prove-build
description: Use when a task asks for a recording, a proof of a build, a replay of flows against a live address, or evidence that a screen works. It records the product the way a person uses it, marks the moment that breaks (what, when, which row you meant, which got it), and checks the proof is of the build that is live. Taken from S03E04 "show me when".
---

# prove-build

A recording proves nothing if the page held still, if the video's clock is guessed, or if it shows an older build. Seven rules, each with a check. Lessons 65-68 in `docs/lessons-learned.md` say why.

Nothing here installs software. The recorders need Playwright (`npm i playwright@1.64.1`, `npx playwright install chromium`) in the folder where you run them.

## 1. Stamp the build, then compare the live files to it
- Put the git sha in the page twice: `<meta name="build" content="...">` and a visible footer (`scripts/build-stamp.mjs` injects it and refuses to build from uncommitted code).
- After deploying, fetch every served file and `cmp` it with `dist/`. An upload reply proves the upload, not what the public gets.
- Done: the live `meta` sha equals the commit you built, and every file is byte-identical.

## 2. Check the account before you deploy
Call the host's `whoami` first and compare it with the owner's email. In S03E04 the connected Cloudflare tool was a different account; the owner chose it, but only after being asked. A wrong account is a public page in someone else's account.

## 3. Aim for the moment that breaks, and act like a person
- A test runner waits for the page to hold still. A person looks, moves and clicks while it changes. A test-style click saw no race and the course refused it (`No incident landed near that ack`).
- Move the mouse onto the target in steps, wait for the real change (a new row, a bar), wait about 150 ms, then click at the spot you aimed at with `page.mouse.click(x, y)`. No stability wait, no mocked data.
- Examples: `scripts/record-race.mjs` (a row slides under the click) and `scripts/record-hold.mjs` (the same race after the fix: the meant row gets the ack).
- A caption the recorder adds to the video must say so ("added by the recorder"), and a receipt in it is copied from the page's own console, never typed.

## 4. Read the moments from the video, not from your own clock
Run `tools/video-sheet <video> <start> <end> <step> [crop]` and read the red times. In S03E04 the video ran about a second behind the script's event log; the first claim would have named the wrong second.

## 5. Name the evidence the way the course asks
When a report has an evidence block, put the facts in fields: `expected` and `got` (incident ids), `at`, `receipt`, `sha`, `videoLink`. The same words in prose did not count. When the course asks which row you meant, the answer is two ids.

## 6. Ask what a replay does to live data before you approve it
Read the replay file (it is pinned by sha) or ask. The course's replay in S03E04 sent three real acks on the session. Count every irreversible action in `challenges/<code>/log.md` (yours and the replay's) and tell the owner the number before the claim.

## 7. Test the quiet night
Run the board with an empty answer: the loader must end and the empty state must show. Add that case to the test.

When the honest fix changes the plan, send the owner or product options and the evidence, not a fix. They decide; then you change the plan.
