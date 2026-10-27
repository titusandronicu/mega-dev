# Evidence: history (mega-hq)
Window: whole history, 2026-10-26 13:47 .. 2026-10-27 13:17 (+01:00); 100 non-merge commits counted, 0 excluded; head a0f0bfd. One shared agent identity (Mother Console, all 100 carry the Claude trailer): no people evidence, activity only. No R entries in git-log.txt: no path history to fold. 98 commits fall on day 1, 2 on day 2, so the contract's day buckets are degenerate; I use work phases (clock-time clusters) instead. Everything below is a short-run observation of one ~8h build burst plus a 2-commit follow-up.
Counting: changes per file, commits once per capability, lockfiles and 3 web/public PNG icons dropped (5 file-changes), co-change drops commits over 5 caps (none hit).

## Activity per capability (evidence)
Total mapped changes 414; unmapped 4 (1%: .dockerignore x2, package.json, .gitignore); agent-authored 100%.
| capability | changes | share | commits |
|---|---|---|---|
| shared-foundations | 128 | 31% | 36 |
| owner-web-app | 104 | 25% | 33 |
| platform-deploy | 45 | 11% | 18 |
| agent-intake-mcp | 44 | 11% | 13 |
| nightly-export | 21 | 5% | 9 |
| course-ingest | 19 | 5% | 7 |
| docs-planning | 19 | 5% | 19 |
| lesson-examples | 18 | 4% | 10 |
| security-redaction | 10 | 2% | 5 |
| solve-notes | 6 | 1% | 1 |
| runs-schedules | 0 | 0% | 0 |
runs-schedules has no commits at HEAD: its migration 20261029120000_runs_schedules.sql, test 08, web runs.ts/schedules.ts are staged (git status, other session), not committed. docs-planning is prose: not a hot area (rule 8).

## Top files in top capabilities (evidence, changes)
- shared-foundations: web/src/lib/schemas.ts 5, web/src/lib/data/data.test.ts 4, web/README.md 4, web/src/lib/useProposedCount.ts 4, web/astro.config.mjs 4
- owner-web-app: web/e2e/hq.spec.ts 6, screens/Approve.tsx 6, Settings.tsx 5, Episode.tsx 5, Settings.test.tsx 4
- platform-deploy: runbooks/hq-deploy.md 4, runbooks/hq-web-deploy.md 4, deploy/web/smoke.sh 4, Makefile 4, scripts/validate.sh 4
- agent-intake-mcp: contract.json 4, mcp/tools.ts 4, tools_test.ts 4, rules.ts 4, rules_test.ts 4
- Flat distribution: no file above 6 changes in 100 commits.

## Trend (phases; counts = commits touching capability)
| capability | P1 backend 13:47-14:50 | P2 ingest/export/web 15:14-17:29 | P2C deploy 17:53-18:16 | P3a examples 20:45-21:25 | day 2 10-27 |
|---|---|---|---|---|---|
| agent-intake-mcp | 11 | 0 | 0 | 1 | 1 |
| security-redaction | 4 | 0 | 0 | 1 | 0 |
| course-ingest | 4 | 0 | 0 | 2 | 1 |
| nightly-export | 7 | 1 | 0 | 1 | 0 |
| shared-foundations | 0 | 30 | 2 | 3 | 1 |
| owner-web-app | 2 | 24 | 1 | 4 | 2 |
| platform-deploy | 7 | 2 | 6 | 2 | 1 |
| lesson-examples | 0 | 0 | 0 | 10 | 0 |
| solve-notes | 0 | 0 | 0 | 0 | 1 |
(commits per phase: 36, 40, 7, 15, 2; docs-planning 11/4/2/2/0.)
Labels (inference, campaign-driven, not trends): agent-intake-mcp, security-redaction = burst then fading (built in P1, 1 touch each since); web + shared-foundations = one burst (P2) then constant low; platform-deploy = seasonal-by-campaign (P1 scaffold, P2C deploy); lesson-examples = one campaign (Plan 3a); solve-notes = new on day 2. Campaigns named by subjects and Plan docs (Plan 1, 2A/2B/2C, 3a, "hq-solve-notes-and-schedules" p1/p2). Day 2 shows work moving to solve-notes, read tools in MCP and runs (staged).

## Fix pressure
Heuristic: subject matches fix|bug|hotfix|revert|regression|broken|incident; per capability, per commit touching it. 17 matching commits of 100; 0 reverts anywhere; 1 cross-cutting (>3 caps) commit, a69522e (solve notes + Task screen), not a fix.
| capability | fix commits | of | share |
|---|---|---|---|
| shared-foundations | 12 | 36 | 33% |
| owner-web-app | 10 | 33 | 30% |
| platform-deploy | 6 | 18 | 33% |
| lesson-examples | 3 | 10 | 30% |
| nightly-export | 3 | 9 | 33% |
| security-redaction | 2 | 5 | 40% |
| course-ingest | 2 | 7 | 29% |
| agent-intake-mcp | 2 | 13 | 15% |
| docs-planning | 2 | 19 | 11% |
Read of subjects (rules 5, 12): nearly all are same-day review-hardening of a just-written feature (e.g. "fix(deploy): smoke hardening", "strip invisible characters", "service worker timeout", "harden Settings token flows"), plus 2 test-expectation fixes (Warsaw summer time, Revoke assertion). Deploy/web fixes are iteration (mechanical). Spillover: shared-foundations and owner-web-app fix counts overlap (7 shared commits; a web fix touches both). No bug reports or incident wording found. Fix ratio is therefore NOT a defect signal here. Lower in agent-intake-mcp (2: normalizeBody mirroring Postgres semantics, auth-inside-try/argument validation) are the only ones touching trust boundaries.

## Co-change (evidence; commits touching 2-5 capabilities)
| pair | commits | confidence (÷ less active) |
|---|---|---|
| owner-web-app + shared-foundations | 21 | 0.64 |
| docs-planning + platform-deploy | 6 | 0.33 |
| owner-web-app + platform-deploy | 3 | 0.17 |
| agent-intake-mcp + security-redaction | 2 | 0.40 |
| nightly-export + security-redaction | 2 | 0.40 |
| course-ingest + lesson-examples | 2 | 0.29 |
Only web<->foundations is substantial; it is one app split by directory (screens vs ui/lib) so it is a corridor, not a cross-capability contract. Others have support 2-3: too thin to call. security-redaction pairs (secret check in mcp and export): shared helper reused, support 2.

## Hub files and freshness
Partners counted at >=2 commits gave at most 1 partner per file, so no real hub exists. Files co-changing with the most distinct capabilities (any support): runbooks/hq-export.md (6 caps, 3 commits), contract.json and mcp/tools.ts(5, 2), web/src/lib/schemas.ts (5, 4 commits), README.md (5, 5), Settings.tsx (5, 3), runbooks/hq-deploy.md (4, 4). These are runbooks/README (prose, rule 8), the MCP tool contract + its implementation (lockstep, contract_test.ts guards it, rule 3), and the zod row schemas (config-as-code, fan-in by design, rule 2). Freshness: git cat-file -e HEAD:<path> succeeded for all 12 named files (schemas.ts, hq.spec.ts, Approve.tsx, Settings.tsx, contract.json, tools.ts, hq-deploy.md, Makefile, web/README.md, validate.sh, smoke.sh, export.mjs); none deleted or moved.

## Mechanical signals (demoted)
- shared-foundations/owner-web-app top rank by changes: initial build of the app in P2 (rule 4, new subsystem is busy because it is being built); one app split by directory.
- 17 fix commits: same-day hardening of new code and CI/deploy/UI iteration (rule 5).
- Single identity carries 100%: team-size baseline, no ownership inference (rule 6/7).
- docs-planning: 19 commits, discussion not activity (rule 8).
- Hubs: runbooks/README/contract/schemas as above (rules 2, 3, 8).
- No big revert/migration exists, so rule 12 spillover: only a69522e (4 caps) is broad.

## Unknowns
- Whether any capability is genuinely unstable: history is ~8h of build plus 2 follow-ups; no post-release fixes exist to observe.
- runs-schedules: only staged work, invisible to history; real co-change with owner-web-app, solve-notes, migrations unknown until committed.
- Pairs that should co-change but are not provable here: contract.json vs web Settings (token/tool list), web schemas.ts vs SQL migrations (hand-kept zod twin of DB rows; schemas.ts changed in 5 commits, migrations separate), mcp rules.ts vs shared/redact secret patterns (two secret-detection implementations?), web/dev/stub-api.mjs vs real Supabase API (stub twin). Unknown: any drift guard beyond tests.
- Who the humans are: not derivable (shared agent identity).
- External consumers of /mcp (agent tokens) live outside the repo: unknown (external).

## Commands run
- python3 scan script (scratchpad /tmp/claude-1000/s/h.py) over .work/git-log.txt and capabilities.tsv: attribution, per-capability changes/commits, phases, fix/revert regex, pair and hub counts
- git -C repo log --format=%an%n%b -n1 ; grep -c '^R' / '^@' .work/git-log.txt (renames 0, commits 100)
- git cat-file -e HEAD:<path> for 12 files; git ls-files | wc -l (210); git status --short (read-only)
