# Tools
| Tool | Use | Note |
|---|---|---|
| `mega-challenge` MCP | list/start challenges, debrief, artifact, rook | configured locally; cloud routines cannot use it |
| browser-automation skill (`--session`) | headless, signed-in course browser | Brave is not scriptable here; its profile folder is permission-denied. Close the session only when done: it holds the sign-in |
| `.claude/skills/read` (from rook, adapted) | find-contract, cut-diff, save-page, redact | self-tests: `node .claude/skills/read/scripts/<name>.mjs --self-test` |
| `.claude/skills/mega-notes` | drafts the owner's Notion page for an episode from local records, checks it, shows it, and publishes only after a yes | `node .claude/skills/mega-notes/scripts/check-notes.mjs --self-test`; the check blocks tokens, private strings, missing sections and long quotes; result comes from `list-challenges`, never from logs |
| WebSearch | live "newest" facts | sources can disagree; cite the maker's page and date |
| `gh` | create/push the private repo | logged in as `titusandronicu` |
| Python 3 (`-I`) | count characters, redact logs | count with a tool, never by eye |
| Cloud routine `mega-dev-daily-prep` | weekday prep, no sign-in | create the routine, then check `mcp_connections`: default connectors get attached |
| CronCreate (local) | one-shot overnight job | session-only; needs the session open and the Mac awake (Mac, 2026-10-26) |
| `caffeinate` | keep the Mac awake | Mac only; was started 2026-10-26 for 18 h, long over |
| Gmail connector (claude.ai) | read the course sign-in email (overnight job only, human-approved) | read only that one message; the link only works in the browser that requested it |
| HQ `mega-hq` app + `claude-mac` proposer | propose/list cards (`propose_card`, `propose_cards`, `list_cards`) | on the UGREEN; token shown once, never in git; see context/foundation/hq.md |
| `mega-hq/ingest/ingest.mjs` | load lessons and challenges into HQ | needs `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OWNER_EMAIL`, `OWNER_PASSWORD` in the environment |
| `mega-hq/ingest/solve-notes.mjs` | write a solved challenge's summary and snag table into HQ (shown on the Task screen) | `node ~/repos/mega-hq/ingest/solve-notes.mjs challenges/<code>/debrief.md --code <code> [--solved-at YYYY-MM-DD] [--debrief-url https://...] [--dry-run]`. Reads the `\| # \| Snag \| Fix \| Who \|` table; the rest of the file is the summary (max 4000 chars). The challenge must be ingested first. Snags no longer in the file are deleted. `--dry-run` prints counts only and needs no env. Same four env vars as `ingest.mjs` |
| `mega-challenge` `artifact` | files unlocked by a solved challenge | S01E01 -> `read` skill; call without `answer` to see the offer |
| Gemini API (key held by Mother Console, owner-approved use) | transcribe course audio with timestamps | no tools attached; send only the audio; model names from `/v1beta/models` (`gemini-flash-latest` worked, `gemini-2.5-pro` returned 404) |
| `ffmpeg` (silencedetect) | check speech start times | models' own timestamps disagreed |
| `tools/speech-offsets <file> [dB] [min-s]` | speech start times after pauses, via silencedetect | wraps the line above; prints seconds, one per line |
| `tools/check-all [--quiet]` | one command for every repo check: handoff and retro files, tokens in tracked files, repo paths named in the docs, tools listed here | exit 1 on any failure; run from anywhere; the pre-commit hook runs it as advisory. Files in `hooks/token-allowlist` may carry a course signature on their `signature:` line only; the hook and this check skip that one line |
| `tools/kb-render <export-dir> <out-dir> [--build]` | S01E03 recipe: turns a course knowledge-base export into a throwaway SvelteKit site so you can read the rendered HTML | the build runs the export's own code: use the console or a container without secrets; build not yet run on this host |
| `tools/spike-headless-mega-start` | spike for the HQ worker: can headless Claude Code call `mega-start` unattended? | read-only; prints one JSON line; exit 3 on 403/429, then stop and ask the owner; `SPIKE_STRICT=1` loads only the course MCP |
| `tools/retro-check <retro.md>` | checks evidence, fix and status tags on retro findings | see `challenges/RETRO-TEMPLATE.md` |
| `tools/whereami` | which host or container you are in, tool and script presence | paste output into the log when something fails on one place; see `docs/environments.md` |
