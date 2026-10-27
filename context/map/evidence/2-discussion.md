# Evidence: discussion
Sources: gh (titusandronicu/mega-dev) + git. Window: whole history, 2026-10-26..27 (26 non-merge commits, 1 shared agent identity). No limits hit. All counts below are from commands run this session.

## Buzz per capability
PRs attributed via merge commits (git diff parent1..merge). PRs: 3 total (#1,#3,#4), all merged, 0 closed-unmerged; all opened by the owner and merged within 1-46 s of opening (self-merge). PR #2 does not exist as a PR (number used by issue #2).
| capability | PRs touching | closed-unmerged | human review | reverts | open bugs | plan/change files | markers |
|---|---|---|---|---|---|---|---|
| course-solves (14 commits) | 3 (#1,#3,#4) | 0 | 0 | 0 | 0 | 1 archived (s01e01) | 0 |
| course-tools (tools 3 + .claude 3 commits) | 2 (#1,#3) | 0 | 0 | 0 | 0 | spike-login.md | 0 |
| knowledge-base (19 commits) | 3 (#1,#3,#4) | 0 | 0 | 0 | 0 | - | 0 |
| change-planning (changes 14 + archive 4 commits) | 3 (#1,#3,#4) | 0 | 0 | 0 | 1 open issue (#2, label plan, a tracking issue, not a bug) | 13 files in context/changes + 4 archive | 0 |
| agent-guardrails (CLAUDE.md 3, foundation 4, hooks 1) | 2 (#1,#3) | 0 | 0 | 0 | 0 | - | 0 |
| hq-card-queue (1 commit) | 0 | 0 | 0 | 0 | 0 | pending-deck-cards.md | 1 |
PR sizes: #1 +222/-2, #3 +886/-1, #4 +91/-5 (cross-cutting: every PR touches >3 capabilities, so per-capability PR counts are not distinguishing).

## Friction
- Reverts/hotfix subjects: 0. Subjects with "fix": 0. Evidence: no revert-re-land pairs.
- Second attempts visible in logs, not git: S01E02 had 3 attempts at transcription/blockers (commits 8b89d2c overnight stopped, 0ea50a3 transcription blocker, 8a21f63 failed transcription) before local tools landed in 7f2b3e9. Inference: friction is in course-tools/course-solves (transcription), resolved on day 2.
- hq-solve-notes-and-schedules plan: 4 commits touching it on one day, plan.md amended "live-use amendments" after real runs (evidence: subject of 4eb2c31). Plan.md checklist: 18 [x] vs 26 [ ] open; change.md status: implementing.
- Issue #2 open since 2026-10-27T11:18Z (same day; age under 1 day).

## Planning attention
- context/changes: 6 flat plans + 1 pending-deck-cards.md + 1 folder (5 files: change, plan-brief, plan, research, spike-login) = 13 files; context/archive: 4 plans + README. Prose churn: docs/ touched by 19 commits, context/changes by 14 (docs/CHANGELOG.md touched in nearly every PR), counted as discussion, not hot areas (false-signal 8).
- Attention concentrates on the HQ pipeline theme (hq-pipeline, hq-runs, hq-solve-notes-and-schedules, grok-comms-loop, tooling-split, overnight-s01e02): 6 of 7 active change entries; it is a plan-heavy, code-light area (HQ code lives in another repo ~/repos/mega-hq, outside this scan).
- Recent: all active plans dated 2026-10-27; newest 5998581 (grok-comms-loop) and 4eb2c31.
- Shared cause (rule 4): plan volume and commit volume in change-planning both come from the single new HQ initiative being built.

## Debt markers
TODO/FIXME/HACK/XXX at HEAD: 1 total, in cards/README.md ("TODO: read the deck page and add one file per card"); 0 in all other capabilities (course-solves 449 lines, course-tools 1169, knowledge-base 151, change-planning 959, agent-guardrails 82). Normalised: hq-card-queue 1 marker / 2 lines (tiny sample); others 0/1000.
Softer debt markers (not-started/proposed/open checkboxes): plan.md 26 unchecked boxes; grep hits for pending/proposed/"not started" across context/changes in 11 files (counts: grok-comms-loop 2, tooling-split 3, pending-deck-cards 2, spike-login 2, research 5).

## Mechanical signals
- 3 PRs "reviewed": only bot output (sourcery-ai "no access / upgrade" notice; chatgpt-codex-connector status comment, one still "running" on #4 when it merged). Not human review (rule 7). Codex reported no findings on #1 and #3.
- Self-merge within seconds: PRs are a branch-hygiene/transport mechanism, not review. Rule 6: single identity.
- CHANGELOG/docs churn: prose (rule 8). Cross-cutting PRs: spillover (rule 12).

## Unknowns
- Human review: none exists in forge; whether the owner reviews locally is unknown.
- Branch names (hq-pipeline-2026-10-27, hq-runs-plan) hint at work, but PR #2/issue #2 body not read.
- Production error trackers: none seen. HQ (mega-hq repo) discussion is external.
- Window is 2 days: nothing here is a trend.

## Commands run
git log --format; git diff --name-only <merge>^1 <merge>; gh pr list --state all --limit 100 --json ...; gh issue list --state all --json ...; grep -ciE 'TODO|FIXME|HACK|XXX' per capability file set; grep for status/[ ]/[x] in context/changes; wc -l; git ls-files.
