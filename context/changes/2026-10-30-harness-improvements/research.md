---
date: 2026-10-30T14:27:50+01:00
researcher: Claude (Sonnet 5.5), four read-only sub-agents plus main-agent spot checks
git_commit: 96166d5
branch: env-maps
repository: mega-dev
topic: "How can the examples in MEGA-DOT-DEV/examples and our S01E01-S01E03 debriefs improve our harness?"
tags: [research, harness, playbook, hooks, worker, knowledge-layer]
status: partial
last_updated: 2026-10-30
last_updated_by: Claude (Sonnet 5.5)
---

# Research: harness improvements from the examples repo and the debriefs

## Research Question

The owner asked for a detailed, thorough look at the course examples repo (github.com/MEGA-DOT-DEV/examples, cloned read-only on 2026-10-30, HEAD `8ec4d3a`) and our debriefs from the Mega lessons, to find improvements to "our harness". Scope agreed in the Q&A: the instruction layer used when solving challenges first (CLAUDE.md, playbook, lessons, tools, hooks, retro and memory loop), then the mega-hq worker and deploy path. Approved order: Tier 1 now, Tier 2 before Tier 3, write-up saved here.

## Summary

- The repo has 54 examples in 5 lessons plus 2 tools (`ask-models`, `request-inspector`). Each example is a small script with a README; most READMEs end with a "What we saw" section.
- Our three debriefs share one pattern: the harness acted on a guess or a stale copy (body shape, model name, speech timestamps, an export). The examples that matter most say the same thing from the other side: put the rule in code, re-read the live source, and verify the running thing.
- Tier 1 (six items, stale or broken files) was applied on 2026-10-30; see "Applied today". Tiers 2-4 are proposals with `status: proposed`.
- Limits: the example numbers come from small OpenAI models (`gpt-6-luna`, `gpt-5-nano`) on samples of about 3 to 20 runs, not from Claude. Five of the ten S01E04 READMEs publish no measurements (worktree-isolation, effort-routing, heavy-guidance, pr-review-rules, worker-result-handoff). No S01E04 or S01E05 debrief exists in this repo, so those lessons were read from the examples and from `Dev/s01e04-log` only.

## Detailed Findings

### 1. What the debriefs show

- S01E01 (`challenges/S01E01/debrief.md`): 3 snags: guessed the body shape, sent 1288 chars against a 700 limit, answered the newest-model question from memory and then from a stale lesson.
- S01E02 (`challenges/S01E02/debrief.md`, compiled, not the course sheet): 6 snags: no local speech-to-text, a `--yolo` worker ran shell commands despite "read-only", model timestamps disagreed (19.7 s, 64.9 s, 119.6 s for one sentence), ambiguous words, decoy times in the recordings.
- S01E03 (`/home/Funky/mother-console-home/work/mega-s01e03/s01e03/debrief.md`, course sheet): 3 snags: an over-split ticket, a merge proposed from symptoms instead of code, and a stale export (the desk's update sat unseen for two rejected submits).
- Before this change the playbook covered S01E01 and S01E02 only. The S01E03 lessons were not in it.

### 2. Examples that change the harness (evidence level in brackets)

Measured = the example README reports numbers. Mechanics = README describes the design but publishes no numbers. Inference = the report's reasoning about our fit.

- Rule volume: error rate per rule rises with list length (`examples/rule-count/README.md` table; `gpt-5-nano` broken rules 13% at 3 rules, 40% at 50; five short principles fixed 10 of 10). [Measured, small models]
- A rule in text is not a rule followed: `agents-md-onboarding/README.md:38` reports an agent that said it edited a file and edited nothing. [Anecdote]
- Self-verification: with tests only, 11 of 11 runs said "fixed" and 0 of 11 had fixed all four books; with a tool that showed the running app, 10 of 10 fixed (`self-verification/README.md:46-58`). [Measured]
- Pointer vs copy: a copied status matched current state in 6 of 24 answers; a pointer or a dated copy matched in 24 of 24 (`pointer-notes/README.md:73-75`). [Measured]
- Reachability: a map in the instructions raised the deploy question from 9/30 to 26/30 facts; links alone 13/30 (`unreached-notes/README.md:56-58`). The map also made the agent skip unlisted notes (`:65`). [Measured]
- Mechanical checks first: a script found 4 of 4 mechanical problems in every run for $0 (`knowledge-health-check/README.md`, `check.ts:39-52`). [Measured]
- Per-category evals: 94% overall hid two fixed and two newly broken rows (`synthetic-skill-eval/README.md:50-64`). [Measured]
- Secrets: with the key in context, 2 of 3 provider requests held it in every run; reference mode 0 of 3 (`secret-references/README.md:42-48`). [Measured]
- Injection: the attacks that worked looked like task facts (a link claimed to hold the answer), not "ignore previous instructions" (`injection-defense-layers/README.md:62-78`). [Measured]
- Gate model calls with code: 28 calls dropped to 4 and 3 of 4 real problems were still caught (`wake-on-signal/README.md:59-72`). [Measured]
- Compaction: facts lost in one summary never return (`context-compaction/README.md`). [Measured]
- Truncation: a silent cut made models state unseen facts (`silent-context-loss/README.md`). [Mechanics, no aggregate numbers]
- Fresh subagents: a task-only subagent kept 0 or 1 of 4 decisions; a brief or fork kept 4 of 4 (`fork-or-fresh-subagent/README.md:45`). [Measured]
- Stale model facts: `gpt-6-luna` named the wrong newest version in 8 of 8 runs (`confabulation-probe/README.md:43`). [Measured]
- Checked edits: whole-note rewrites lost facts in 4 of 6 runs; checked edits 0 of 6 (`cleanup-routine-drift/README.md:53-58`). [Measured]

### 3. Our harness, observed during this research

Verified by the main agent in this session:
- `find-contract.mjs` was a tracked file deleted from the working tree (`git status` showed ` D`), while the playbook, SKILL.md and the skill README all call it.
- `tools/check-handoff` and `tools/retro-check` exited 0 when the `## Facts` / `## Findings` heading was missing, so a renamed heading meant zero checked lines.
- `/home/Funky/.claude/hooks/bash-guard.py` blocks destructive commands only and exits early on `git commit`; it has no rule for `~/.config/mega-hq`, `env`/`printenv`, or the agents' clone.
- `/home/Funky/AGENTS.md` is 212 lines (heartbeat, group-chat and emoji guidance); `CLAUDE.md` is 17 lines.
- The memory index line said "never switch branches or commit in /home/Funky/Dev/homelab-2", but the memory file's own text and description say homelab-2 is the owner's checkout again since 2026-10-19 and the agents' clone is `/home/Funky/Dev/homelab-agent`.
- `core.hooksPath` is `hooks`; the pre-commit hook runs the redaction check only.

Reported by sub-agents and not re-verified:
- The live worker runs from `Dev/mega-hq-overnight-live` with uncommitted edits to `worker/allowlist.json` and `worker/hq-worker.mjs`; `runbooks/hq-worker.md` step 7 points at `/home/Funky/Dev/mega-hq`, which the report says does not exist.
- `runClaude` in `worker/hq-worker.mjs` passes no `cwd`, no model and no effort, and sets `HOME`, so the child can see `~`.
- Session transcripts under `~/.claude/projects/-home-Funky-Dev-mega-dev/` contain lines shaped like tokens (7 and 7 line matches in one session; only counted, not viewed, and not confirmed live).
- `challenges/*/media/` is gitignored, so the transcript JSON for S01E02 exists only on the host.
- `agent-workspace/wt/mega-improve` has a gitdir pointing at a container path that does not resolve on the host.

## Applied today (Tier 1, owner approved 2026-10-30)

1. Memory: retitled `homelab-2-checkout-is-agent-workspace` to `homelab-agent-clone-is-agent-workspace`, corrected the `MEMORY.md` line, fixed the one link in `token-rotation-deferred-accepted-risk.md`. (Outside this repo.)
2. `.claude/skills/read/scripts/find-contract.mjs`: restored from HEAD with `git restore`; `--self-test` prints `self-test ok`. Another session may have deleted it on purpose; if so, the playbook, SKILL.md and README need the references removed instead.
3. `tools/check-handoff` and `tools/retro-check`: fail with a message when the required heading is missing. Tested with a valid file (exit 0), an untagged fact (exit 1), a renamed heading (exit 1), the S01E02 retro (exit 0) and the handoff template (exit 0). The `retro-check` change goes slightly beyond the approved item 3 because the gap was identical.
4. `docs/playbook.md`: new section "After a refusal or rejection (from S01E03)"; stale "Next: S01E02 opens..." line removed; `~/mega-dev` path corrected and dated.
5. `context/changes/README.md`: rows for the overnight run, daily prep and HQ pipeline updated with dates; a line says the change file is the source.
6. `context/foundation/environment.md`: OUTDATED banner added. `docs/tools.md`: duplicate Gmail row merged, Mac-only rows marked.

Nothing is committed. `context/changes/hq-solve-notes-and-schedules/spike-login.md` was already modified before this work and was not touched.

## Applied later the same day (Tier 2, owner approved: check-all and bash-guard)

- `tools/check-all [--quiet]`: five checks (handoff files, retro files, tokens in tracked files, repo paths named in CLAUDE.md and the live docs, executables in `tools/` named in the docs). It passes on the repo now. In a scratch copy with injected problems (an untagged fact, bad retro tags, a token, two missing paths) it failed on exactly those and skipped a `<x>` placeholder. It was run once and found `tools/spike-headless-mega-start` and itself undocumented; both rows were added to `docs/tools.md`.
- `hooks/pre-commit` now runs `tools/check-all --quiet` as advisory: it prints problems and never changes the hook's exit status. Switching it to blocking is a separate decision.
- `/home/Funky/.claude/hooks/bash-guard.py` (outside this repo) gained four rules, tested by `/home/Funky/.claude/hooks/test_bash_guard.py` (8 tests, all pass, run with a temporary HOME): (1) `git commit|checkout|switch` is blocked when the cwd or command is in the agents' clone, checked before the commit early exit; (2) any command naming `.config/mega-hq` is blocked; (3) environment dumps (`env`, `printenv`, `export -p`, `/proc/*/environ`) are blocked while `env VAR=x cmd` is allowed; (4) `node ...solve-notes.mjs` needs a `--dry-run` for the same `--code` within the last hour. Rule (4) records the dry run when it is requested, not when it succeeds.
- Correction: the agents' clone is `/home/Funky/agent-workspace/homelab-agent` on this host. `/home/Funky/Dev/homelab-agent` (the path in the memory file and in my first fix) does not exist; the memory file and index now use the real path.
- CLAUDE.md (owner approved the three edits): added a "name the check you ran against the running thing" rule, a "Read before you act" block of four lines, and the filing rule. CLAUDE.md went from 17 to 25 lines. Not measured: whether the extra lines change compliance; the rule-count example suggests the cost of each added rule is real, so the next addition should replace or enforce one.

## Findings (proposals)

Format follows `challenges/RETRO-TEMPLATE.md`.

### Tier 2: enforce in code (do before Tier 3)
- No single command checks every handoff, retro, tracked file for tokens, doc path references and tool listings; the checks are prose rules in CLAUDE.md plus a hook that runs redaction only. Build `tools/check-all` and call it from `hooks/pre-commit`, advisory first. [evidence: CLAUDE.md lines 5-8, hooks/pre-commit, knowledge-health-check README] [fix: tool] [status: applied]
- `bash-guard.py` does not enforce the secrets-folder rule or the agents-clone rule. Add: deny reads of `~/.config/mega-hq` and `env|printenv`; deny `git commit|checkout|switch` under `/home/Funky/Dev/homelab-agent` (not homelab-2); require a dry run before `solve-notes.mjs`. Verify the hook JSON field for cwd first, and handle the early exit on `git commit`. [evidence: bash-guard.py:10-27, approval-gate README, memory file] [fix: tool] [status: applied]
- "Done" is claimed on green tests. Add to CLAUDE.md: before saying done, name the user-visible check you ran against the running thing and paste its output. Consider `tools/verify-hq`. [evidence: self-verification README:46-58, lessons-learned #13, #20, #21] [fix: claude-md] [status: applied]
- Add a "Read before you act" block to CLAUDE.md, per task type, short. Today `docs/lessons-learned.md`, `docs/worked.md`, `docs/didnt-work.md` and `docs/environments.md` are not named by CLAUDE.md. [evidence: unreached-notes README:56-65, reachability walk by sub-agent] [fix: claude-md] [status: applied]
- Filing rule: a lesson is stated once in `lessons-learned.md`, the playbook holds the action and links the number, CLAUDE.md holds only hard rules, refusals go to `didnt-work.md` as dated events. The untrusted-input-to-`--yolo` rule is currently stated in four files. [evidence: inbox-filing README, lessons-learned #17, CLAUDE.md, agent-background hazard 6, S01E02 retro] [fix: claude-md] [status: applied]
- Retros are missing for S01E01 and S01E03 and S01E02's course feedback is not pasted. Draft S01E01 and S01E03 retros as proposals. [evidence: challenges/ listing, retro.md "Feedback" placeholder] [fix: none] [status: proposed]

### Tier 3: worker and deploy safety (mega-hq)
- Deploy from a commit into a worktree, not from a dirty `*-live` tree; fix the runbook path. [evidence: sub-agent report on runbooks/hq-worker.md step 7 and git status of mega-hq-overnight-live; not re-verified] [fix: tool] [status: proposed]
- Run the child `claude -p` with its own `HOME` and an empty cwd; dry-run first because it may break the course login. [evidence: report on worker/hq-worker.mjs runClaude; privacy-boundary README] [fix: tool] [status: proposed]
- Reply schema for the planned `review` and `code-task` kinds (changed paths, tests run, open question, PR URL), with paths checked against `git diff`. [evidence: worker-result-handoff README, mechanics only] [fix: tool] [status: proposed]
- Gate the 10-minute poll: call the model only when `list-challenges` differs from the last snapshot, plus a weekly full run for the blind spot. [evidence: wake-on-signal README:59-72] [fix: tool] [status: proposed]

### Tier 4: cleanup and optional
- Measure what `~/AGENTS.md` costs per session with `tools/request-inspector`, then shrink or scope it. [evidence: AGENTS.md 212 lines vs CLAUDE.md 17; context-window-budget README; cost is an inference until measured] [fix: claude-md] [status: proposed]
- Move one-off incident notes (lessons-learned #19-21) out of default-loaded files. [evidence: lessons-learned.md] [fix: playbook] [status: proposed]
- Redact before any session-mining script; extract corrections with the preceding assistant turn. [evidence: session-mining README:50-65; token-shaped lines counted, not viewed] [fix: tool] [status: proposed]
- Per-rule eval cases for the `read` skill. [evidence: synthetic-skill-eval README:50-64] [fix: skill] [status: proposed]
- Un-ignore transcript sidecars (`challenges/*/media/*.transcript.json`) so handoff source tags resolve elsewhere; they are untrusted data. [evidence: .gitignore:9-10, image-sidecar-notes README:59] [fix: tool] [status: proposed]
- Add a `Lesson:` line to each `context/archive/README.md` entry. [evidence: task-board-context README] [fix: none] [status: proposed]
- Reconcile the tooling-split plan's "shared checkout is the Mother Console workspace" with the memory note; fix the broken `mega-improve` worktree. [evidence: docs/environments.md open items; sub-agent report] [fix: none] [status: proposed]

## Not applicable or unproven

- Not applicable: hybrid-search, file-picker, summary-index, guided-components, background-workers, heavy-guidance, the arithmetic result in effort-routing, and the viewer/CLI/provider modules. Reasons: our docs layer is small enough for grep, the worker is a cron queue with no live coordinator, and we run no paid-API examples.
- Unproven for us: per-kind model or effort pinning (no baseline; measure `result.usage` first), mid-run steering (defer until a long `code-task` kind exists), and hooks injecting notices in headless runs.

## Code References

- `examples/rule-count/README.md`, `examples/self-verification/README.md:46-58`, `examples/pointer-notes/README.md:73-75`, `examples/unreached-notes/README.md:56-65`, `examples/secret-references/README.md:42-48`, `examples/wake-on-signal/README.md:59-72` (examples repo, local clone in the session scratchpad)
- `tools/check-handoff`, `tools/retro-check`, `docs/playbook.md`, `hooks/pre-commit`, `.claude/skills/read/scripts/find-contract.mjs`
- `/home/Funky/.claude/hooks/bash-guard.py:10-27`
- `/home/Funky/repos/mega-hq/worker/hq-worker.mjs`, `runbooks/hq-worker.md` (reported by sub-agent)

## Open Questions

- Was `find-contract.mjs` deleted on purpose by another session?
- Do S01E04 and S01E05 have course debriefs that should be copied into `challenges/`?
- What is the course feedback text for S01E02 (blocks that retro)?
- Which Tier 2 items does the owner want first?
