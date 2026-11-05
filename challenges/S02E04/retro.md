# S02E04 retro
Inputs: `challenges/S02E04/debrief.md`, the course reply and `challenges/S02E04/log.md`. Written 2026-11-05 after the solve (accepted 2026-11-05T09:42:44Z, first claim).

## Feedback
> Solved: the course accepted the answer.

Rook's notes on the solve:
> that's enough.
> your harness saw it first. check it anyway.
> you'll meet the others. they're me, mostly.

## Findings
- The two jobs used different clocks: job 1 said 22:50 US Eastern on 31 Oct, the job 2 notes were in central European desk time. Eastern was still on summer time (UTC-4) and the desk on winter time (UTC+1), so the same stall was 03:50 desk time and the note at @0:57 was right, not the one at @0:07 that shares the digits. When two sources are joined, name each one's clock and offset on that date, convert, and write the conversion into the claim log. [evidence: debrief "The join", log 5 Nov join line] [fix: playbook] [status: proposed] [idea: source-over-summary, contract-first]
- The remote worker prompt was one block inside a long chat message, and the owner pasted my previous status message instead; the cloud session answered it had no context and the round trip was lost. Put every prompt that leaves this machine in its own file, with a first line naming the job and "paste alone", and say what a correct first reply looks like. [evidence: log "attempt 1", owner paste of 5 Nov] [fix: playbook] [status: proposed] [idea: package-it, write-down-state]
- The cloud environment's network policy refused the course host with a 403 on every request, so job 2 did not run until the owner allowed `hq.mega.dev`. A remote place needs its outbound host list checked before the job link (valid for one day) is spent on it; the change belongs to the owner and is limited to the one host. [evidence: log "attempt 2", worker report "CONNECT tunnel failed, response 403"] [fix: playbook] [status: proposed] [idea: contract-first, human-at-fork]
- Neither worker had an MCP client for its job link, so both used curl with JSON-RPC over HTTP, with the session header and SSE replies handled by hand. A small helper that does initialize, initialized, list and call, and masks tokens in the log, would remove the per-worker improvisation; keep it out of any folder that holds a job link. [evidence: job 1 subagent report, scratchpad `job1-log.md`] [fix: tool] [status: proposed] [idea: package-it]
- The job link is the key to the job, so it went only into the prompt of the worker that runs that job. The local worker left a helper script with the link inside; it was deleted when the job was done. Workers that write helper files get told where, and the link is removed from them at the end. [evidence: job 1 hand-back "Helper script rpc.sh contains the job URL", log "job 1"] [fix: playbook] [status: applied] [idea: distrust-decoys, code-over-prompt]
- Job 2's tram-five segment held both a fault and a hold. The worker wrote one note, because the skill allows one `@m:ss` per note and one finding per note; the course accepted it, but whether a checker expects two notes is not known. Where a skill's counting rule is ambiguous, say in the debrief what was chosen and why. [evidence: job 2 worker report "Counting", claim reply solved] [fix: none] [status: proposed] [idea: contract-first]
- The question The dump did not come up: neither job was tried with the tools alone first, so there is no measured difference between a worker with and without its skill. Run one job tools-only next time before the skill is read, when the task allows it. [evidence: course sheet "The dump", did not come up] [fix: none] [status: proposed] [idea: rehearse-the-shape]
- The owner chose which job leaves the machine and opened the cloud session; the main agent prepared, joined and claimed but did none of the job work. Keep that split: the harness does not pick the remote place or change its network settings. [evidence: chat of 5 Nov, "job 2 runs elsewhere", "Option 1, cloud session"] [fix: none] [status: approved] [idea: human-at-fork]

## Applied
Finding 5: the helper script holding the job link was deleted on 5 Nov. Findings 1 to 4 and 6 to 7 are proposals; no playbook or tool file changed in this step. The owner asked on 2026-11-05 to update the lesson map at http://192.168.50.63:18082/ with the latest lesson notes, debrief and learned information; this file and the map data were added in that step.
