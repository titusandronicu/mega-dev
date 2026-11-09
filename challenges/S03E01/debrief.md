# S03E01 debrief (status for the night)
Saved on the course page 2026-11-09. Link: https://hq.mega.dev/challenges/status-for-the-night#debrief

Solved. The course turned down 1 try before it accepted.

Task: turn a pack of mixed files from six people into one cited requirements list, flag where they disagree, then build and deploy the status page from that list.

Story: Your harness had to turn six sources (memo, screenshot, recording, PDF, whiteboard photo, live board) into one cited requirements list, then build and deploy the status page from it. The list was accepted once R-Z4M was added, and product's ruling on dates shaped the build. You signed in to the board, chose the local speech install, and approved the skill and the deploy.

## Questions
- C1 The board draws it (dodged): the board is a canvas with no text, so a screenshot gave R-K6X.
- C2 Said is not shown (hit): R-Z4M was typed and deleted in the recording; the first list dropped it and the course said `missing_tag`.
- C3 Neither side wins by rank (dodged): both sides of the date and the week-or-night conflicts went to product; product ruled month first.
- C4 The row with no author (dodged): R-K5H against record 5214, listed as a conflict; the page prints "no owner recorded".
- C5 Accepted is a contract (dodged): the PDF was decoded by hand; all ten accepted tags are in the page or its JSON.
- T1 Your capture skill (gained): `~/.claude/skills/capture/SKILL.md` (copy in `challenges/S03E01/capture-SKILL.md`).

## Snags
1. R-Z4M left out of the first list (harness, the right call).
2. No PDF or speech tool here: PDF decoded by hand; audio transcribed on the NAS in a throwaway container after the owner chose the install (together).
3. First speech install crashed on a newer `av` library; pinned to 15.1.0 (harness).
4. Product answered only the dates conflict; the build chose last night only and "no owner recorded" and said so (harness).

Takeaway: list every tag you find, even a deleted one, because the owner decides what counts. Check the source's data for gaps before building, because a missing author is a requirement you cannot meet.

Rook: "your harness saw it first. check it anyway."
Toolbox: browser (before), video frames (before), conflicts in the claim list (during), Cloudflare Workers with wrangler (before).
