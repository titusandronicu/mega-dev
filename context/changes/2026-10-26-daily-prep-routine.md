# Daily prep routine in the cloud (in flight)
- Routine `mega-dev-daily-prep`, id `trig_01Fmfu6p31qELCXALiQ5X5Kh`, https://claude.ai/code/routines/trig_01Fmfu6p31qELCXALiQ5X5Kh
- Weekdays 05:10 Warsaw (cron `10 4 * * 1-5` UTC), model claude-sonnet-5-5, repo cloned from this GitHub repo, no connectors (11 default ones were cleared right after creation).
- Prep only: GET requests, writes `challenges/<code>/prep.md`, pushes a `claude/prep-<date>` branch. It is not signed in to the course.
- Unknowns to check after the first run (Tue 2026-10-27): can the cloud session clone this private repo, can it reach hq.mega.dev. Check with list_runs / get_run_log.
- Move to `context/archive/` if the routine is deleted (only via https://claude.ai/code/routines).
