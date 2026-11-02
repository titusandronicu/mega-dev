# S01E05 retro
Inputs: `s01e05-rig/host.log` (2026-10-30) and `src/nas/runner.mjs` on the NAS, not the course debrief. Drafted 2026-11-02, after the fact; the S01E05 session wrote no retro.

## Feedback
> (course feedback not pasted yet; add it verbatim, then re-run the findings)

## Findings
- Three requests were rejected for missing headers before the first job was accepted, and the log does not say whether they were our own probes or the course's. Log the source address and the missing header name on every rejection. [evidence: host.log 08:10:31Z, 08:20:33Z, 08:34:11Z] [fix: tool] [status: proposed]
- The first test job failed with `spawn claude ENOENT`: the service ran with a PATH that has no `claude`. The next job at 08:48:24Z sent 202. Pass the absolute path of the binary, or a complete PATH, to the spawned child, and check it once at start-up. [evidence: host.log 08:39:09Z, 08:48:24Z; src/nas/runner.mjs passes only PATH and HOME] [fix: tool] [status: proposed]

## Applied
Nothing applied yet; both findings are proposals.
