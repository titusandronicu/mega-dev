# Research: what is still missing in the mega-hq app (2026-10-27)

Question: HQ should show how each task was solved (lessons learned, insights), let the owner pull information about a task, schedule the `mega-challenge` command, and schedule tasks. What is missing?

Scope inspected: live HQ checkout `~/repos/mega-hq` at `0fe2b08` (main, in sync with origin; this answers the open question in `2026-10-27-hq-runs.md`: the live repo is `~/repos/mega-hq`, not `~/Dev/mega-hq-*`). Read: all 5 migrations' table/function lists, `schema.sql`, `plan2.sql`, `lesson_examples.sql`, `ingest/map.mjs`, `Task.tsx`, `Episode.tsx`, `Sessions.tsx`, `lib/data/*.ts`. Course side: `challenges/S01E01/debrief.md`, `challenges/S01E02/overnight.md`, `docs/lessons-learned.md`, `context/changes/*`. Not inspected: `Settings.tsx`, `Today.tsx`, `Course.tsx` bodies, the live database contents, the Supabase edge function internals beyond `hq.md`'s tool list.

## Summary
All four wishes are gaps today. The queue and schedule part is already planned (`2026-10-27-hq-runs.md`, proposed, not started). The "how it was solved / lessons / insights" part is only partly covered by that plan.

## 1. How a task was solved, lessons learned, insights
Observed:
- `challenges` holds `code, title, description, steps, status, steps_done, updated_at` and nothing else (`supabase/migrations/20261027100000_plan2.sql:11-19`; same list in `web/src/lib/data/challenges.ts:4`).
- The Task screen shows title, status badge, description and the step list. It shows no snags, no debrief and no lessons (`web/src/screens/Task.tsx:17-45`).
- The solve story exists only on the course side, as free text: a snag/fix/who table in `challenges/S01E01/debrief.md`, per-step logs in `challenges/*/log.md`, and 19 lines in `docs/lessons-learned.md` (18 numbered entries seen when read to line 40; `wc -l` says 19 lines). The lessons list has no episode tag per entry.
- Cards already carry episode-tagged learnings: `cards.kind` is `learning | haiku | challenge` with `episode_code` (`schema.sql:1,26-34`). The Episode screen lists approved `learning` cards and the haiku (`Episode.tsx:70-71`). The Task screen does not show cards.
- `ingest/map.mjs` maps `solved` (boolean), title, description and steps only. It has no field for a debrief or summary (`ingest/map.mjs:75-91`).
- `list_cards` returned `[]` on 2026-10-27, per `2026-10-27-hq-pipeline.md`; I did not re-query the live database.

Inference: the cheapest path for "lessons learned" is existing cards (kind `learning`, `episode_code` set) plus showing them on the Task screen. "How it was solved" needs new data. The plan's phase 1 adds `solved_at`, `debrief_url`, `summary`; that does not cover snags/fixes or per-task insights.

Missing:
- A place to store the snag/fix table and a solve summary per challenge (new columns or a `challenge_notes` table, owner-only RLS like the other tables).
- Ingest support for it, with the existing secret screening (`assertNoSecrets`, `ingest/ingest.mjs:8-21`).
- Task screen sections: HOW IT WAS SOLVED, LESSONS (from cards), plus a link to the debrief.
- A rule that the debrief is pushed to HQ after each solve (in the plan as a `CLAUDE.md` rule; not yet added).

## 2. Pull information about a task
"Pull" can mean two things; this is a product choice.
- (a) Pull from the course into HQ. Today this is manual: `node ingest/ingest.mjs <file>` (`hq.md`), which is why S01E02 stays `open`. The plan's `sync-status` run covers this.
- (b) An agent or the owner pulls a task's data out of HQ. The MCP intake has three tools, `propose_card`, `propose_cards`, `list_cards`, and the `proposers.allowed_tools` check rejects any other name (`schema.sql:15-20`). So an agent cannot read challenges or lessons through MCP today. A read tool needs a migration to widen that check plus an edge-function change; `service_role` already has SELECT on `challenges` (`plan2.sql` section 3).

## 3. Schedule the `mega-challenge` command
Observed:
- HQ has no `runs`, schedule or queue table. The tables created in the migrations are `lessons, proposers, cards, events, app_owner, challenges, lesson_examples`. `hq.md` also says dispatch is not built.
- The commands live in the `mega-challenge` MCP, which works only in a Claude session with the course login (plan, Findings).
- Unattended runs have already failed on that login: the overnight run on 2026-10-27 05:20 stopped at step 2 because the MCP "needs the user to re-authorize" (`challenges/S01E02/overnight.md`). The cloud prep routine avoids this by not using the MCP (`2026-10-26-daily-prep-routine.md`).
- The plan limits scheduled kinds to read-only `mega-start`, `list-challenges`, `resume-challenge`, and excludes `start-challenge`, `claim-challenge`, `debrief`, `rook`, `artifact`. It marks starting or claiming from HQ out of scope, pending its own review.

Missing: everything in plan phases 2-5 (`runs` table, `record_run` RPC, worker token, `tools/hq-worker`, `tools/hq-enqueue`, Runs screen with a Run button, cron entries, runbook). Unresolved from the plan: whether the course login survives a headless `claude -p` run on the UGREEN. The overnight failure is evidence that it may not.

## 4. Schedule tasks
Observed: no HQ feature schedules anything. Schedules today live outside HQ: the cloud routine (weekdays 05:10), the one-shot overnight job, and the planned UGREEN crontab. The plan keeps the schedule in cron, not in HQ, and gives HQ only a last-run / next-expected / overdue view.

Gap relative to the request: "schedule tasks" from the HQ screen (pick kind, time, repeat) is not in the plan. The plan's schedule is two fixed cron lines. Dispatching arbitrary tasks to workers is a separate design (Grok Bot dispatcher, ADR 0012, status Proposed per `hq.md`; `tooling-split.md` sends only code and review tasks to Grok).

## Decisions for the owner
1. Scope of "schedule": (a) fixed cron lines with an HQ status view, as planned (smallest); or (b) schedules stored in HQ and edited on the phone, with the worker reading them (more build, and the worker then trusts data that HQ holds).
2. Which commands may be scheduled. Read-only `mega-start`/`list-challenges` fit the plan. Anything that starts, claims or debriefs breaks the plan's guardrails and needs its own review.
3. Meaning of "pull": (a) sync into HQ, (b) read tool for agents, or both.
4. Whether snags/fixes live as structured rows or as one markdown `summary` per challenge.

## Suggested order (not approved)
1. Solve record: add `solved_at`, `debrief_url`, `summary` and a snags/fixes field; extend ingest and the Task screen; show episode cards on Task. Push S01E01 and S01E02 through it. This delivers wishes 1 and part of 2 with no worker.
2. Plan phases 2-5 for queue, Run button and cron. First check whether the course login survives `claude -p` on the UGREEN; that decides whether wish 3 is feasible at all.
3. Schedule-from-HQ (decision 1b) only after step 2 works.

## Limits of this note
No live DB, no running app and no Slack workspace were queried. Statements about HQ code are about commit `0fe2b08`. Claims of absence cover the files listed under "Scope inspected" only.

## Follow-up 2026-10-27: owner decisions
Owner answers to the four decisions above:
1. Schedule: set on the phone, or via Grok Bot. (Chosen: option b, schedules stored in HQ. Not the fixed-cron option.)
2. Commands: "the more the better". (Wider than the plan's read-only list.)
3. Pull: both (sync into HQ, and a read path for agents).
4. Solve notes: both structured rows and a markdown summary, taken from what is already traced in this repo (`challenges/<code>/debrief.md`, `log.md`, `docs/lessons-learned.md`).

What each answer changes (checked against `homelab-2/adr/0012-grok-bot-dispatcher.md`, 191 lines, first 80 read; status Proposed, 2026-10-16):
- **Grok route is for code/review, not course commands.** ADR 0012 gives Grok `dispatch_task`, `dispatch_review`, status, reset and `push_branch`, forwarded to mother-console on a non-`main` branch. It has no path to the course MCP, and `tooling-split.md` keeps course identity out of bot workers. So "via Grok Bot" can enqueue a request into HQ (or a code task in `mega-dev`), but the course command itself must still run in a session that holds the course login. Whether Grok may write HQ `runs` rows is not decided anywhere; it needs its own token with insert-only rights.
- **Schedules in HQ means the worker trusts HQ data.** The plan's `record_run` RPC and worker token must be extended with a `schedules` table (kind, cron/interval, enabled, owner-only RLS) and a rule that the worker accepts only kinds on its own allow-list, regardless of what a row says. Phone edits are owner-only; Grok edits would need a separate, narrower grant.
- **"More commands" collides with guardrails that the owner set earlier.** `rook` and `debrief` are "never dispatched" and start/claim from HQ is "out of scope for now" (`2026-10-27-hq-runs.md`). The new answer is a preference, not an explicit lift of those lines. Proposed handling, pending owner OK: widen to read-only plus `check-lane` and `save-brief` candidates after reading their tool descriptions; keep `start-challenge`, `claim-challenge`, `debrief`, `rook` as `needs-human` runs (HQ prepares, a person confirms in a session). I have not inspected those tools' schemas, so which are safe is unverified.
- **Read path for agents (3b)** needs the `allowed_tools` check widened beyond the three card tools, plus an edge-function read tool for `challenges`, lessons and notes. Lesson text is untrusted data, so the tool should return it labeled and should not be granted to workers that also hold write tokens.
- **Solve notes (4):** structured rows plus a markdown `summary`. Source is the repo, so the ingest should read `debrief.md`/`log.md` (parse the snag table: #, snag, fix, who) instead of retyping. `debrief.md` format is only confirmed for S01E01; S01E02 has no debrief yet (`challenges/S01E02` holds `log.md` and `overnight.md` only). Notes must pass `assertNoSecrets` before upload.

## Next step
Owner confirms the one open item (the exact command list for decision 2). Then `/10x-plan` can cover: (1) solve notes + Task screen, (2) schedules + runs, (3) agent read tool. Nothing is built.

## Follow-up 2026-10-27 (2): command list decided
Owner: `start-challenge` may run fully automatically, so it can be scheduled. This lifts the "start from HQ is out of scope" line in `2026-10-27-hq-runs.md` for `start-challenge` only. Not lifted: `claim-challenge`, `debrief`, `rook` stay `needs-human`; the owner did not say otherwise. Risks to carry into the plan: `start-challenge` is the step that opens a course session, so a scheduled run must be idempotent (no second start of the same challenge), must stop on 403/429, and the worker needs the course login in a headless run, which is still unverified.
