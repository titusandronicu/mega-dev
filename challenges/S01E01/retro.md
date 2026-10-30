# S01E01 retro
Inputs: `challenges/S01E01/debrief.md`, `challenges/S01E01/log.md`. Drafted 2026-10-30, after the fact; the S01E01 session wrote no retro.

## Feedback
> (course feedback not pasted yet; add it verbatim, then re-run the findings)

## Findings
- Sent a body shape that was guessed; the refusal said "you guessed the shape. don't guess." and the real schema was linked from the page. The playbook rule and the `read` skill now cover this. [evidence: log.md "POST 1", debrief.md snag 1] [fix: playbook] [status: applied]
- Sent 1288 characters against a limit of 700 and counted by eye; the refusal said "compacted means shorter. count again." Counting with a script, a keep list and showing every cut are now in the playbook and in `cut-diff.mjs`. [evidence: log.md "POST 2", debrief.md snag 2] [fix: playbook] [status: applied]
- Answered a "what did they ship" question with our own model name, then with the stale name from the lesson text; both were refused. Memory first, then a dated live page from the maker, and ask the human before changing a sent answer, are in the playbook. [evidence: log.md "FORM submit 1", debrief.md snag 3] [fix: playbook] [status: applied]
- The challenge burned 5 tries and nothing in the log or a handoff recorded how many were left. Record "tries used / left" at the top of `log.md` and in `handoff.md`, and bind it to compaction, because a count is the kind of fact a summary drops. [evidence: debrief.md line 2 ("turned down 5 tries"), examples repo context-compaction README] [fix: playbook] [status: applied]
- The `read` skill's `find-contract.mjs` was a tracked file found deleted from the working tree on 2026-10-30 while the playbook, SKILL.md and README all name it; no check noticed. Make `tools/check-all` verify that every script named in `.claude/skills/read/SKILL.md` exists. [evidence: `git status` on 2026-10-30 showed ` D .claude/skills/read/scripts/find-contract.mjs`; tools/check-all checks only paths that start with a repo folder name] [fix: tool] [status: applied]

## Applied
Findings 1-3 were applied in the S01E01 session (2026-10-26): `docs/playbook.md` sections "Before the first send", "When cutting text to a limit", "Facts that change", and `.claude/skills/read/` (commit f7c8b33). Whether the owner approved them at the time was not recorded in this repo. `find-contract.mjs` was restored on 2026-10-30 (uncommitted).
Findings 4-5, owner approved 2026-10-30 (uncommitted): the tries counter is in `docs/playbook.md` (Session hygiene) and in `challenges/HANDOFF-TEMPLATE.md` as the first Facts line; `tools/check-all` has a new check "skill scripts exist". In a scratch copy with `find-contract.mjs` removed, that check fails and names the file.
