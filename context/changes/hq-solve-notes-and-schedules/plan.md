# HQ Solve Notes, Agent Read Tools and Scheduled Runs Implementation Plan

## Overview

Three additions to the HQ app (`~/repos/mega-hq`, live checkout at `0fe2b08`), plus worker tooling that runs on the UGREEN:

1. Each solved challenge shows how it was solved (summary, snag/fix rows, debrief link) and the episode's approved learning cards on the Task screen.
2. Agents can read challenge and lesson data through new read-only MCP tools.
3. The owner (phone) and Grok Bot can schedule course commands, including a fully automatic `start-challenge`, and a pull worker on the UGREEN runs them and reports back.

Decisions come from the owner's answers recorded in `research.md` and from this planning session (see `plan-brief.md`). This plan supersedes phases 1-5 of `context/changes/2026-10-27-hq-runs.md`; that file's Slack phase 6 stays a separate change.

## Current State Analysis

- `challenges` holds `code, title, description, steps, status, steps_done, updated_at` only (`supabase/migrations/20261027100000_plan2.sql:11-19`). The Task screen shows no solve story (`web/src/screens/Task.tsx:17-45`).
- Cards carry episode-tagged `learning` entries and the Episode screen lists approved ones (`web/src/screens/Episode.tsx:70-71`); the Task screen does not.
- Ingest is manual (`node ingest/ingest.mjs <file>`), maps `solved` as a boolean, and `assertNoSecrets` does not look inside nested objects (`ingest/ingest.mjs:7-20`). A sibling CLI, `ingest/examples.mjs`, shows how to add a second ingest with orphan deletion.
- The MCP function `/functions/v1/mcp` has `propose_card`, `propose_cards`, `list_cards`. The tool vocabulary is pinned in the `proposers.allowed_tools` CHECK (`supabase/migrations/20261026100000_schema.sql:19-20`), `contract.json`, `supabase/functions/mcp/contract_test.ts:10-12`, `web/src/screens/Settings.tsx:15-16,100,179`, `scripts/smoke.sh:25-26,44` and `supabase/tests/database/01_schema.test.sql:29`.
- There is no runs, schedule or worker concept. `service_role` can read everything but write only narrow cards/events columns (`20261026100200_hardening.sql:5-8`, `20261027100000_plan2.sql` section 3). New tables must explicitly revoke `service_role` writes because default privileges do not cover that role.
- The web `Db` interface exposes only `select, update, eq, gte, order, limit, maybeSingle, rpc` (`web/src/lib/db.ts`); there is no insert/delete. `useQuery` has no polling or realtime (`web/src/lib/useQuery.ts`).
- The tab bar has 5 tabs in a max-430px layout (`web/src/ui/TabBar.tsx:3,12-18`).
- Unattended course runs have failed on the course login before: the 2026-10-27 overnight run stopped because the `mega-challenge` MCP needed re-authorization (`challenges/S01E02/overnight.md`).
- `start-challenge` returns the same Challenge on a repeat call; some challenges deal a new round and say so in the reply (tool description, `mcp__mega-challenge__start-challenge`).
- Grok Bot reaches UGREEN through `grok-gateway` and forwards to mother-console for code and review tasks only; ADR 0012 is Proposed (`~/Dev/homelab-2/adr/0012-grok-bot-dispatcher.md`). It has no path to HQ today.

## Desired End State

- `/task/?code=S01E01` shows HOW IT WAS SOLVED (summary, three snag/fix rows, debrief link) and LESSONS (approved learning cards). Challenges without notes show no empty sections.
- An agent token with `get_challenge`, `list_challenges` or `get_lesson` can read that data; tokens without them cannot. Read tools are never ticked by default in Settings.
- `/runs/` (reached from Settings) lists schedules and runs, has a Run now button and a global pause switch, and refreshes by polling. A weekday-plus-time or one-shot schedule for `start-challenge`, `mega-start`, `list-challenges`, `resume-challenge` or `sync-status` can be created on the phone. Grok Bot can create or edit such schedules but they start disabled.
- A worker on the UGREEN (cron, every 10 minutes) turns due schedules into runs, claims one, runs it through headless `claude -p` with a per-kind tool allow-list, and records the result. Missed recurring slots are skipped, failures are not retried, 403/429 stops the course calls for that tick, and a `start-challenge` runs at most once per challenge per Warsaw day.
- Verification: the test suites listed under each phase pass, and the manual checks on the phone and on the UGREEN pass.

### Key Discoveries:

- Snags must be a flat table: a jsonb column would skip `assertNoSecrets` (`ingest/ingest.mjs:7-20`).
- The `PATCH` path (not upsert) is right for filling notes on an existing challenge: upsert needs the insert columns and the owner JWT already has `update` on `challenges` (`20261027100000_plan2.sql:17-22`).
- Owner writes through RPC avoid extending `Db`, `FakeQuery` and `hq.types.ts` with insert/delete (pattern: `web/src/lib/data/proposers.ts:10-17`, SQL in `20261026100200_hardening.sql:20-48`).
- A new function is closed by default (`alter default privileges ... revoke execute`, `20261027100000_plan2.sql` section 4); worker functions need an explicit grant to `service_role` only.
- Edge functions authenticate only by bearer token with `verify_jwt = false` (`supabase/config.toml:418-419`); a second function needs its own config entry.
- The contract test pins tool names and the full `TOOLS` JSON byte for byte (`contract_test.ts:6-12`), so every new tool changes `contract.json` and bumps `contract_version` (now 0.1.2).

## What We're NOT Doing

- Scheduling or dispatching `claim-challenge`, `debrief`, `rook` or `artifact`. HQ may record a run of those kinds only as `needs-human`; nothing executes them.
- Auto-retry, catch-up of missed recurring slots, or cron-expression schedules.
- Realtime updates for runs (polling only; e2e runs with `PUBLIC_REALTIME=0`).
- A sixth tab, Slack notifications and control (stays in `2026-10-27-hq-runs.md` phase 6), HQ calling the worker directly, or any inbound port.
- Granting the worker or Grok the owner login, `service_role` key access, or write rights on `challenges` beyond one narrow forward-only function.
- Storing the worker/Grok tokens or any secret in either repo.

## Implementation Approach

Ship in the owner's order: notes and read tools first (no worker, immediate value), then a spike that proves or disproves an unattended course login, then runs/schedules data and UI, then the worker, then the Grok route. The worker is a pull design: HQ holds the queue and schedules, the worker connects out. The database owns schedule math (`next_slot`), so web and worker never duplicate it. All owner writes on new tables go through `security definer` RPCs that check `is_owner()`, log to `events`, and are granted to `authenticated` only. Worker and Grok writes go through a separate edge function whose tokens carry a role (`worker` or `grok`) and call functions granted to `service_role` only. Each phase follows the repo's own test layers: pgTAP, Deno, `node --test`, vitest, Playwright.

## Critical Implementation Details

- **State sequencing** — deploy each migration before the app or function that uses it (the repo's documented order, `runbooks/hq-deploy.md`); a new web build against an old database would 404 on the new tables.
- **Debug & observability** — every owner, worker and Grok action writes an `events` row (`actor`, `action`, `ref`) so the Sessions screen already shows it; run `summary`/`error` text must pass `findSecrets` (`shared/redact.mjs`) before it is stored.

---

## Phase 1: Solve notes and Task screen

### Overview

Store the solve story per challenge, ingest it from the debrief files already kept in `mega-dev`, and show it with the episode's learning cards.

### Changes Required:

#### 1. Schema

**File**: `supabase/migrations/20261029100000_solve_notes.sql` (new, in `~/repos/mega-hq`)

**Intent**: Add the solve summary to `challenges` and a flat table for snag rows.

**Contract**: `alter table challenges add solved_at timestamptz, add debrief_url text check (debrief_url ~ '^https://'), add summary text check (length(summary) <= 4000)`. New `challenge_snags(challenge_code text references challenges(code) on delete cascade, n int check (n >= 1), snag text, fix text, who text, primary key (challenge_code, n))` with length checks on the text columns. RLS enabled, `revoke all ... from anon, authenticated`, owner select/insert/update/delete policies on `is_owner()`, grant to `authenticated`, `revoke insert, update, delete, truncate ... from service_role` (template: `20261028100000_lesson_examples.sql`).

#### 2. Debrief ingest

**File**: `ingest/solve-notes.mjs`, `ingest/solve-notes-map.mjs`, tests `ingest/solve-notes*.test.mjs` (new)

**Intent**: Read `challenges/<code>/debrief.md` from `mega-dev`, parse it, and write the notes with the owner sign-in already used by `ingest.mjs`, reusing `signIn`, `failureMessage` and `assertNoSecrets`.

**Contract**: `node ingest/solve-notes.mjs <path-to-debrief.md> --code S01E01 [--solved-at YYYY-MM-DD] [--debrief-url https://...] [--dry-run]`. The parser returns `{summary, snags[{n, snag, fix, who}]}` from the markdown table (`| # | Snag | Fix | Who |`); everything outside the table, trimmed, is the summary. Filling `challenges` uses `PATCH challenges?code=eq.<code>` and fails with a clear error when no row matched (the challenge must have been ingested first). Snags upsert on `challenge_code,n`; snags no longer in the file are deleted (pattern: `ingest/examples.mjs:132-182`). `assertNoSecrets` runs over the summary and every flat snag row before any request. Dry-run prints `{dryRun:true, summary:<chars>, snags:<n>}`.

#### 3. Web data and Task screen

**File**: `web/src/lib/schemas.ts`, `web/src/lib/data/challenges.ts`, new `web/src/lib/data/snags.ts`, `web/src/screens/Task.tsx`, `web/src/test/fixtures.ts`, `web/dev/stub-api.mjs`, tests

**Intent**: Read the new columns and snags, fetch the episode's approved learning cards, and render two optional sections.

**Contract**: `Challenge` gains nullable `solved_at`, `debrief_url`, `summary`; new `Snag` schema; `COLUMNS` in `challenges.ts` extended explicitly. The Task loader combines challenge, snags and `listApproved` filtered to `learning` cards of `challenge.code` (as `Episode.tsx` does) under one zod schema and a key that includes the code. `TaskView` gets HOW IT WAS SOLVED (summary, snag list, debrief link opened with `rel="noopener noreferrer"`) and LESSONS (learning cards via `Bullet`) using the existing `SectionLabel` / `h-px bg-line` section pattern (`Task.tsx:38-42`); each section is omitted when empty. Every other consumer of `TaskView` or `Challenge` is found with a grep and updated. `stub-api.mjs` `initialState()` gets `challenge_snags` and seeded notes for S01E01.

#### 4. Course-side rule and docs

**File**: `CLAUDE.md`, `docs/tools.md`, `docs/CHANGELOG.md`, `challenges/S01E02/log.md` (in `mega-dev`)

**Intent**: Make recording the solve in HQ part of finishing a challenge, as the earlier plan proposed, and keep `docs/` in the same commit as the code (project rule).

**Contract**: One line under "Course work" in `CLAUDE.md`: after the debrief, run `solve-notes` against `challenges/<code>/debrief.md`. `docs/tools.md` documents the command and its flags.

### Success Criteria:

#### Automated Verification:

- Migration applies and the new pgTAP file (`supabase/tests/database/07_solve_notes.test.sql`: anon denied, stranger sees nothing, owner CRUD, check constraints, `service_role` write denied) passes: `make test`
- Ingest tests pass, including table parsing, summary extraction, secret refusal and dry-run output: `make test-node`
- Web lint, typecheck and unit tests pass: `cd web && npm run lint && npm run typecheck && npm test`
- Playwright passes, including the axe check of `/task/?code=S01E01` in light and dark: `cd web && npm run e2e`
- The rule and tool docs exist in `mega-dev`: `grep -n "solve-notes" CLAUDE.md docs/tools.md`

#### Manual Verification:

- Dry-run on `challenges/S01E01/debrief.md` reports 3 snags and no secret hits.
- After the real run, the Task screen for S01E01 on the phone shows the summary, the 3 snag rows, the debrief link and any approved learning cards; S01E02 (no notes) shows no empty sections.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Agent read tools in /mcp

### Overview

Let a token that is explicitly granted them read challenges, snags and lessons over MCP.

### Changes Required:

#### 1. Widen the tool vocabulary

**File**: `supabase/migrations/20261029110000_read_tools.sql` (new)

**Intent**: Allow the three new names in the `allowed_tools` CHECK.

**Contract**: Drop and re-add the check on `proposers.allowed_tools` with `array['propose_card','propose_cards','list_cards','get_challenge','list_challenges','get_lesson']`. The constraint's real name is read from the database (`\d proposers`) before the migration is written; it is not assumed.

#### 2. Tools

**File**: `supabase/functions/mcp/tools.ts`, `db.ts`, `supabase_db.ts`, `contract.json`, `contract_test.ts`, `tools_test.ts`, `rpc_test.ts`

**Intent**: Add the read tools with the existing injected-`Db` pattern and keep the contract pinned.

**Contract**: `get_challenge {code}` returns the challenge, its snags and summary; `list_challenges {limit 1-50}` returns code, title, status, steps_done; `get_lesson {episode}` returns lesson metadata and `body` capped at a fixed size with a `truncated` flag. Every result carries `untrusted: true` and a `source` label so a client treats lesson text and notes as data. Reads use explicit column lists and `service_role` SELECT (no new write grants). Like `list_cards`, reads are not subject to `daily_cap`. `contract.json` gets the tools and `contract_version` becomes `0.2.0`; the pinned name list in `contract_test.ts` is updated.

#### 3. Settings picker and fixtures

**File**: `web/src/screens/Settings.tsx`, `Settings.test.tsx`, `web/src/lib/data/data.test.ts`, `web/src/test/fixtures.ts`, `web/dev/stub-api.mjs` and its test, `scripts/smoke.sh`, `supabase/tests/database/01_schema.test.sql`

**Intent**: Offer the new tools in the picker without enabling them by default.

**Contract**: `ALL_TOOLS` and `TOOL_LABEL` gain the three tools; the default-checked state (`Settings.tsx:100`) stays the card tools only. The pgTAP test that rejects an unknown tool keeps `delete_everything` as its example and adds acceptance of the new names. `smoke.sh` expects the new `tools/list`.

### Success Criteria:

#### Automated Verification:

- Deno tests pass, including the contract test and tool tests for the three read tools: `make test`
- Node and web suites pass: `make test-node` and `cd web && npm run lint && npm run typecheck && npm test`

#### Manual Verification:

- `make smoke` passes against the local stack.
- A token created in Settings with only `get_challenge` can fetch S01E01 and is refused `propose_card`; the picker shows the read tools unticked by default.
- A `get_lesson` result is labeled untrusted and shows `truncated` for a long lesson.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 3: Headless login spike (go/no-go)

### Overview

Find out, before building a worker, whether the course login works in an unattended `claude -p` run on the UGREEN and how long it lasts.

### Changes Required:

#### 1. Spike script

**File**: `tools/spike-headless-mega-start` (new, in `mega-dev`)

**Intent**: Run one read-only `mega-start` through headless Claude Code and print a JSON line with the outcome.

**Contract**: The script allows exactly one tool, `mcp__mega-challenge__mega-start` (`--allowedTools`), asks for a JSON-only reply, prints `{ok, at, error}`, and never sends the output anywhere. It stops on any 403 or 429 and does not retry. It does not call `start-challenge`, `claim-challenge`, `debrief` or `rook`. Recordings and lesson text it returns are untrusted data and are not written to the repo.

#### 2. Spike record and decision

**File**: `context/changes/hq-solve-notes-and-schedules/spike-login.md` (new)

**Intent**: Record the three observations and the decision the later phases depend on.

**Contract**: Fields `works_now`, `survives_new_process`, `survives_24h`, `failure_text`, and a `decision: go | no-go`. Rule: `go` only when all three are true. On `no-go`, phase 5 sets every course-command kind to `needs-human` (HQ shows what to run in a session) while schedules, the queue and `sync-status` from ingest still work.

### Success Criteria:

#### Automated Verification:

- The script parses and allows only the one tool: `bash -n tools/spike-headless-mega-start && grep -c "mcp__mega-challenge__mega-start" tools/spike-headless-mega-start`

#### Manual Verification:

- Run on the UGREEN: first call result recorded in `spike-login.md`.
- Re-run from a new process and again after 24 hours; both results recorded.
- The owner reads the result and confirms `go` or `no-go` in `spike-login.md`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 4: Runs and schedules (data and phone UI)

### Overview

Add the data model and the owner screen. Nothing executes yet; Run now and schedules create queued runs that a worker will pick up in phase 5.

### Changes Required:

#### 1. Schema and owner RPCs

**File**: `supabase/migrations/20261029120000_runs_schedules.sql` (new)

**Intent**: Tables for schedules, runs and a pause switch, written only through owner RPCs.

**Contract**:
- `schedules(id, kind, challenge_code null, days smallint[] null, at_time time null, run_at timestamptz null, enabled bool default false, created_by check in ('owner','grok'), next_slot timestamptz null, created_at, updated_at)`. `kind` is checked against `sync-status, mega-start, list-challenges, resume-challenge, start-challenge`. Exactly one of (`days` + `at_time`) or `run_at` is set; `days` are ISO weekdays 1-7; times are Europe/Warsaw. `challenge_code` is required when `kind = 'start-challenge'`.
- `runs(id, kind, schedule_id null, challenge_code null, slot timestamptz null, status check in ('queued','running','needs-human','done','failed','missed'), requested_by check in ('owner-button','schedule','grok'), created_at, started_at, finished_at, summary, error)` with `unique (schedule_id, slot)`. `kind` also allows `claim-challenge`, `debrief`, `rook` so a run of those can be recorded, but only as `needs-human`.
- `hq_settings` single row `{paused bool default false, updated_at}`.
- A SQL function owns schedule math, `schedule_next_slot(schedule, after)`, in Warsaw time; RPCs set `next_slot` with it.
- Owner RPCs (`security definer`, pinned `search_path`, `is_owner()` check, `events` row, execute granted to `authenticated` only): `create_schedule`, `update_schedule`, `set_schedule_enabled`, `delete_schedule`, `run_now(kind, challenge_code)`, `set_paused(bool)`.
- Tables: RLS on, `revoke all from anon, authenticated`, owner `select` policy and grant only (no direct insert/update/delete for `authenticated`), `service_role` write revoked.

#### 2. Web data layer

**File**: `web/src/lib/schemas.ts`, new `web/src/lib/data/runs.ts`, `web/src/lib/data/schedules.ts`, tests

**Intent**: Read tables with explicit columns and call the RPCs; no `Db` interface change is needed.

**Contract**: zod `Run`, `Schedule`, `HqSettings`; helpers `listRuns(db, limit 50)`, `listSchedules`, `getSettings`, and RPC wrappers following `proposers.ts`.

#### 3. Runs screen

**File**: `web/src/pages/runs.astro`, `web/src/screens/pages.tsx`, new `web/src/screens/Runs.tsx` and test, `web/src/screens/Settings.tsx` (link), `web/src/screens/Task.tsx` (link), `web/src/ui/TabBar.tsx` (no new tab; Runs passes `active="settings"`)

**Intent**: One page to see and control runs from the phone.

**Contract**: Sections: PAUSE (a clear on/off switch with offline disable), RUN NOW (kind select; challenge code when `start-challenge`; two-step confirm like `TokenRow`), SCHEDULES (list with enabled toggle, next slot, created-by badge; form for weekday chips + Warsaw time or a one-shot date-time, plain-English validation errors per `Settings.tsx:112-123`), RUNS (status badges, last run, an `overdue` flag when a recurring schedule's `next_slot` passed more than 15 minutes ago with no run row). The screen polls with an interval that calls `reload()` (pattern: `useProposedCount.ts` poll, no realtime) and uses `connected={!stale}` to disable writes offline.

#### 4. Stub server and e2e

**File**: `web/dev/stub-api.mjs` and test, `web/e2e/hq.spec.ts`, `web/src/test/fixtures.ts`

**Intent**: Keep the dev server and browser tests in step with the new tables and RPCs.

**Contract**: `initialState()` gets `schedules`, `runs`, `hq_settings`; hand-coded RPC branches for each new RPC (the stub has no table POST); a create-schedule and Run-now flow test; `/runs/` added to the axe path list.

### Success Criteria:

#### Automated Verification:

- pgTAP (`supabase/tests/database/08_runs_schedules.test.sql`: anon/stranger denied, direct writes denied for `authenticated` and `service_role`, RPCs owner-only, constraints for kinds, one-shot vs recurring, `challenge_code` rule, `next_slot` computed in Warsaw time including a DST date) passes: `make test`
- Web lint, typecheck and unit tests pass: `cd web && npm run lint && npm run typecheck && npm test`
- Stub tests and Playwright pass, including the axe check of `/runs/` in light and dark: `cd web && npm run e2e`

#### Manual Verification:

- On the phone, create a weekday schedule and see its next slot in Warsaw time.
- Run now with the two-step confirm adds a queued run; the pause switch toggles and stays toggled after reload.
- A run added in the database appears on the Runs screen without a manual reload.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 5: Worker function, pull worker, cron and runbook

### Overview

Add the worker's identity and database functions, an edge function for it, and the script that runs on the UGREEN. Behavior depends on the Phase 3 decision.

### Changes Required:

#### 1. Worker tokens and database functions

**File**: `supabase/migrations/20261029130000_worker.sql` (new)

**Intent**: A separate identity for the worker (and later Grok) and the only functions it may call.

**Contract**: `worker_tokens(id, role check in ('worker','grok'), name, token_hash, revoked_at, created_at)`; owner RPCs `create_worker_token(role, name)` (token shown once, hashed with sha256 like `create_proposer`) and `revoke_worker_token(id)`. Functions executable by `service_role` only (execute revoked from `public, anon, authenticated`), each taking the token id and writing an `events` row:
- `worker_tick(token_id)`: for each enabled schedule with a slot due, insert a `queued` run (unique on `schedule_id, slot` makes it safe to repeat); a recurring slot more than 15 minutes late becomes `missed`; a one-shot up to 24 hours late still queues; `next_slot` advances; runs `running` longer than 30 minutes become `failed`.
- `worker_claim(token_id)`: returns nothing when `hq_settings.paused`; otherwise atomically claims one `queued` run (`for update skip locked`) and sets it `running`; a `start-challenge` run for a challenge that already has a non-`missed` start run on the same Warsaw day is set `failed` with a clear reason instead of claimed.
- `worker_record(run_id, status, summary, error)`: allows only `running` to `done | failed | needs-human`.
- `worker_update_challenge(code, status, steps_done)`: only moves forward (`open` to `in_progress` to `solved`, `steps_done` never decreases); touches no other column. Used by `sync-status`.

#### 2. Worker edge function

**File**: `supabase/functions/worker/` (`index.ts`, `auth.ts`, `db.ts`, `supabase_db.ts`, tests), `supabase/config.toml`, `worker-contract.json`

**Intent**: Authenticate the token and route to the functions above; mirror the structure of `functions/mcp` so it is tested with a fake `Db`.

**Contract**: POST routes `/tick`, `/claim`, `/record`, `/challenge`, authenticated by bearer token hashed against `worker_tokens` (revoked tokens get 401); role `worker` only may call these routes. `[functions.worker] verify_jwt = false`. No route returns secrets, and the function never exposes the service key.

#### 3. Pull worker

**File**: `worker/hq-worker.mjs`, `worker/allowlist.json`, tests (in `~/repos/mega-hq`)

**Intent**: One short-lived process per cron run: tick, claim, execute, record.

**Contract**:
- Allow-list file maps kind to allowed MCP tools and a JSON reply shape: `sync-status` and `list-challenges` read `list-challenges`; `mega-start` reads `mega-start`; `resume-challenge` reads `resume-challenge`; `start-challenge` reads `start-challenge` and needs the challenge uuid from `list-challenges`. `claim-challenge`, `debrief`, `rook`, `artifact` are never in the list. Anything not in the list is recorded `needs-human`.
- The model reply is untrusted: parsed as JSON, validated against the kind's shape, run through `findSecrets` (`shared/redact.mjs`) before storing `summary` or `error`.
- `start-challenge` is recorded `done` with a note when the reply says a new round was dealt; a repeat that returns the same Challenge is recorded as such. A 403 or 429 marks the run `needs-human`, skips the remaining course calls in that process, and is never retried.
- `sync-status` writes progress only through `worker_update_challenge`.
- A lock file stops two runs overlapping. If Phase 3 decided `no-go`, every course-command kind is recorded `needs-human` and the run is not executed.
- There is no separate enqueue CLI: enqueueing is the Run now RPC (phase 4) and schedules.
- Secrets (HQ URL, worker token) are read from `~/.config/mega-hq/worker.env` (mode 0600), never from the repo.

#### 4. Settings token section, cron, runbook

**File**: `web/src/screens/Settings.tsx` and test, `runbooks/hq-worker.md`, `deploy/` cron example

**Intent**: Create and revoke worker tokens from the phone, document the cron lines and the rollback.

**Contract**: A "Worker tokens" block beside agent tokens, same show-once pattern. Runbook has a `## Rollback` section (required by `scripts/validate.sh`): set the pause switch, comment out the cron line, revoke the token. Cron: `*/10 * * * * <worker command>` on the UGREEN.

### Success Criteria:

#### Automated Verification:

- pgTAP (`supabase/tests/database/09_worker.test.sql`: execute only for `service_role`, tick idempotence, missed and one-shot rules, pause blocks claim, two sequential claims never return the same run, one start per challenge per Warsaw day, record transitions, forward-only challenge update) passes: `make test`
- Deno tests for the worker function pass (role routing, revoked token, no route for other roles): `make test`
- Worker script tests with a fake `claude` and fake HQ pass (allow-list, lock file, 403/429 stop, secret refusal, JSON validation, new-round note, `no-go` mode): `make test-node`
- Web lint, typecheck and unit tests pass, including the worker-token section: `cd web && npm run lint && npm run typecheck && npm test`
- Docs gate passes: `make validate`

#### Manual Verification:

- `hq-worker --once --dry-run` on the UGREEN claims nothing and prints what it would do.
- A one-shot `list-challenges` schedule runs end to end and shows `done` on the Runs screen.
- The pause switch stops the next tick from claiming; the rollback steps in the runbook were rehearsed once.
- After a Phase 3 `go`, the owner enables a `start-challenge` schedule for S01E02 and sees one run.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 6: Grok route

### Overview

Let Grok Bot create and edit schedules and enqueue runs within strict limits.

### Changes Required:

#### 1. Grok role in the worker function

**File**: `supabase/migrations/20261029140000_grok_role.sql` (new), `supabase/functions/worker/` routes and tests

**Intent**: A `grok` token can only propose schedule changes and enqueue allow-listed runs.

**Contract**: Routes `/enqueue` and `/schedule` accept role `grok` only; `/tick`, `/claim`, `/record`, `/challenge` refuse it. `grok_upsert_schedule` forces `enabled = false` and `created_by = 'grok'`, refuses `enabled = true` on update, and accepts only the five schedulable kinds. `grok_enqueue` inserts a `queued` run with `requested_by = 'grok'` for the same kinds and respects the pause switch and daily start limit through the same claim path. Every call writes an `events` row with actor `grok`.

#### 2. Gateway tools and decision record

**File**: `apps/grok-gateway/` tools and tests, new ADR and runbook in a `homelab-2` worktree (not the shared Mother Console checkout)

**Intent**: Give Grok two tools that call the worker function on loopback; document the decision and rollback per homelab-2 rules.

**Contract**: Tools `hq_enqueue_run` and `hq_upsert_schedule`; their descriptions say schedules start disabled and need the owner to enable them. The Grok token is read from the gateway's env file (mode 0600), not the repo. No new public port: the gateway reaches HQ on `127.0.0.1`. The ADR records that this extends ADR 0012 and that Grok can never run a course command itself. This phase starts only after the owner approves touching `homelab-2` infrastructure (the earlier tooling-split plan required that approval).

### Success Criteria:

#### Automated Verification:

- pgTAP and Deno tests pass: grok cannot enable a schedule, cannot call tick/claim/record/challenge, cannot use `claim-challenge`, `debrief` or `rook` kinds: `make test`
- The grok-gateway test suite passes using the test command documented in its README (confirm the command in `homelab-2` before starting).

#### Manual Verification:

- The owner has approved changes in `homelab-2` before work starts.
- A schedule created from Grok Bot appears on the Runs screen as disabled and created by `grok`; enabling it on the phone makes it run at its next slot.
- Revoking the Grok token in Settings makes the next Grok call fail.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Testing Strategy

### Unit Tests:

- Debrief table parsing (edge cases: missing table, extra columns, `|` inside a cell, a secret in a cell), snag orphan deletion.
- `schedule_next_slot` across a DST change, weekday sets, one-shot in the past.
- Worker: allow-list lookup, JSON validation, redaction, lock file, 403/429 handling.
- Web: new schemas, data helpers (`calls[0]` assertions in the `fakeDb` style), Task sections empty and full, Runs views offline.

### Integration Tests:

- pgTAP for every new table and function with the repo's anon / stranger / owner / `service_role` pattern.
- Deno tests for the new MCP tools and the worker function with a fake `Db`.
- Playwright flows with the stub server for Task notes, schedule creation, Run now and pause.

### Manual Testing Steps:

1. Run the S01E01 ingest on the phone and read the Task page.
2. Create a read-only token for an agent and fetch a challenge.
3. Run the Phase 3 spike on the UGREEN and record the result.
4. Schedule a one-shot `list-challenges` and watch it complete.
5. Pause, confirm nothing is claimed, then resume.

## Performance Considerations

Load is one owner and a few agents. Runs are shown 50 at a time and the screen polls every 15 seconds while visible. The cron worker runs every 10 minutes. No indexes beyond the primary keys and `unique (schedule_id, slot)` are needed at this scale.

## Migration Notes

All migrations are additive (new columns, new tables, one widened CHECK) and sort after `20261028100000`. Deploy each migration before the build or function that uses it. Existing challenges get null notes. The earlier plan's cron-only schedule is replaced by schedules stored in HQ; no cron line for schedules exists yet, so nothing is migrated.

## References

- Related research: `context/changes/hq-solve-notes-and-schedules/research.md`
- Superseded plan (phases 1-5): `context/changes/2026-10-27-hq-runs.md`
- Tooling split guardrails: `context/changes/2026-10-27-tooling-split.md`
- Grok dispatcher: `~/Dev/homelab-2/adr/0012-grok-bot-dispatcher.md`
- Table template: `supabase/migrations/20261028100000_lesson_examples.sql`
- Owner RPC pattern: `supabase/migrations/20261026100200_hardening.sql:20-48`, `web/src/lib/data/proposers.ts:10-17`
- MCP tool pattern: `supabase/functions/mcp/tools.ts:22-114`, `supabase/functions/mcp/contract_test.ts:6-12`
- Screen patterns: `web/src/screens/Settings.tsx:98-212`, `web/src/screens/Approve.tsx:196-225`, `web/src/lib/useProposedCount.ts`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Solve notes and Task screen

#### Automated

- [x] 1.1 Migration applies and the new pgTAP file (`supabase/tests/database/07_solve_notes.test.sql`: anon denied, stranger sees nothing, owner CRUD, check constraints, `service_role` write denied) passes: `make test`
- [x] 1.2 Ingest tests pass, including table parsing, summary extraction, secret refusal and dry-run output: `make test-node`
- [x] 1.3 Web lint, typecheck and unit tests pass: `cd web && npm run lint && npm run typecheck && npm test`
- [x] 1.4 Playwright passes, including the axe check of `/task/?code=S01E01` in light and dark: `cd web && npm run e2e`
- [x] 1.5 The rule and tool docs exist in `mega-dev`: `grep -n "solve-notes" CLAUDE.md docs/tools.md`

#### Manual

- [x] 1.6 Dry-run on `challenges/S01E01/debrief.md` reports 3 snags and no secret hits.
- [x] 1.7 After the real run, the Task screen for S01E01 on the phone shows the summary, the 3 snag rows, the debrief link and any approved learning cards; S01E02 (no notes) shows no empty sections.

### Phase 2: Agent read tools in /mcp

#### Automated

- [ ] 2.1 Deno tests pass, including the contract test and tool tests for the three read tools: `make test`
- [ ] 2.2 Node and web suites pass: `make test-node` and `cd web && npm run lint && npm run typecheck && npm test`

#### Manual

- [ ] 2.3 `make smoke` passes against the local stack.
- [ ] 2.4 A token created in Settings with only `get_challenge` can fetch S01E01 and is refused `propose_card`; the picker shows the read tools unticked by default.
- [ ] 2.5 A `get_lesson` result is labeled untrusted and shows `truncated` for a long lesson.

### Phase 3: Headless login spike (go/no-go)

#### Automated

- [ ] 3.1 The script parses and allows only the one tool: `bash -n tools/spike-headless-mega-start && grep -c "mcp__mega-challenge__mega-start" tools/spike-headless-mega-start`

#### Manual

- [ ] 3.2 Run on the UGREEN: first call result recorded in `spike-login.md`.
- [ ] 3.3 Re-run from a new process and again after 24 hours; both results recorded.
- [ ] 3.4 The owner reads the result and confirms `go` or `no-go` in `spike-login.md`.

### Phase 4: Runs and schedules (data and phone UI)

#### Automated

- [ ] 4.1 pgTAP (`supabase/tests/database/08_runs_schedules.test.sql`: anon/stranger denied, direct writes denied for `authenticated` and `service_role`, RPCs owner-only, constraints for kinds, one-shot vs recurring, `challenge_code` rule, `next_slot` computed in Warsaw time including a DST date) passes: `make test`
- [ ] 4.2 Web lint, typecheck and unit tests pass: `cd web && npm run lint && npm run typecheck && npm test`
- [ ] 4.3 Stub tests and Playwright pass, including the axe check of `/runs/` in light and dark: `cd web && npm run e2e`

#### Manual

- [ ] 4.4 On the phone, create a weekday schedule and see its next slot in Warsaw time.
- [ ] 4.5 Run now with the two-step confirm adds a queued run; the pause switch toggles and stays toggled after reload.
- [ ] 4.6 A run added in the database appears on the Runs screen without a manual reload.

### Phase 5: Worker function, pull worker, cron and runbook

#### Automated

- [ ] 5.1 pgTAP (`supabase/tests/database/09_worker.test.sql`: execute only for `service_role`, tick idempotence, missed and one-shot rules, pause blocks claim, two sequential claims never return the same run, one start per challenge per Warsaw day, record transitions, forward-only challenge update) passes: `make test`
- [ ] 5.2 Deno tests for the worker function pass (role routing, revoked token, no route for other roles): `make test`
- [ ] 5.3 Worker script tests with a fake `claude` and fake HQ pass (allow-list, lock file, 403/429 stop, secret refusal, JSON validation, new-round note, `no-go` mode): `make test-node`
- [ ] 5.4 Web lint, typecheck and unit tests pass, including the worker-token section: `cd web && npm run lint && npm run typecheck && npm test`
- [ ] 5.5 Docs gate passes: `make validate`

#### Manual

- [ ] 5.6 `hq-worker --once --dry-run` on the UGREEN claims nothing and prints what it would do.
- [ ] 5.7 A one-shot `list-challenges` schedule runs end to end and shows `done` on the Runs screen.
- [ ] 5.8 The pause switch stops the next tick from claiming; the rollback steps in the runbook were rehearsed once.
- [ ] 5.9 After a Phase 3 `go`, the owner enables a `start-challenge` schedule for S01E02 and sees one run.

### Phase 6: Grok route

#### Automated

- [ ] 6.1 pgTAP and Deno tests pass: grok cannot enable a schedule, cannot call tick/claim/record/challenge, cannot use `claim-challenge`, `debrief` or `rook` kinds: `make test`
- [ ] 6.2 The grok-gateway test suite passes using the test command documented in its README (confirm the command in `homelab-2` before starting).

#### Manual

- [ ] 6.3 The owner has approved changes in `homelab-2` before work starts.
- [ ] 6.4 A schedule created from Grok Bot appears on the Runs screen as disabled and created by `grok`; enabling it on the phone makes it run at its next slot.
- [ ] 6.5 Revoking the Grok token in Settings makes the next Grok call fail.
