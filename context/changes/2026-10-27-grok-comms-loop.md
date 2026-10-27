# Plan: communication loop between Grok bots, HQ and sessions (proposed, not started)

Decision (owner, 2026-10-27): both A and B, A first.
- A: bots send tasks in and read results out, through the HQ runs queue.
- B: the owner steers live sessions with `/remote-control`.

Builds on `2026-10-27-hq-runs.md` (queue, pull worker, Slack) and `2026-10-27-tooling-split.md` (Grok code worker on `grok-work`). Nothing here starts before those two are approved and their phases 2-3 exist.

## Findings
- A Grok bot connection already exists on this host (background session "MCP connection to Grok bot in homelab-2"). ADR 0012 (dispatcher) is still "Proposed".
- The runs plan only knows read-only course kinds (`sync-status`) and two requesters (`owner-button`, `cron`). A bot is a third requester with a different trust level.
- Bot text (task descriptions, results) is untrusted data, same as recordings.
- `/remote-control` links a live session to the owner's other devices. It is an owner-to-session channel, not a bot-to-session one. Its exact limits on this host are unchecked (the three Remote Control sessions listed are offline).

## A: queue as the single bus
```
Grok bot --enqueue_run--> HQ runs --pulled by--> worker --record_run--> HQ runs <--get_run-- Grok bot
                                      |                                     \--> Slack line
                                      +-- code-task: hand to mother-console-mega (grok-work, PR only)
```
1. Requester: add `grok` to `requested_by`. Add `payload` (jsonb, max 4000 chars) and `parent_run_id` (for follow-ups) to `runs`.
2. Kinds for bots, allow-list only: `review` (read a PR or diff, write findings) and `code-task` (change code on `grok-work`, open a PR). Bots cannot enqueue `sync-status`, anything that uses the course MCP, `rook` or `debrief`.
3. Write path: RPC `enqueue_run(kind, payload)` with its own bot token. It validates the kind, rate limits (for example 10 per hour) and never accepts a status or result from the bot.
4. Read path: MCP tools `enqueue_run`, `get_run`, `list_runs` (own runs only), next to the agent read tools already planned. Result is `summary` plus a PR link. No log dumps.
5. Execution: `review` and `code-task` run through the second Mother Console pair from the split plan (own token, repo-scoped GitHub token, no course MCP, `grok-work` only, `main` blocked). The course worker never runs them, and the Grok worker never runs course kinds.
6. States: reuse `needs-human`. A bot run that needs a decision stops there and posts to Slack; it does not retry or guess.
7. Notifications: the Slack lines from runs phase 6a also cover `requested_by = grok`. The bot reads results from HQ, not from Slack.

## B: `/remote-control` for the owner
1. First check what it can do on this host: start one session, connect from another device, and note what it exposes (prompts, approvals, files). Write the findings down before designing.
2. Use it for the owner steering a live session (approve a retro finding, answer a `needs-human` run) when away from the terminal.
3. Slack buttons (runs phase 6b) are the other approval route. Both must write the same decision to HQ, so there is one record.
4. Not used for bots. A bot never gets a path into a session that holds the course login.

## Phases
1. Decide Part B of the split plan (second Mother Console pair). Blocker for 4.
2. Runs queue phases 2-3 exist (table, `record_run`, worker). Blocker for 3.
3. Add `payload`, `parent_run_id`, `grok` requester, `enqueue_run` RPC, bot token, RLS and tests.
4. Wire `review` first (read-only), then `code-task`. Each gets an end-to-end test with a fake bot.
5. MCP tools `enqueue_run`, `get_run`, `list_runs`.
6. B step 1: check `/remote-control`; then write the runbook for approvals.
7. Runbook and rollback: disable the bot token and the `grok` requester; the queue stays harmless.

## Guardrails
- Bot payloads and results are untrusted: validate length and shape, redact before posting, never put them in a prompt that has shell or write access beyond the Grok worker's scope.
- A prompt is not a guardrail (S01E02 retro): limits live in tokens, RLS and the worker allow-list, not in instructions.
- One owner approval before any phase that opens a port or adds a token.

## Open questions
- Is ADR 0012 verified, or only deployed?
- Which bots exactly: only the homelab-2 Grok Bot, or more?
- Should `code-task` PRs auto-open, or only a branch plus a Slack link for the owner to open?
- Rate limit and daily cap per bot?

## Next step
Owner reviews this plan and answers the open questions. Then phase 1.
