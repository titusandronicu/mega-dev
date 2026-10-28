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
- 2026-10-27 HQ: solve notes (Task screen, `solve-notes` tool), agent read tools (get_challenge, list_challenges, get_lesson), Runs and schedules screen, headless login spike. Fixes after live use: pause switch needed a WHERE for pg_safeupdate; solved challenges now read 6 / 6 on Today; Task screen can switch between challenges. S01E02 set to solved in HQ; challenges/S01E02/debrief.md compiled from log.md.
- 2026-10-27: retro loop (RETRO-TEMPLATE, tools/retro-check, tools/speech-offsets, CLAUDE.md rules); S01E02 retro findings applied.
- 2026-10-27: plan for the Grok bot communication loop (context/changes/2026-10-27-grok-comms-loop.md): runs queue as the bus, `/remote-control` for the owner.
- 2026-10-27: `tools/whereami` and `docs/environments.md` track which place runs what (host, containers, Mac).
- 2026-10-27: repo maps of mega-dev and mega-hq (context/map/), health check of mega-hq (context/foundation/health-check-mega-hq.md), agent background index (context/foundation/agent-background.md).
## 2026-10-28
- S01E03 ("what it shows") started from the UGREEN console: mega-challenge re-authenticated via a manual OAuth callback relay; `gh` installed from scratch (missing from the base image); kb export moved as checksummed base64 chunks, sha256-verified and extracted.
- S01E03 analysis: ran the kb's own causes.ts/locales.ts (vite-node) on the export — matched the given snapshot exactly (412 unique, parser 374 + 5 one-day-moves, hint 33, 38 tag mismatches). Read all 412 report bodies programmatically; confirmed the 5 one-day-move ids are a distinct timezone/day-boundary bug, not the parser's date swap.
- S01E03: drafted 3 issues (not filed) and a signed kb page (`kb/incidents/4471-split`, new `BreakdownTable.svelte`), left the original #4471 page untouched, rendered through a throwaway SvelteKit+mdsvex build and checked the output (desk ref, no stale banner, numbers match). mega-dev confirmed private — stays documentation-only; public tickets repo pending Kamil's choice. See challenges/S01E03/.
- S01E03: Kamil decided to make mega-dev public. Full-history secret scan (gitleaks + manual sweep) came back clean; visibility flipped; filed the 3 draft issues for real (#6, #7, #8, label `desk-ticket`), fixing a `#2` autolink collision with mega-dev's own tracking issue first. Committed the signed page deliverable (ticket verified to appear only in that one file). First `claim-challenge` call: **rejected** — "Two of yours are the same problem." Analysis points at #6/#7 (parser vs. booking-v3 hint) being one problem filed twice; proposed merging them and keeping #8 separate, not yet applied.
