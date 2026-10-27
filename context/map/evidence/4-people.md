# Evidence: people
Window: whole history, 2026-10-26..2026-10-27, 26 non-merge commits (plus 3 merge commits excluded by contract).
humans_in_window: unknown. All 26 commits carry the one identity "Mother Console" (owner's AI-session git identity). It is a shared identity, not a person; every share below is a baseline, not a finding.
Filters: bots 0; mass commits 0; no mailmap effect (one name). No e-mails recorded here.

## People per capability   (evidence)
Commits per capability (a commit counts once per capability touched, so the sum exceeds 26):
| capability | criticality | commits | author(s) | period | topic groups (from subjects/paths) |
|---|---|---|---|---|---|
| course-solves | high | 14 | Mother Console | 10-26..10-27 | S01E01 solve/debrief, S01E02 start/recordings/handoff, retro template and retro loop |
| agent-guardrails | high | 9 | Mother Console | 10-26..10-27 | pre-commit token hook, CLAUDE.md rules, environment facts in context/foundation |
| course-tools | medium | 5 | Mother Console | 10-26..10-27 | read skill, transcriber, check-handoff, source-reader agent, headless login spike |
| knowledge-base | medium | 19 | Mother Console | 10-26..10-27 | lessons, playbook, changelog, tool notes (docs, so discussion not code: rule 8) |
| change-planning | low | 15 | Mother Console | 10-26..10-27 | HQ pipeline / runs queue plans, solve-notes-and-schedules, grok-comms-loop (plans, rule 8) |
| hq-card-queue | low | 1 | Mother Console | 10-26 | cards/ added in the init commit only |
Included beyond high/medium: knowledge-base (top by count), change-planning (top 5 by count); both mechanical (docs/plans).
Every commit touches several areas via the changelog and log updates (project rule: update docs/ in the same commit), so the counts overlap by design.

## Concentration   (evidence)
Small team (one identity): concentration is the baseline, no bus-factor language. Single-identity-only capabilities: all six (cards/ and hooks/ have 1 commit each). No capability has ever been touched by a second author, so "who else knows" is not answerable from git.
Second identity: "titusandronicu" authored only the 3 merge commits (PRs #1, #3, #4); gh shows the same login as author and merger of all three PRs (evidence). Inference: this is the owner's GitHub account acting as merger/reviewer; no review comments were looked at (other agents cover discussion).

## Agent co-authorship   (evidence)
All 26 non-merge commits carry a Co-Authored-By trailer naming Claude Sonnet 5.5 (100%; per capability also 100%: course-solves 14/14, agent-guardrails 9/9, course-tools 5/5, knowledge-base 19/19, change-planning 15/15, hq-card-queue 1/1). The 3 merge commits have none. So the AI session acts in every code commit; the owner acts at PR merge (3 of 3 PRs). Whether the owner steers, prompts or edits inside the sessions: unknown (the data cannot show it). Work times, UTC-offset +01:00 local hours: 05h (1), 11h (6), 12h (5), 13h (11), 15h (1), 16h (2). Commits per day: 10-26 10, 10-27 16.

## Implications   (inference)
- Ask the owner (the one human with merge rights), not "Mother Console", about any capability; the identity is the AI session history.
- Before changing a capability, the useful trail is the PRs (#1, #3, #4) and the per-challenge log.md/handoff.md and context/changes plans, not authorship. PR #1: transcriber/handoff-check/source-reader (course-tools). PR #3: HQ runs plan, solve notes, retro loop. PR #4: grok comms plan, S01E02 debrief.
- Merge-only second identity is not evidence of a second person.

## Unknowns
- How many humans have contributed (the AI identity may hide several, or other machines).
- Who is on the team now, any formal ownership (no CODEOWNERS looked at; not in capabilities.tsv).
- Whether the owner reviews content or only merges; PR review comments not read here.
- History is two days: no trend or period conclusions.

## Commands run
- cat references/agent-people.md, false-signals.md, scan-contract.md, capabilities.tsv
- git log --format=%aN counts; Co-Authored-By trailer counts (git log --format with %(trailers))
- git log --no-merges per path counts and per-day counts
- python3 -I script mapping .work/git-log.txt paths to capabilities.tsv (commit counts, co-author share)
- gh pr list --state all --json number,author,mergedBy
