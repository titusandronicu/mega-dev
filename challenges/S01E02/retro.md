# S01E02 retro
Inputs: `challenges/S01E02/debrief.md`, `challenges/S01E02/log.md` and the course sheet https://hq.mega.dev/challenges/who-said-what#debrief (read 2026-11-05, which describes the second session, the one that saw only the record).

## Feedback
> neither of you alone. that's the point. (Rook, on the right call)
Course sheet next time: When you merge two sources into one record, write down which part came from which source in the hand-off notes, because a new session cannot recover that from the merged text.

## Findings
- Check for a local speech-to-text route at the start of any recording challenge; the first session had none and had to ask for a key. [evidence: debrief.md snag 1] [fix: playbook] [status: applied]
- Never hand untrusted input to a worker that runs with --yolo; a prompt is not a guardrail. [evidence: debrief.md snag 3, lessons-learned 17] [fix: claude-md] [status: applied]
- Do not trust model timestamps for speech; confirm with ffmpeg silencedetect and vote words across runs. [evidence: debrief.md snags 4-5, lessons-learned 16] [fix: tool] [status: applied]
- Answer only the asked event; recordings carry decoy times. [evidence: debrief.md snag 6] [fix: playbook] [status: applied]

- The new session got the merged record without labels for which recording said which time, so it guessed audio was the UTC summary and video the local one, and the first claim was refused. The earlier session's notes had it: video was UTC (03:19), audio local plus two hours (05:19), and the second claim was accepted. A merged record loses its source labels, so write which part came from which source into the hand-off notes before work moves. [evidence: course sheet "Which words came from which recording", snags 1 and 2] [fix: playbook] [status: applied] [idea: write-down-state, source-over-summary]
- The harness stopped and asked before it opened any file, because the brief said to work from the reply alone; the owner approved opening the S01E02 notes. Ask whoever kept the notes before guessing, because a swapped pair costs a refused claim. This was the right call. [evidence: course sheet snag 1, snag 2 (right call)] [fix: none] [status: approved] [idea: human-at-fork]
- The fresh session answered from the notes and the log the earlier session left in the working folder, without replaying the transcription. A new session has only what was kept for it, so the hand-off is written where the next session reads. [evidence: course sheet "Picking up the work in a new session"; `challenges/S01E02/log.md`, `overnight.md`] [fix: playbook] [status: applied] [idea: write-down-state]
- The two recordings kept different clocks, so one question had a different right answer in each, and one context hearing both can blend them. A separate worker per source keeps each answer with its source; the course sheet lists subagents per source as missing, and this retro did not run that part. [evidence: course sheet "Two recordings, two clocks" (did not come up), toolbox "Subagents, one per source"] [fix: skill] [status: proposed] [idea: package-it, source-over-summary]
- The course sheet says a next session has no local transcriber because the earlier session used a hosted speech API. `tools/transcribe` (local faster-whisper, sentence times) was built on 2026-10-27 after this solve, and `tools/speech-offsets` confirms offsets, so the gap is closed here; the sheet describes the state at the solve. [evidence: course sheet "Transcriber as a CLI" (not yet); `docs/CHANGELOG.md` 2026-10-27] [fix: tool] [status: applied] [idea: package-it]

## Applied
Owner approved all four on 2026-10-27.
1. Local transcriber first: `docs/playbook.md`, "Recording challenges" step 1.
2. No untrusted input to `--yolo` workers: `CLAUDE.md`, Tools section.
3. Offsets by silencedetect: new `tools/speech-offsets`, listed in `docs/tools.md` and `CLAUDE.md`; playbook step 2.
4. Decoy times: `docs/playbook.md`, "Recording challenges" step 3.
The course sheet for S01E02 was read on 2026-11-05 (https://hq.mega.dev/challenges/who-said-what#debrief); findings 5 to 9 come from it. Findings 5 and 8 are proposals, 6 is the owner's decision, and 7 and 9 are in the working folder and in `tools/transcribe`.
Playbook lines for these findings were added on 2026-11-05 (`docs/playbook.md`, "Remote workers, hosts and public links" and "Joining sources and hand-offs"; lessons 45-56 in `docs/lessons-learned.md`), with the owner's yes, in PR #21. They count as applied once it merges.
