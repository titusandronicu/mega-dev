# HQ Solve Notes, Agent Read Tools and Scheduled Runs — Plan Brief

> Full plan: `context/changes/hq-solve-notes-and-schedules/plan.md`
> Research: `context/changes/hq-solve-notes-and-schedules/research.md`

## What & Why

HQ should show how each course task was solved (with lessons and insights), let agents read task data over MCP, and let you schedule course commands from the phone or Grok Bot, including a fully automatic `start-challenge`. Today HQ stores only title, steps and status per challenge, has no queue or schedule, and ingest is manual, so S01E02 still shows as open.

## Starting Point

Live HQ is `~/repos/mega-hq` (Astro phone app + Supabase). The solve story sits in `mega-dev` (`challenges/*/debrief.md`, logs, `docs/lessons-learned.md`). MCP has three card tools only. The course login lives on the UGREEN and has already lapsed once during an unattended run.

## Desired End State

The Task screen shows the summary, snag/fix rows, debrief link and learning cards. A granted agent token can read challenges and lessons. A Runs screen under Settings lets you pause everything, run a command now, and manage schedules; a UGREEN worker executes them under a tool allow-list; Grok Bot can propose schedules that start disabled.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Solve notes | Structured snag rows plus markdown summary, ingested from the repo | Debriefs are already traced there; flat rows keep secret screening working | Research |
| Pull | Both: sync into HQ and MCP read tools | Owner asked for both | Research |
| Schedules | Stored in HQ, set on the phone or via Grok | Owner choice; worker accepts only its own allow-list | Research |
| Commands | `start-challenge` fully automatic; `claim-challenge`, `debrief`, `rook` stay needs-human | Owner lifted only start | Research |
| Write path | Separate worker edge function with role tokens | Keeps /mcp read/propose only, smaller blast radius | Plan |
| Grok scope | Edit schedules and enqueue; anything it creates starts disabled | Meets the ask while an injected instruction cannot switch on a start | Plan |
| Runs screen | Sub-screen under Settings, no sixth tab | Avoids squeezing the 5-tab bar and tab tests | Plan |
| Schedule format | Weekdays + Warsaw time, or one-shot | Easy on a phone, covers "start tonight" | Plan |
| Missed / failed | Skip missed recurring slots, no auto-retry | Never stacks runs or hammers the course after a 429 | Plan |
| Login risk | Phase 3 spike gates the worker; no-go means needs-human runs | Fails fast before building on an unproven login | Plan |
| Order | Notes, read tools, spike, runs, worker, Grok | First two need no worker | Plan |
| Containment | Global pause, per-schedule enabled, one start per challenge per day, stop on 403/429 | One tap stops everything; a bug cannot loop starts | Plan |

## Scope

**In scope:** solve notes and Task screen; read tools; login spike; runs, schedules, pause and Runs screen; worker function, pull worker, cron, runbook; Grok role and gateway tools.

**Out of scope:** scheduling `claim-challenge`, `debrief`, `rook`, `artifact`; Slack; realtime; cron expressions; auto-retry or catch-up; a sixth tab; secrets in either repo.

## Architecture / Approach

HQ holds the queue and schedules; the worker on the UGREEN connects out (no new port), ticks due schedules into runs, claims one, runs it through headless `claude -p` with a per-kind tool allow-list, and records the validated, secret-screened result. The database owns schedule math. Owner writes go through `is_owner()` RPCs; worker and Grok writes go through a separate edge function whose functions only `service_role` can execute.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Solve notes | Notes table, debrief ingest, Task sections, repo rule | Debrief format is confirmed for S01E01 only |
| 2. Agent read tools | Three read-only MCP tools, widened vocabulary | Tool list pinned in about ten places; lesson text is untrusted |
| 3. Login spike | Go/no-go on unattended course login | Login may not survive a headless run |
| 4. Runs and schedules | Tables, owner RPCs, Runs screen, pause | Stub server and tests must track the new RPCs |
| 5. Worker | Worker function, `hq-worker`, cron, runbook | Unattended `start-challenge`; atomic claim and limits |
| 6. Grok route | Grok role, gateway tools, ADR | Needs owner OK to touch `homelab-2` |

**Prerequisites:** `~/repos/mega-hq` local Supabase stack for `make test`/`make smoke`; UGREEN session for phases 3 and 5; owner approval for `homelab-2` before phase 6.
**Estimated effort:** about 8-10 sessions across 6 phases (phases 1-2 are small; 4-5 are the bulk).

## Open Risks & Assumptions

- The course login may not survive headless runs; phases 5 and 6 depend on the spike result.
- The real name of the `allowed_tools` CHECK constraint, the exact `service_role` grant on `events`, and the grok-gateway test command were not verified; the implementer checks them first.
- `debrief.md` has a table only for S01E01; the parser must tolerate other shapes.
- Estimates are rough.

## Success Criteria (Summary)

- S01E01's Task page shows how it was solved; S01E02 gets the same after its debrief.
- You can pause, run now and schedule from the phone, and a scheduled `start-challenge` runs once and records the result.
- Read tokens, worker tokens and the Grok token each do only what their role allows.
