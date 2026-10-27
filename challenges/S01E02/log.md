# S01E02 log
(tickets and receipts are never written here)

## 2026-10-27, UGREEN session
- start-challenge accepted (ticket held in the session only; expires 2026-10-28 10:34Z).
- Task: report "when did the batch end?" (HH:MM) and the offset in seconds for each recording; then file one record (every spoken word, both recordings, in listed order); new session claims.
- Recordings downloaded to `challenges/S01E02/media/` (git-ignored): video `crank-review-*.mp4` 114.3 s, 1280x720, AAC mono; audio `status-line-*.mp3` 113.2 s, mono.
- Video frames (1 per 6 s): a static terminal, `crank 4.2.1 rev a3f9c1e`, `crank review --window current`, rows fill in over time (change #29 owner rune, sched-prod, shipped; mode read-only; approvals complete; ... health passing). No clock time or "batch" text on screen, so the answer is in the speech.
- Blocker: no speech-to-text on this host (ffmpeg only). I cannot hear audio. Need an approved way to transcribe both tracks with word timestamps.
