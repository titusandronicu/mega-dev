# Changelog
## 2026-10-26
- Repo created. S01E01 steps 1-4 done: signed in, full message refused twice, compacted 1288 -> 669 chars and accepted; form open, answer pending.
- S01E01 form: first answer refused; researching candidate model name, waiting for human's okay.
- S01E01 solved. Debrief saved on the course page and in challenges/S01E01/debrief.md. Added docs/playbook.md. Artifact `read` taken; install pending.
- Tool ideas analysed; see docs/tool-ideas.md.
- Cloud routine `mega-dev-daily-prep` created (weekdays 05:10 Warsaw, prep only, branch claude/prep-<date>). https://claude.ai/code/routines/trig_01Fmfu6p31qELCXALiQ5X5Kh
- `read` skill installed as a project skill (.claude/skills/read) and adapted: anchor detection, save-page.mjs, redact.mjs, project rules. Self-tests pass. See its README for the change table.
- Overnight job scheduled for 27 Oct 05:12 (session-only). Headless browser session `mega` was closed by mistake at ~15:00; the job re-signs in through Gmail.
- Tracked all work in context/: archive (bootstrap, S01E01, read skill), changes (overnight job, cloud routine, hook, deck cards), foundation/environment.md.
- Added solving scripts (challenges/S01E01/scripts), debrief-submitted.json and an updated docs/tools.md.
- Pre-commit hook installed (hooks/pre-commit, core.hooksPath=hooks); redact.mjs gained --stdin. Lesson: never `git reset --hard` for test cleanup.
