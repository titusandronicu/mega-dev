# S01E02 solve notes (compiled from the repo records)
Compiled on 2026-10-27 from `challenges/S01E02/log.md` and `docs/lessons-learned.md`. This is not the debrief saved on the course page, and the claim session is not logged in this repo.

Result: solved. The course reports the challenge as solved (list-challenges, 2026-10-27). The first session filed the record and stopped, as the course requires; the claim was to come from a new session.

Task: two recordings of one night, a video (114.3 s) and an audio (113.2 s). Report when the batch ended and the offset of that sentence in each, then file one record of every spoken word (video words, then audio words; 285 words, numbers as words).

Answers: video said "All times are UTC", batch ended 02:38, the sentence starts at 79.7 s. Audio said "All times are local plus two hours", batch ended 04:38, the sentence starts at 64.7 s. The server accepted the audio report, the video report and the record, each with HTTP 200.

| # | Snag | Fix | Who |
|---|---|---|---|
| 1 | No speech-to-text on the host (only ffmpeg), so the harness could not hear the audio. | Asked the owner for an approved route. The owner chose transcription through a model API, using a key read once with the owner's explicit OK, held in memory only and never written down. A local transcriber (tools/transcribe) was added afterwards. | pair (owner chose) |
| 2 | The first route, a Gemini job in Mother Console, failed: its workspace is /home/Funky/agent-workspace, not /home/Funky/Dev, and is owned by another user, so the audio could not be placed there. The job reported the files missing. | Dropped that route. Sent only the two audio tracks to the transcription API, with no tools attached. | harness |
| 3 | The Gemini job ran shell commands (a search of the file system, a temporary symlink) although the prompt said read-only, no shell. It runs with --yolo. | Do not rely on a prompt as a guardrail, and do not give that worker untrusted input. | harness (finding) |
| 4 | The models' own timestamps disagreed: the same sentence came out at 19.7 s, 64.9 s and 119.6 s depending on the model. | Confirmed the offsets with ffmpeg silencedetect and took the words by majority of 3 to 6 model runs. | harness |
| 5 | Ambiguous words in the transcript: "u t c" (spelled out), "and" in "eight hundred and seventy", and "secret scan" (one of six runs said "secrets scan"). | Settled each by majority vote across the runs. | harness |
| 6 | Both recordings also say decoy times aloud (scheduled, started, first user report) next to the real batch end. | Answered only the batch end: 02:38 for the video and 04:38 for the audio. | harness |
