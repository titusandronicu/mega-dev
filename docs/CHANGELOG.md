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
- 2026-10-27: overnight S01E02 run stopped at step 2 because the mega-challenge MCP needed re-authorization. Nothing sent. See challenges/S01E02/overnight.md.
## 2026-10-27 (UGREEN session)
- Mapped mega-hq (repo-map): no risk zones; watch items listed in context/changes/2026-10-27-hq-pipeline.md.
- Course MCP works again. Lesson S01E02 and both challenges loaded into HQ; proposer `claude-mac` created (3 tools, cap 20/day). Deck page still needs a course session (403 and 429 on sign-in from the UGREEN).
- `read` artifact installed on the UGREEN (`~/.claude/skills/read`). Added context/foundation/hq.md, context/changes/2026-10-27-hq-pipeline.md, tools and lessons updates.
- 2026-10-27: plan for splitting work across Mac mini, UGREEN and Grok Bot (context/changes/2026-10-27-tooling-split.md). mega-dev cloned to /home/Funky/Dev/mega-dev on the UGREEN.
- 2026-10-27: S01E02 first session done: audio and video reports and the record accepted (UTC 02:38 / local+2h 04:38). Waiting for the new-session claim.
- 2026-10-27: toolbox filled: `tools/transcribe` (local faster-whisper, small model, sentence times), hand-off template + `tools/check-handoff`, `source-reader` subagent, CLAUDE.md. Venv is Python 3.11 because `av` has no wheel for 3.15.
- 2026-10-27: HQ solve notes: `mega-hq/ingest/solve-notes.mjs` loads `challenges/<code>/debrief.md` (summary + snag table) into HQ; the Task screen shows HOW IT WAS SOLVED and LESSONS. CLAUDE.md now asks for it after the debrief; documented in docs/tools.md.
- 2026-10-27: retro loop (RETRO-TEMPLATE, tools/retro-check, tools/speech-offsets, CLAUDE.md rules); S01E02 retro findings applied.
- 2026-10-27: plan for the Grok bot communication loop (context/changes/2026-10-27-grok-comms-loop.md): runs queue as the bus, `/remote-control` for the owner.
