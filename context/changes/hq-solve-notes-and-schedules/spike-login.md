# Spike: unattended course login (phase 3)

Question: does a headless `claude -p` process on the UGREEN reach the course MCP (`mega-start`, read-only) without a person, and for how long?
Script: `tools/spike-headless-mega-start` (one allowed tool, `mcp__mega-challenge__mega-start`; prints `{ok, at, mode, error}` only; stops on 403/429).
Machine: `DXP6800PRO-8078` (the UGREEN), user `Funky`, Claude Code 2.1.311. The `mega-challenge` server is at user scope (`https://hq.mega.dev/mcp`, HTTP).

## Runs
| # | When (UTC) | Mode | Result |
|---|---|---|---|
| 1 | 2026-10-27 12:19:42 | default (all configured MCP servers loaded) | `ok: true`, about 10 s |
| 2 | 2026-10-27 12:20:00 | strict (only `mega-challenge` loaded, `--strict-mcp-config`) | `ok: true`, about 8 s |
| 3 | 2026-10-27 12:20:28 | strict, cron-like environment (`env -i`, only `HOME` and `PATH`) | `ok: true`, about 15 s |

Each run is a separate `claude` process. Runs 2 and 3 show that the worker's planned setup (one server, no other connectors, bare environment) finds the stored course login.

## Result so far
```
works_now:            true
survives_new_process: true     # three separate processes, including a cron-like environment
survives_24h:         pending  # re-run on or after 2026-10-28 12:20 UTC, from the same cron-like environment
failure_text:         none
decision:             pending  # rule: go only when all three are true
```

## What this does not show
- How long the login lasts. The overnight run on 2026-10-27 05:20 CET failed with "needs the user to re-authorize" (`challenges/S01E02/overnight.md`), so a lapse within hours is possible. Only the 24-hour re-run, and later ones, can tell.
- That a lapse is recoverable without a person. If a run reports `needs_reauth`, the worker must record `needs-human` and stop (plan phase 5).
- Behaviour of calls other than `mega-start`. `start-challenge` is untested here and must stay out of scope until this record says `go`.

## Rule for phases 4 and 5
- `go`: the worker may run course-command kinds.
- `no-go`: every course-command kind is recorded `needs-human`; schedules, the queue and `sync-status` from ingest still work.

## To finish this spike
1. On or after 2026-10-28 12:20 UTC run: `env -i HOME="$HOME" PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin" SPIKE_STRICT=1 tools/spike-headless-mega-start`
2. Add the row above and set `survives_24h`.
3. Owner reads this file and sets `decision: go` or `decision: no-go`.
