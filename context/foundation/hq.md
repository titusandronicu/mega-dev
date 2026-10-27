# MEGA HQ (card approval app) and how it connects to this repo
Facts only. No secrets here: secret files are named, never quoted.

- HQ is a separate private repo, `titusandronicu/mega-hq` (Astro phone app + Supabase). This repo (`mega-dev`) is the course workspace; HQ is where agents propose cards and the owner approves them.
- Runs on the UGREEN NAS (192.168.50.63, hostname DXP6800PRO-8078). Web app: port 18780. Supabase API (local): 127.0.0.1:18790. Tailnet: https://ugreen.tail160435.ts.net:8445 (timed out from the NAS itself on 2026-10-27; use the local port there).
- Secrets live in `~/.config/mega-hq/` on the UGREEN (`supabase.env`, `web.env`, `owner.pw`; mode 0600). Never copy them into any repo.
- Agent intake: MCP function `/functions/v1/mcp`. Tools today: `propose_card`, `propose_cards`, `list_cards`. The schema check on `proposers.allowed_tools` rejects anything else (lesson tools are not grantable yet).
- Proposer `claude-mac` exists (cap 20 cards/day, the three tools above). Its token is shown once and is not stored in git. Revoke it in the app's Settings screen when finished.
- Data path from the course: `mega-challenge` tools (`mega-start`, `list-challenges`) -> input JSON -> `node ingest/ingest.mjs <file>` in mega-hq -> tables `lessons`, `challenges`.
- Approved cards export nightly to `~/mega-dev/cards/*.md` (UGREEN job `export/`). Course-side deck cards (https://hq.mega.dev/deck) are a different source; see `context/changes/pending-deck-cards.md`.
- Dispatch of work to workers is NOT built into HQ. The Grok Bot dispatcher design is in `homelab-2/adr/0012-grok-bot-dispatcher.md` (status Proposed).
