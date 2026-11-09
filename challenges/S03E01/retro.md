# S03E01 retro
Inputs: `challenges/S03E01/debrief.md`, the course reply and `challenges/S03E01/log.md`. Written 2026-11-09 after the solve (accepted 2026-11-09T08:39:07Z; the list was refused once, then accepted, and the build was accepted on the first claim).

## Feedback
> Solved: the course accepted the answer.

Rook's notes on the solve:
> you built what was agreed. the rest went back as questions.
> your harness saw it first. check it anyway.

Product's answer on the page: "dates month first, 10/12, the way the boards show them. R-Z8K holds, R-Z9L goes."

## Findings
- The first list had 14 of 15 tags: R-Z4M ("footer: all times UTC") was left out because product typed it in the recording and deleted it about 24.5 s later. The course answered `missing_tag: 1`. Put every tag you see in the list, even one that was retracted; the owner decides what counts, not the reader. [evidence: claim reply "missing_tag: 1", frames at 24.2 s and 24.8 s] [fix: playbook] [status: applied] [idea: source-over-summary, human-at-fork]
- The session ran from the home folder, not from `mega-dev`, so the repo's `CLAUDE.md`, `tools/transcribe` and `.claude/agents/source-reader.md` were not read. The audio was transcribed by a new `faster-whisper` container on the NAS instead; the first run crashed because the `av` library was too new (pinned to 15.1.0). Before you read any media, list `tools/` in the course repo and use its transcribe tool; `tools/transcribe` was not tried in this solve. [evidence: debrief snags 2 and 3, session log 9 Nov] [fix: playbook] [status: applied] [idea: package-it]
- The spec PDF had no viewer here (no `pdftoppm`, no `pdftotext`, no `pypdf`). The text was decoded by hand from the page content and the font ToUnicode maps. A small `tools/pdf-text` that does this with the standard library would remove the hand work. [evidence: debrief "Accepted is a contract"] [fix: tool] [status: proposed] [idea: package-it]
- Spoken tags came out of speech-to-text as "RM8Z", "RH4X", "RH9M", "RZ5H" and "Rl9x". They were read as R-M8Z, R-H4X, R-H9M, R-Z5H and R-L9X because every written tag has the shape R-letter-digit-letter. The course accepted the list, but one wrong letter would have looked the same until the claim. Say which letters are unsure, and check a heard tag against the shape of the written ones. [evidence: transcript of memo.m4a and rec-audio.m4a, claim reply "Step accepted"] [fix: skill] [status: applied] [idea: contract-first, source-over-summary]
- The live board was a canvas: its page text was empty and the accessibility snapshot was empty, so the one requirement on it (R-K6X) was read from a screenshot. A page that draws its content has to be looked at, not read. [evidence: board page HTML `<canvas data-board=...>`, screenshot `board.png`] [fix: skill] [status: applied] [idea: source-over-summary]
- Product answered only the date conflict (month first). Whole week against last night only (R-Z6L, R-H2L) and who ran incident 5214 (R-K5H) got no answer, so the build chose last night only and "no owner recorded", and said so in the chat. Both are still open questions to product; the page does not silently settle them. [evidence: Challenge page "Product answered your list", build notes of 9 Nov] [fix: none] [status: proposed] [idea: human-at-fork]
- `claim-challenge` rejected the first call with `receipts: expected record, received undefined`: the field is required even before any receipt exists. Send `receipts: {}` on the first claim, then pass the receipt from step one inside `answer` for step two. The repo's `tools/record-claim` was not run in this session. [evidence: claim error text of 9 Nov] [fix: playbook] [status: applied] [idea: contract-first]
- The page was deployed as its own Worker (`s03e01-status`) in the same Cloudflare account as the S02E03 server, public and without a login, after the owner said yes. It reads the ops feed on every request. It stays public until `wrangler delete`. [evidence: wrangler deploy output, owner yes of 9 Nov, `curl` of `/status.json` showing the CORS and cache headers] [fix: none] [status: approved] [idea: human-at-fork]

## Applied
Findings 1, 2, 4, 5 and 7 were written into `docs/lessons-learned.md` (57 to 61) and `docs/playbook.md` ("Mixed-file requirements"), and findings 4 and 5 into the `capture` skill, on 2026-11-09, with the owner's yes ("read the debrief, apply notes and update our documentation"). They count as applied once the branch merges. Finding 3 is a proposal for a tool; finding 6 waits for product; finding 8 is a record only. Commit hash: f85d0f6.
