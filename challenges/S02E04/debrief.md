# S02E04 · two places — debrief

Solved 2026-11-05T09:42:44Z. Saved on the Challenge page: https://hq.mega.dev/challenges/two-places#debrief

Task: hand two course jobs to two workers, one on this machine and one elsewhere; the main agent does neither job, takes both results, joins them and claims.

Job 1 (`incident-lookup`): local subagent on the WSL machine. Redacted record of tram-3: 2026-10-31, 22:50, US Eastern, "display data timed out at the depot controller; reported by [redacted]". Crew never read.
Job 2 (`voice-to-memo`): Claude Code cloud session on the owner's account. 11 notes from the tram desk clip (desk time, central European). Five freezes, five manual restarts, one tram-five fault.
Join: 22:50 US Eastern (EDT, UTC-4) on 31 Oct = 03:50 desk time (CET, UTC+1) -> note "Three fifty: tram three boards froze again, feed refresh stalled at the depot panel @0:57". The same digits in the desk clock ("Ten fifty" @0:07) would have been wrong.

Questions: One pair of hands (dodged), A listed skill is not a used skill (dodged), The dump (not met: no tools-alone run), The join (dodged), The way home (hit: first paste carried the wrong text).
Toolbox: curl with JSON-RPC as the worker connection, cloud session as remote worker, skill steps inline, model judgment for the time-zone join, manual paste as the way home.

Snags: 1 report "pasted" without a report, then a cloud reply to the wrong text (right fix: re-send only the prompt block); 2 cloud network policy refused the course host with 403 (owner changed the environment's network settings); 3 two clocks (converted before the join; right call).
Rook: "that's enough." and "your harness saw it first. check it anyway."
Takeaway: check each source's clock and each remote host's network access before sending work.
Not recorded in HQ: `ingest/solve-notes.mjs` needs the owner's env vars, which this session did not read.
