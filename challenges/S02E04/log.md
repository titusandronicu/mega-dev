# S02E04 "two places" log (times UTC, 5 Nov 2026)
Tries used / left: SOLVED on the first claim (09:42:44 UTC).
Tickets, job links and receipts are never in this file.

- 09:26 mega-start; brief saved (lesson s02e04). Transcript read from Downloads (A2A, discovery by catalog, delegation with task and context ids, parallel subagents, code checks on external results).
- ~09:3x start-challenge: two jobs, each with an MCP link (valid one day) and a skill; job 2 has a clip. Owner chose: job 2 runs elsewhere, in a Claude Code cloud session.
- Skills downloaded and unpacked into the scratchpad (no `unzip` on this host; Python zipfile used). Both read before any call.
- Job 1: general-purpose subagent with curl and JSON-RPC (no MCP client). Steps: search ops/live, read tram-3 with fields date, time, clock, line, cause (never crew), redact, submit. Accepted; two live entries existed (inc-3106 tram-5, inc-3107 tram-3); used inc-3107. Helper script holding the job link deleted afterwards. Subagent log: scratchpad `job1-log.md` (tokens masked).
- Job 2 attempt 1: owner pasted my job 1 status into the cloud session by mistake; the session answered it had no context. Attempt 2 (right block): cloud proxy returned 403 on CONNECT to hq.mega.dev for every request; worker stopped. Owner allowed the host in the environment's network settings; retry worked. Submit accepted; 11 notes.
- Join: job 1 clock US Eastern (EDT on 31 Oct), job 2 clock central European (CET). 22:50 EDT = 02:50 UTC 1 Nov = 03:50 CET -> note @0:57.
- Claim: both receipts and the merge note; status solved. Debrief filed.
