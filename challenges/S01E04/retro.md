# S01E04 retro
Inputs: the working log `s01e04-log/log.md` on the NAS (2026-10-29), not the course debrief. Drafted 2026-11-02, after the fact; the S01E04 session wrote no retro.

## Feedback
> Not solved yet: take your lane marker off the preview. Ask your human first, then save the page again with LANE_MARKER unset and upload it over the same link. (course reply, quoted in the log at 18:15:42Z)

## Findings
- The preview went to the reviewer with the lane marker still in it, and the reviewer sent it back. Before publishing a page, read the served bytes for the marker and for external refs, then send it. [evidence: log 17:56:07Z (marker present), 18:15:42Z (reply)] [fix: playbook] [status: proposed]
- Three relogin runs failed before the sign-in mail was sent to the address form the profile page shows (dotted). The mail then arrived in 16 seconds. Take the enrolled address from the profile page, not from memory or the mail header. [evidence: log 18:43:06Z, 18:53:10Z, 18:59:29Z, 19:00:23Z] [fix: playbook] [status: proposed]
- Two parallel agents each added the same `readNight` import, and the lead found it only after the merge. Run the typecheck after every merge of parallel work, not once at the end. [evidence: log 17:52:25Z] [fix: playbook] [status: proposed]
- The deck visit timed out once on load and the job gave up. One retry on load timeout was added to `visit-deck.mjs`. [evidence: log 19:24:28Z] [fix: tool] [status: applied]

## Applied
Finding 4 is in `visit-deck.mjs` on the NAS (log 19:24:28Z). Findings 1-3 are proposals; nothing was approved by the owner yet.
