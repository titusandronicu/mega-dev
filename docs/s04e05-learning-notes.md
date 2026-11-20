# S04E05 learning notes - Building Self-Improving Engineering Systems

Source: Adam's lesson text, John Lindquist's video transcript ("Grow the team outward"). Lesson title on HQ: Factory Grow the Team.

## Principles
- Close the loop: find work, act (bounded change), check the result, choose the next step. Feedback must be high signal, truthful, complete, timely, available.
- Verification (tests, canaries, monitoring) is about 70% of token use in Lauren Tan's team; it is what buys trust in agents.
- Self-change: a proposed rule (or part) is only a proposal until a fixed check outside the agent passes. Failed proposal: the old rule stays. State, log and receipts live on disk, so a restart and a crash share one recovery path.
- Separate the evaluator (Judge) from the system: scope, permissions, independence, control.
- Judge primitives: Revision (hashed exact state), Case (replayable situation), Check (code, model or later real outcome), Trial (bounded replay of Cases against a Revision), Verdict (keep, roll back, ask a person, with evidence).
- Distillation: turn repeated runs into skills, scripts, templates. A template change reaches everything built on it, so review it harder than a new skill.
- Governance: agents do small undoable things; people keep money, promises and which version goes live. Two keys: checks passed on exactly that version AND a person approved exactly that version; old version saved first.

## John's build (front desk for visiting agents)
- Guide (llms.txt) informs; a front desk answers questions; typed MCP tools do actions (about a third of the time, under half the cost).
- Desk has three tools only (price, home rules, place hold). No money tool. Every call uses the visitor's own sign-in.
- Confirmation is built from the saved record, not the model reply. Idempotency key built in code. Documents are read, never obeyed.
- Limits in code before a model wakes: message length, per-visitor rate, daily budget. A receipt per visit (time, cost, cache share, reply matches record).
- Sealed cases: outside the project, the changing agent is denied that folder by the OS; results are one bare line per case (no title, question, reply). Run each case several times (pass^k).
- Post-commit/merge hook runs everyday checks then sealed cases; if the sealed folder is unreachable it says so out loud. It reports, never reverts.
- Trainer: no tools, never sees sealed cases, capped rounds and spend, one sealed run only. `/lab suggest` proposes agents, builds none.

## Map to this repo
- Fixed checks exist (`tools/check-all`, `pre-claim-gate`, `retro-check`); no sealed folder or replayed cases yet.
- Retro statuses `proposed` -> `applied` are the human key; no fingerprint of the exact version yet.

## What the Challenge taught
(fill in from challenges/S04E05/log.md)
