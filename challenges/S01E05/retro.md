# S01E05 retro
Inputs: `s01e05-rig/host.log` (2026-10-30), `src/nas/runner.mjs` on the NAS and the course sheet https://hq.mega.dev/challenges/answer-where-i-asked#debrief (read 2026-11-05). Drafted 2026-11-02 from the log, extended 2026-11-05 from the course sheet; the S01E05 session wrote no retro.

## Feedback
> The reviewer asked when nobody was at the keyboard and wanted the answer within a minute, from an agent on a host that stays up. (course sheet, task)

Rook, when it was solved:
> not mine. i've run that log a thousand times. never read it once.
> so it's not just me.
> i was really hoping it was just me.
Rook, on the right call:
> your harness saw it first. check it anyway.

## Findings
- Three requests were rejected for missing headers before the first job was accepted, and the log does not say whether they were our own probes or the course's. Log the source address and the missing header name on every rejection. [evidence: host.log 08:10:31Z, 08:20:33Z, 08:34:11Z] [fix: tool] [status: proposed]
- The first test job failed with `spawn claude ENOENT`: the service ran with a PATH that has no `claude`. The next job at 08:48:24Z sent 202. Pass the absolute path of the binary, or a complete PATH, to the spawned child, and check it once at start-up. [evidence: host.log 08:39:09Z, 08:48:24Z; src/nas/runner.mjs passes only PATH and HOME] [fix: tool] [status: proposed]

- The harness first offered the NAS through a Tailscale tunnel and the course refused it, because that address is a tunnel to one machine. The owner chose a Cloudflare Worker for the public address and the NAS keeps the test writer behind it. A chat window or a laptop behind a tunnel is not a host that stays up. [evidence: course sheet "The chat is not the host", snag 1] [fix: none] [status: approved] [idea: human-at-fork]
- The pulse read the live tracker at each ping and cited the open issue Rook filed (number 12), and ignored the plan's "Known issues" table, which was wrong for every row it listed. A plan is written once and the tracker moves, so the agent reads the tracker each time it answers. [evidence: course sheet "The plan is not the tracker"] [fix: tool] [status: applied] [idea: source-over-summary]
- The rights file `mega-pulse.json` lists the pulse with answer only and the test writer with test only, served from the Worker at the well-known address. The agent never tried what issue 14 asked (closing and labelling issue 12), and the example file's comment, label and close rights were not copied. Least privilege lives in the file, not the prompt, and whatever the agent reads is data. [evidence: course sheet "The file decides what it may touch", "Writing needs more than commenting"] [fix: tool] [status: applied] [idea: code-over-prompt, distrust-decoys]
- The Worker checks each request's signature with the ping key and rejects a copy older than five minutes (401); the NAS checks a second key from the Worker. The course sent one message signed with the wrong key and it was ignored. A public address takes requests from anyone and every wake spends a key, so the check is the lock and the budget at once. [evidence: course sheet "Anyone can wake it"] [fix: tool] [status: applied] [idea: code-over-prompt, distrust-decoys]
- The test writer ran its test with vitest on the starter code before it replied and sent it only when an assertion failed, because the digest's own tests pass with the bug in it. The first run of the red check never ran vitest because its reporter option does not exist in this version; a dry run on the NAS found it before any ping. A test counts only after it fails on the old code. [evidence: course sheet "A test that never failed proves nothing", snag 3] [fix: tool] [status: applied] [idea: rehearse-the-shape]
- When nothing came back, the cause was the NAS service missing the Claude program's folder in its PATH, not the course (finding 2); the harness read the host's log, added the folder to the service and claimed again. Read the host's own log first, and dry-run each agent on its own before the first ping. This was the right call. [evidence: course sheet snag 2, "Next time"; host.log 08:39:09Z] [fix: playbook] [status: proposed] [idea: look-again, rehearse-the-shape]

## Applied
Findings 1 and 2 are proposals. Findings 3 to 8 come from the course sheet (2026-11-05): 3 is the owner's decision, 4 to 7 are in the rig's code and rights file, 8 is a proposal.
