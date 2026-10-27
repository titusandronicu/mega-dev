# Evidence: history
Window: whole history, 2026-10-26..2026-10-27 (2 days), head e22652b. Buckets: day. 26 non-merge commits counted, 0 excluded (3 merge commits by "titusandronicu" are outside the log). All 26 share one identity ("Mother Console", Claude Sonnet 5.5 co-author) = one agent identity, so there is no people evidence. Every trend below is a short-run observation. No renames (0 `R` entries); one deleted file in history (context/changes/pending-commit-hook.md).

## Activity per capability
Changes = file touches (145 total); commits = commits touching the capability (a commit counts once per capability). Unmapped: 0 changes (0%). Agent-authored: 100%.

| capability | changes | commits (of 26) |
|---|---|---|
| knowledge-base (docs/) | 46 | 19 |
| change-planning | 39 | 15 |
| course-solves | 32 | 14 |
| course-tools | 14 | 5 |
| agent-guardrails | 13 | 9 |
| hq-card-queue | 1 | 1 |

## Top files in top capabilities
- knowledge-base: docs/CHANGELOG.md 18, docs/lessons-learned.md 10, docs/tools.md 6, didnt-work.md 4.
- change-planning: context/changes/README.md 8 (an index), hq-solve-notes-and-schedules/plan.md 4, 2026-10-27-overnight-s01e02.md 3, context/archive/README.md 3.
- course-solves: challenges/S01E02/log.md 6, S01E01/log.md 4, everything else 1.
- agent-guardrails: .gitignore 4, CLAUDE.md 3, context/foundation/environment.md 2, hooks/pre-commit 1.
- course-tools: .claude/skills/read/scripts/redact.mjs 2, each tool script 1.

## Trend (commits per day)
| capability | 10-26 | 10-27 | label |
|---|---|---|---|
| knowledge-base | 10 | 9 | constant |
| change-planning | 4 | 11 | rising (campaign: hq-solve-notes-and-schedules phases p1-p4, grok-comms-loop, hq-runs) |
| course-solves | 6 | 8 | constant (S01E01 on day 1, S01E02 on day 2) |
| agent-guardrails | 4 | 5 | constant |
| course-tools | 2 | 3 | constant |
| hq-card-queue | 1 | 0 | one-off |
Commits per day: 10 then 16. Labels are 2-point observations, not findings.

## Fix pressure
Heuristic: subject matches `fix|bug|hotfix|revert|regression|broken|incident`. Result: 0 of 26 commits match; 0 reverts. Fix share is 0% everywhere. Subjects use feat/docs/chore/Add style, so fixes are probably folded into feature commits or `docs(...) amendments` (4eb2c31 "live-use amendments"). Evidence of low fix pressure is weak: the vocabulary is absent, the behaviour is unknown. Cross-cutting commits (>3 capabilities): 6 (f80bcf4, e0b6dda, 7f2b3e9, e025745, f7c8b33, 39b5503, the last touching 5); they are feature/init commits, not fixes.

## Co-change between capabilities
The 6 cross-cutting commits are dropped (more than half of 6 capabilities). Support = shared commits, confidence = shared / commits of the less active side.
- change-planning + knowledge-base: support 8, confidence 0.53
- course-solves + knowledge-base: support 6, confidence 0.43
- change-planning + course-solves: 3, 0.21
- agent-guardrails + change-planning: 2, 0.22; agent-guardrails + knowledge-base: 2, 0.22
- change-planning + course-tools: 1, 0.20; agent-guardrails + course-solves: 1, 0.11
Common cause (rule 4/8): the CLAUDE.md rule "update docs/ in the same commit" makes docs/CHANGELOG.md co-change with nearly everything by design. This is workflow lockstep guarded by a convention only, not by a check I found. Treat as a corridor.

## Hub files and freshness
Partners counted only if seen in 2+ commits, excluding the 6 cross-cutting commits. All named files exist at HEAD (git cat-file -e).
- docs/CHANGELOG.md: 3 partner capabilities (change-planning 8, course-solves 5, agent-guardrails 2). Hand-kept changelog.
- docs/lessons-learned.md: 2 (change-planning 3, course-solves 4).
- context/changes/README.md: 2 (knowledge-base 5, agent-guardrails 2). Index of plans.
- context/changes/2026-10-27-overnight-s01e02.md and pending-deck-cards.md: 2 each (guardrails, knowledge-base).
Gone: context/changes/pending-commit-hook.md (deleted; history only).

## Mechanical signals
- Whole repo is prose, so rule 8 applies to everything: knowledge-base and change-planning rank highest by volume, but this is discussion churn, not code risk.
- docs/CHANGELOG.md hub status: rule 3/4 (workflow convention).
- change-planning rise on day 2: rule 4, it is a new subsystem being planned and built (HQ pipeline), not instability.
- 0% fix share: not reassuring, see unknowns (no fix vocabulary).
- Concentration: single shared identity, no baseline (rule 6/7).

## Unknowns
- Whether any course-solves answers were wrong or re-submitted: commits do not say; log.md contents were not read per brief.
- Code vs docs pairs that should change together but do not (tools/ scripts vs docs/tools.md, hooks/pre-commit vs CLAUDE.md): no check found; docs/tools.md has 6 touches against 14 tool changes, but that cannot be judged from 2 days.
- Real fix pressure in tools (transcribe, check-handoff): no fix-labelled commits; unknown.
- Uncommitted work (CLAUDE.md, docs/tools.md, docs/CHANGELOG.md, tools/whereami, docs/environments.md) is invisible to history.
- Trends: 2 days, one identity.

## Commands run
- read capabilities.tsv, scan-contract.md; wc/head on git-log.txt
- python3 -I script (in scratchpad) parsing .work/git-log.txt: attribution, per-day counts, fix regex, cross-cutting, pairs, hubs
- git log --format=%an | sort | uniq -c; git log --format=%s | grep -iE 'fix|revert|amend|correct|undo|drop'
- git cat-file -e HEAD:<path> for named files; git log --diff-filter=D --name-only
