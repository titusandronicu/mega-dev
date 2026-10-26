# Tool ideas (from S01E01 analysis)
Priority order. Effort: S = under 30 min, M = about 1-2 h.

| # | Tool | Fixes | Effort |
|---|---|---|---|
| 1 | DONE 2026-10-26: `read` skill installed in `.claude/skills/read/` (find-contract, cut-diff, plus save-page, redact) | Guessed body shape; eyeballed counts | S |
| 2 | PARTLY DONE: `scripts/redact.mjs --check` exists; the git pre-commit hook that runs it is not installed yet | Secrets reaching the repo | S |
| 3 | `tools/mega.mjs`: login, fetch page, POST with auto-log and redaction | Rewriting a script per step; manual log; tokens in logs | M |
| 4 | Persistent headless profile for the course (reuse session cookie) | Magic link for every session; link pasted twice | S |
| 5 | `/mega` slash command or skill: mega-start, list, startPoint, step messages, debrief | Re-deriving the flow each day | M |
| 6 | Daily 05:00 CET schedule: run mega-start, notify when a new challenge opens | Missing the daily drop (S01E02 opens 27 Oct 05:00 CET) | S |
| 7 | `tools/new-challenge.sh S01E0X`: scaffold folder, log, README | Hand-built folders | S |
| 8 | `tools/tries.mjs`: count refusals and quote each from log.md | Debrief fields (tries, snags) written from memory | S |
| 9 | `tools/latest.mjs <vendor>`: fetch maker release page, print name and date | Stale or conflicting "newest model" answers | M |
| 10 | Deck scraper: https://hq.mega.dev/deck -> cards/*.md | Original request: gather cards | M |
| 11 | Move the playbook into the repo `CLAUDE.md` | Rules only loaded when I remember to read them | S |

## Step-by-step analysis
| Step | Time lost to | Tool |
|---|---|---|
| Brave bookmarks | Profile folder permission denied | Ask for an export up front |
| Sign-in | Headless browser, double-pasted link | 4 |
| Read message | Page scraped by hand | 3 |
| First POST | Guessed shape | 1 |
| Second POST | Over the limit | 1, 8 |
| Compact | Ad hoc Python | 1 |
| Form (3 tries) | Memory and stale lesson | 9 |
| Repo | Desktop write blocked | 7 |
| Debrief | Rebuilt from scrollback | 8 |
