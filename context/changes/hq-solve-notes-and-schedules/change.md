---
change_id: hq-solve-notes-and-schedules
title: HQ solve notes, agent read tools, and scheduled runs
status: implementing
created: 2026-10-27
updated: 2026-10-27
archived_at: null
---

## Notes

HQ (`~/repos/mega-hq`) gaps: show how each task was solved with lessons and insights, let agents read task data over MCP, and let the owner (phone) and Grok Bot schedule course commands, including an automatic `start-challenge`. Supersedes phases 1-5 of `context/changes/2026-10-27-hq-runs.md`; its Slack phase 6 stays separate.

### Amendments after live use (2026-10-27)
- Pause switch: `set_paused` had an `UPDATE` without `WHERE`, rejected by pg_safeupdate on the PostgREST role. Fixed by migration `20261029121000_fix_set_paused.sql`; `shared/migrations-where.test.mjs` now fails any later migration with that mistake.
- Progress display: Today showed the stored step count while Task counted a solved challenge as fully done. One helper, `web/src/lib/progress.ts`, now serves both. S01E02 was set to solved with `steps_done = 6` in the live HQ.
- Added to the Task screen (not in the original Phase 1 text): a challenge switcher, one link per challenge with the current one marked.
- S01E02 solve notes: `challenges/S01E02/debrief.md` compiled from `log.md` and `docs/lessons-learned.md`, loaded with `solve-notes`. It is labeled as compiled, not as the course debrief.
- Still open: the `sync-status` pull (Phase 5) is what will keep course status current without manual steps.
