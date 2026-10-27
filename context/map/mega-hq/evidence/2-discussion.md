# Evidence: discussion
Sources: gh (titusandronicu/mega-hq) + git. Window: whole history, 2026-10-26..27 (100 commits, one shared agent identity). No limits hit. Attribution via .work/capabilities.tsv; 4 commits touch only unattributed files (30 lines, 0 markers; not capability-specific).

## Buzz per capability
Commits = commits touching the capability (a commit counts once per capability); fixes = subjects starting `fix`. PR = merged PR touching it (attributed through `gh pr view` file lists, 3 PRs only). Markers = TODO|FIXME|HACK|XXX at HEAD, per 1000 lines (lockfiles, web/public excluded).
| capability | commits | fix | PRs | closed-unmerged | human review | reverts | open issues | plans/docs | markers |
|---|---|---|---|---|---|---|---|---|---|
| shared-foundations | 36 | 10 | 1 (#2, web/src) | 0 | 0 | 0 | 0 | plan-2b + web-app spec | 0 (0/2896 lines) |
| owner-web-app | 33 | 6 | 2 (#1, #2) | 0 | 0 | 0 | 0 (#7 Runs screen is owner-web/runs) | plan-2b, plan-2c | 0 |
| docs-planning | 19 | 0 | 3 | 0 | 0 | 0 | 0 | 13 `docs` commits | 0 |
| platform-deploy | 18 | 5 | 2 (#1, #3 runbook) | 0 | 0 | 0 | 1 (#8 pre-commit secret check) | plan-2c, 4 runbooks | 2 (1.67/k, one test script) |
| agent-intake-mcp | 13 | 2 | 1 (#3) | 0 | 0 | 0 | 0 | plan-1 | 0 |
| lesson-examples | 10 | 3 | 1 (#2) | 0 | 0 | 0 | 0 | plan-3a, runbook | 0 |
| nightly-export | 9 | 3 | 1 (#3 runbook touch) | 0 | 0 | 0 | 0 | plan-2a, runbook | 0 |
| course-ingest | 7 | 2 | 1 (#2) | 0 | 0 | 0 | 0 | plan-2a | 0 |
| security-redaction | 5 | 2 | 1 (#3) | 0 | 0 | 0 | 0 | ADR only | 0 |
| solve-notes | 1 | 0 | 0 | 0 | 0 | 0 | 1 (#4) | scope `hq-solve-notes-and-schedules` (2 commits) | 0 |
| runs-schedules | 0 on tsv paths in HEAD | 0 | 0 | 0 | 0 | 0 | 3 (#5, #7, #9 Slack) + #6 worker | issues only | 0 |
Forge totals: 3 PRs, all merged (0 closed-unmerged), 6 issues all open, 0 comments, 0 labels, none bug-labelled. All opened/merged within 1-2 minutes after creation (#1 created 19:30:08 merged 19:31:02; #2 20:29:12/20:30:24; #3 20:29:14/20:30:16).

## Friction
- Reverts: 0 (`git log | grep -iE 'revert|hotfix'` empty). Evidence.
- Fix clusters (evidence, short-run): web fixes in 16:14-16:48 on 26th (about 10 `fix(web)` + 1 test fix within 35 min; the data layer was introduced at 16:16 then fixed 5+ times: Db shape, snapshots, maybeSingle, count). shared-foundations has the highest fix count (10 of 36).
- Ingest invisible-character handling re-fixed three times in about 25 min (20:56, 21:05, 21:21) and 15:35/15:57 earlier: second-attempt pattern in course-ingest/lesson-examples. Inference: input sanitising is the hard part there.
- Deploy: 4 `fix(deploy)` between 17:59-18:18 after the smoke test landed (strict dest, env allowlist, atomic swap). Rule 5: deploy is iteration work, mark mechanical.
- mcp: `fix(mcp)` twice at 14:35/14:50 plus `fix(db)` hardening the same minute; PR #3 (secret screen) added after. Evidence of hardening passes, not breakage.
- Open bugs: none (no bug labels, no bug-titled issues). Unknown whether bugs are tracked elsewhere.

## Planning attention
- Evidence: 5 plans (1, 2a, 2b, 2c, 3a), 2 specs (mega-hq design, plan-2 web-app design), 1 ADR (3 commits), 4 runbooks (deploy, export, ingest-examples, web-deploy). 13 `docs` commits plus 3 `docs(deploy)`. Spec design file: 4 commits; ADR: 3; plan-2b: 2.
- Plan 3a (examples) and 2c (deploy) went through PRs; 2b web app has the most plan+spec prose (2 docs about web).
- Planning for solve-notes/runs-schedules lives in six open issues (#4 Phase 1 solve notes, #5 runs table, #6 hq-worker, #7 Runs screen, #8 secret check, #9 Slack) and two feat commits (p1, p2 "Agent read tools" at HEAD a0f0bfd). No plan doc under docs/ in HEAD for them. Inference: they are planned elsewhere (mega-dev docs), being built now. Highest planned-but-unbuilt volume: runs-schedules (3 of 6 issues).

## Debt markers
2 markers total at HEAD, both in scripts/examples-pipeline-test.sh (platform-deploy, test script; 1.67/k). All other capabilities 0. Docs: 0. Clean on this measure; the repo is 2 days old. Marker search was TODO/FIXME/HACK/XXX only.

## Mechanical signals
- Review: all 4 review/comment actors are bots (`sourcery-ai` reviews on #1,#2,#3, `chatgpt-codex-connector` comment on each, review on #2). 0 human review. Rule 7: not review. Finding: no human review on any PR.
- Merge within about 1 minute of creation, 3 PRs: PRs look like a publish step, not deliberation. Do not use PR size/time as buzz.
- 100 commits by one identity: attribution to people impossible; concentration baseline only (rule 6).
- Docs/plan commits attributed to the capability they name, not ranked (rule 8). 19 docs-planning commits is prose churn.
- Fix ratios in deploy, web UI polish (spacing, safe-area) and ingest invisibles read as iteration (rule 5). Shared cause counted once: the web/shared-foundations fix burst is the same 35-minute window (rule 4).
- Spillover: PR #1 (20 files) and #2 (28 files) span several capabilities; PR counts above credit all touched ones (rule 12).
- Capabilities with 0-1 commits (solve-notes, runs-schedules) are new, not quiet.

## Unknowns
- Whether commits `feat(hq-solve-notes-and-schedules)` touch runs-schedules paths (tsv matches no Runs files at HEAD yet).
- Review bot comment contents not read; severity of findings unknown.
- Production error tracker / runtime incident data: none visible in repo.
- Human review outside GitHub (the owner using AI sessions), and plans stored outside this repo.
- Any trend: window is 2 days; all trend statements are short-run observations.

## Commands run
git log (grep revert|hotfix; subject/scope tally; `--no-merges --name-only` per-capability attribution via a python script applying capabilities.tsv); git ls-files; gh pr list/pr view --json (reviews, comments, files); gh issue list --json; regex count of TODO|FIXME|HACK|XXX over tracked files.
