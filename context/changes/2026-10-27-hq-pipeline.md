# HQ pipeline: lessons, tasks and cards on the UGREEN (in flight)
Goal: have the course lessons, challenges (tasks) and cards visible in the HQ app, and later dispatch the tasks to workers.

## Done (2026-10-27, from the UGREEN)
- Mapped `mega-hq` with the repo-map method: 98 commits in about 8 hours, all agent-authored, 3 merged PRs, no risk zone qualifies. Watch items: approve-cards reach, duplicated secret-screening (`shared/redact.mjs` vs `supabase/functions/mcp/redact.ts`), the `/mcp` function, RLS.
- Course MCP works again in the UGREEN session (`mega-start`, `list-challenges`). It returned lesson S01E02 "Steering Models Through Context" and challenge S01E02 "who said what" (unsolved).
- Created proposer `claude-mac` through the API (owner sign-in, RPC `create_proposer`). First try failed: the schema only accepts `propose_card`, `propose_cards`, `list_cards`.
- Loaded lesson S01E02 (condensed text) and challenges S01E01 and S01E02 with `ingest/ingest.mjs`; added step labels because the Task screen showed 0/0 steps without them. S01E02 steps were derived from its description and must be replaced by the real list after the challenge starts.
- Installed rook's `read` artifact globally on the UGREEN (`~/.claude/skills/read`, unadapted original; self-tests pass). The adapted copy in this repo (`.claude/skills/read`) stays the reference.

## Blocked / open
- Deck page: https://hq.mega.dev/deck needs a course session. See `pending-deck-cards.md`.
- No cards exist in HQ yet (`list_cards` returns `[]`).
- S01E02 first session done (2026-10-27): audio and video reports and the record accepted. Waiting for the new-session claim; see `challenges/S01E02/log.md`.
- Dispatch window / task board: not built. Options: Grok Bot gateway (homelab-2 ADR 0012) or a Tasks screen in HQ.

## Next step
Owner opens a new session on the UGREEN and pastes the resume prompt (receipts are in `~/.config/mega-hq/s01e02-receipts.json`, valid until 2026-11-10). Then record the solve, the artifact and the debrief here. Human decides: start S01E02, propose cards from the lessons, or build dispatch. Move this file to `context/archive/` when HQ shows lessons, tasks and cards and dispatch is decided.
