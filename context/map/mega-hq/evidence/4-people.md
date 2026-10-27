# Evidence: people (mega-hq)

Window: whole history, 2026-10-26 .. 2026-10-27, 100 non-merge commits.
Authors (git log): all 100 non-merge commits are the single identity "Mother Console" (owner's AI-session identity). 5 merge commits: 3 authored "titusandronicu" (GitHub PR merges #1-#3), 2 "Mother Console"; merges are excluded and show only that a GitHub account merged PRs (evidence); who sits behind it is unknown.
humans_in_window: unknown. Every concentration figure below is a baseline, not a finding (false-signal 6). No `.mailmap`-based merging possible or needed.
Agent trailer: 100/100 commits carry a Co-Authored-By trailer (89 Claude Sonnet 5.5, 12 Claude Haiku 5.5 by trailer count over the log; trailer-count totals 101 because one commit lists both or one trailer line is counted twice, not resolved). So every change was AI co-authored; the data cannot show whether an owner steered it.

## People per capability
Evidence: one identity everywhere, so "people" collapse to one shared identity. Commits per capability (a commit counts once per capability touched; 0 unattributed):
- shared-foundations 36 (2026-10-26..27); scopes web 21
- owner-web-app 33 (10-26..27); scopes web 14, db 2
- docs-planning 19 (10-26 only)
- platform-deploy 18 (10-26..27); scope deploy 9
- agent-intake-mcp 13 (10-26..27); scope mcp 9, db 2
- lesson-examples 10 (10-26 only); scope ingest 6
- nightly-export 9 (10-26 only); scope export 6
- course-ingest 7 (10-26..27); scope ingest 5
- security-redaction 5 (10-26 only); scope db 2
- solve-notes 1 (10-27); runs-schedules 0 commits touching its footprint
Rated high/medium in contract: agent-intake-mcp, owner-web-app, security-redaction, platform-deploy, course-ingest, solve-notes, runs-schedules, shared-foundations. Topic groups per person cannot be made (one identity); the scope column above is the only topic signal.

## Concentration
Small/unknown team: concentration is the baseline. Capabilities only one identity has ever touched: all of them (10 of 10 with commits). Nothing to rank. Commits touching a single capability only: shared-foundations 12, docs-planning 10, owner-web-app 9, agent-intake-mcp 9, lesson-examples 5, platform-deploy 5, nightly-export 5, course-ingest 3, security-redaction 1 (inference: security-redaction and solve-notes are mostly cross-cutting, rarely touched alone).

## Agent co-authorship
Share of commits with agent trailer: 100% in every capability (co == total). Haiku trailer present on: agent-intake-mcp 4/13, shared-foundations 2/36, docs-planning 2/19, platform-deploy 2/18, nightly-export 2/9, course-ingest 2/7, security-redaction 1/5, owner-web-app 0, lesson-examples 0, solve-notes 0 (context only, model mix is not ownership).

## Implications
- No person to ask can be derived from git. Ask the repo owner (the account behind the merges, titusandronicu on GitHub, is the only second identity seen, evidence for PR merges only).
- Before changing a capability, read the plan docs and PRs (#1 plan-2c, #2 plan-3a, #3 mcp-secret-screen) rather than hunting an author; agent-written history means commit bodies and docs/plans are the real memory (inference).
- agent-intake-mcp has the only commits with a different scope pattern (mcp 9) and the Haiku mix highest; nothing more is deducible.

## Unknowns
- Who is on the team, formal ownership, whether the owner or an AI agent decided each change (all identical in data).
- Who titusandronicu is relative to Mother Console (same owner is plausible, unconfirmed).
- The 89+12 vs 100 trailer discrepancy was not resolved.
- runs-schedules shows 0 commits under the footprint globs (the Runs screen files may be attributed via web/src/screens/Runs*; none matched in this window), not verified further.

## Commands run
- git log --format=%aN / --no-merges --format=%aN | sort | uniq -c
- git log --merges --format='%h %aN %s'
- git log --format='%(trailers:key=Co-Authored-By,valueonly)' | sort | uniq -c
- git log --no-merges -i --grep='^Co-Authored-By' | wc -l
- python3 script over .work/git-log.txt + capabilities.tsv (globs first, then longest prefix) for per-capability counts, dates, scopes, trailers
