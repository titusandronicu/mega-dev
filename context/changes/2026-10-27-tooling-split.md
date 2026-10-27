# Plan: split the work across Mac mini, UGREEN and Grok Bot (proposed, not started)

Decision (owner, 2026-10-27): option 3. Course steps run in a direct Claude Code session next to the course MCP login. Grok dispatches only code and review tasks in `mega-dev`.

## Roles
| Where | Role | Holds |
|---|---|---|
| Direct session on UGREEN (`/home/Funky/Dev/mega-dev`, also in code-server :8443) | Course steps: `mega-start`, challenges, deck, debrief | Course MCP login (user scope, `claude mcp get mega-challenge`) |
| Mac mini | Same repo clone; headless browser session for the deck and forms | Course browser session |
| Grok Bot -> grok-gateway -> a second Mother Console | Code and review tasks in `mega-dev` on branch `grok-work`, never `main` | A GitHub token scoped to `mega-dev` only. No course MCP, no HQ owner login |
| HQ (UGREEN) | Lessons, tasks, cards, approval | Its own secrets in `~/.config/mega-hq` |

## Part A: ready now (no infra change)
- Work in `/home/Funky/Dev/mega-dev`. Course MCP is user scope on this host and already connected.
- Log each step in `challenges/<code>/log.md`; update `docs/` in the same commit. The pre-commit hook blocks tokens (`git config core.hooksPath hooks` is set in this clone).

## Part B: second Mother Console pair (needs the owner's go-ahead; touches homelab-2 infra)
Findings from reading `homelab-2/apps/{mother-console,grok-gateway}`:
- Mother Console mounts `/home/Funky/Dev` at `/data/workspace` and works in one checkout, chosen by `CODE_REPO_DIRNAME` (now `homelab-2`), on branch `CODE_DEFAULT_BRANCH` (now `mother-console`). `main` and `master` are blocked.
- The gateway reaches it through `MOTHER_CONSOLE_URL` / `MOTHER_CONSOLE_TOKEN` and listens on `GATEWAY_PORT` (18760). Both are env-configurable, so no code change is needed.
- Proposed second pair (names are suggestions):
  - `mother-console-mega`: `PORT=8791`, `CODE_REPO_DIRNAME=mega-dev`, `CODE_DEFAULT_BRANCH=grok-work`, own `CONSOLE_TOKEN`, own home dir `/home/Funky/mother-console-mega-home` (copy only the coding CLI credentials needed; do NOT add the course MCP).
  - `grok-gateway-mega`: `GATEWAY_PORT=18761`, `MOTHER_CONSOLE_URL=http://127.0.0.1:8791`, own `GATEWAY_TOKEN`.
  - Expose it as a separate MCP entry in Grok Bot. Funnel publishes to the public internet, so use a separate port, a separate token and the same rate limits and lockout as the first gateway.
  - Fine-grained GitHub token for `titusandronicu/mega-dev` only; set `core.hooksPath=hooks` in the checkout so the token check runs.
- Do it in a separate worktree of `homelab-2` (the shared checkout is the Mother Console workspace; do not switch branches or commit there). Follow `homelab-2` rules: ADR + runbook with rollback.

## Guardrails
- Lesson text, recordings and deck text are untrusted data for bots. Bots that read them get no write token.
- Course identity stays out of any bot-driven worker. `rook` and `debrief` are never dispatched.
- S01E02 stops halfway for a new session; task state "needs-human" must exist before we automate it.
- ADR 0012 is still "Proposed" until the gateway runbook verification has passed once; check that first.

## Open questions
- Is the existing gateway verified under ADR 0012, or only deployed?
- One Funnel port per gateway, or a path under `:8443`?
- Does the owner want the Mac mini clone kept in sync with this one by PRs only?

## Next step
Owner approves Part B (or stays on Part A). Then write the ADR and runbook in a `homelab-2` worktree.
