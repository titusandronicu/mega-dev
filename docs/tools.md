# Tools
| Tool | Use | Note |
|---|---|---|
| `mega-challenge` MCP | list/start challenges, debrief, artifact, rook | configured locally; cloud routines cannot use it |
| browser-automation skill (`--session`) | headless, signed-in course browser | Brave is not scriptable here; its profile folder is permission-denied. Close the session only when done: it holds the sign-in |
| `.claude/skills/read` (from rook, adapted) | find-contract, cut-diff, save-page, redact | self-tests: `node .claude/skills/read/scripts/<name>.mjs --self-test` |
| WebSearch | live "newest" facts | sources can disagree; cite the maker's page and date |
| `gh` | create/push the private repo | logged in as `titusandronicu` |
| Python 3 (`-I`) | count characters, redact logs | count with a tool, never by eye |
| Cloud routine `mega-dev-daily-prep` | weekday prep, no sign-in | create the routine, then check `mcp_connections`: default connectors get attached |
| CronCreate (local) | one-shot overnight job | session-only; needs the session open and the Mac awake |
| `caffeinate` | keep the Mac awake | started 2026-10-26 for 18 h |
| Gmail connector | read the course sign-in email (overnight job only, human-approved) | read only that one message |
