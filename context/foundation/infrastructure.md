---
project: mega-dev
researched_at: 2026-11-18
type: infrastructure map (existing platform, not a platform choice)
platform: UGREEN NAS DXP6800PRO-8078 (Docker, compose per stack)
context_type: mvp
---

# Infrastructure map: UGREEN NAS and the mega-dev stack

Read this first in a new session, next to `agent-background.md`. It maps what runs where, how to reach it, how a change gets deployed, and what can bite. No secrets here: secret files are named, never quoted.

**Scope note.** `/10x-infra-research` normally picks a deployment platform. Here the platform is already chosen (the owner's UGREEN NAS), so the platform comparison and the five-question interview were skipped on purpose. What remains: the operational story, the risk register, and a map of the stack.

**Trust levels.** `verified 2026-11-18` = read live today (docker MCP `docker-ugreen`, `ssh ugreen`, `curl` of the lesson map). `from records` = taken from repo docs or agent memory and not re-checked today.

## 1. Recommendation

Keep deploying on the UGREEN NAS with one compose stack per service under `/home/Funky/homelab-stacks/<name>/`. It is always on, owned by the owner, has 7.3 TB on `/volume1` (3% used) and reaches the tailnet. Do not add a cloud platform for course work. The risks below are about operations (single host, no CI, hand deploys), not about fit.

## 2. Access paths (verified 2026-11-18)

| Path | What it gives | Notes |
|---|---|---|
| `ssh ugreen` | Shell as user `Funky` on `192.168.50.63` (host `DXP6800PRO-8078`, kernel 6.18.15, 23 GiB RAM, about 9.6 GiB available) | Key auth, `IdentitiesOnly`. The server shows a post-quantum warning on every connect; harmless. |
| MCP `docker-ugreen` | List/inspect, logs, create, start, stop, recreate, remove containers; pull/build/push images; networks and volumes | Tool names `mcp__docker-ugreen__*`. `list_containers` returns about 170k characters (50 containers): save to a file and parse with Python, do not read it inline. Removal tools are destructive: ask the owner first. |
| LAN HTTP | `http://192.168.50.63:<port>` | Ports in section 3. Most mega-dev services bind `127.0.0.1` only, so they are host-local. |
| Tailnet | Host `ugreen` (`100.125.207.127`); Funnel on `https://ugreen.tail160435.ts.net:8443`; HQ at `:8445` (from records) | Other nodes seen: `mac-studio-funkykoval` online, `mac-mini-kamil` offline 13 days. |
| `tools/nas-put <file> <remote-path>` | Sends one file over ssh and compares sha256 | Use instead of `scp` with a relative path. |
| `aws-mcp` | **Disconnected on purpose** | Do not "fix" it. See memory `aws-mcp-left-disconnected`. |

Where sessions run (`docs/environments.md`, run `tools/whereami` when a path is missing):

| Place | Repo path | Has | Lacks |
|---|---|---|---|
| UGREEN host, user `Funky` | `/home/Funky/Dev/mega-dev` (clone has `main` at 8b0b6eb, verified) | course MCP login, ffmpeg, `tools/*`, docker, gitignored `challenges/*/media/` | |
| WSL2 laptop (this session) | `~/mega-dev-local` | Claude Code, `gh` as `titusandronicu`, docker MCP, `ssh ugreen` | course media unless copied |
| `ugreen-code-server` container (:8443) | `/workspace/mega-dev` | repo and media, bash, git | node, ffmpeg |
| `mother-console` container | none (mounts `/home/Funky/agent-workspace` at `/data/workspace`) | bash, git, node | repo, ffmpeg, course MCP |
| Mac mini / Mac Studio | same repo clone | signed-in course browser session | media; Mac mini unchecked and offline |

## 3. What runs on the NAS (verified 2026-11-18, 50 containers, all running)

### Course and lesson stack (the part mega-dev depends on)

| Container | Image | Bind | Purpose |
|---|---|---|---|
| `lesson-map` | nginx-unprivileged 1.27 | `192.168.50.63:18082` | The lesson map and "Tools by episode" page. Static site built from `tools/lesson-map`. `/version.json` shows commit `8b0b6eb`, built 2026-11-16, equal to `origin/main` today. |
| `mega-hq-web` | `mega-hq-web:20261102-1508` | `127.0.0.1:18780` | MEGA HQ owner phone app (Astro/React). Repo `titusandronicu/mega-hq`. |
| `mega-hq-supabase-*` (api-gw envoy, auth, db postgres 17, functions edge-runtime, realtime, rest) | supabase images | api `127.0.0.1:18790` | HQ database, auth, and the MCP intake function `/functions/v1/mcp` (`propose_card`, `propose_cards`, `list_cards`). |
| `mail-agent` | node:24-alpine | none | S02E05 mail agent. Volumes `mail-agent-app` (source, read-only at run time) and `mail-agent-data` (journal, sqlite, status log). |
| `agent-tracker` | `agent-tracker:latest` | `192.168.50.63:8765` | Agent tracker; volume `agent-tracker-data`. |
| `harness-live` | python:3-alpine | `192.168.50.63:18083` | Harness-live demo page; volume `harness-live-data`. |
| `mother-console` | mother-console image | `127.0.0.1:8790` | Grok code worker. Mounts `agent-workspace`. |
| `grok-gateway`, `manager`, `job-gateway` (`127.0.0.1:18750`) | custom images | mostly internal | Grok bot dispatch and job plumbing (design: `homelab-2/adr/0012-grok-bot-dispatcher.md`, status Proposed, from records). |
| `ugreen-code-server` | linuxserver/code-server | `192.168.50.63:8443` | Browser editor over `/home/Funky/Dev`. |
| `ugreen-autoheal`, `homelab-uptime-kuma` | autoheal 1.2.0, uptime-kuma 2.5.5 | none | Restarts unhealthy containers; uptime checks. `~/ops/heal-detached-containers.sh` also exists. |
| `supabase_*_10x-astro-starter` | supabase CLI stack | `54321-54324` | Local Supabase for the 10x Astro starter. |

### Everything else (homelab, not course)

Home Assistant (`ugreen-homeassistant-rehearsal`) with mosquitto `11883`; Frigate (`5000`, `18971`); media core (Jellyfin `18096`, Jellyseerr `15055`); streaming gateway rehearsal (prowlarr, radarr, sonarr, pyload, rdtclient on `19696`, `17878`, `18989`, `8000`, `16500`); Immich rehearsal (`12283`); Stackchan (`12800`, `18000`, `3060`); health stack (`health-agent-api` `8088`, `health-bridge` `3050`, `health-supabase` `127.0.0.1:5435`); `stock-5-store-db-1` (`5471`); `librus-bridge` (`3061`); `openclaw-gateway-1`; `statshub` (`29125`); `firefox-app-1` (`5888`). Treat these as the owner's personal services: do not stop, recreate or remove them for course work.

Networks are one compose-default bridge per project (for example `lesson-map_default`, `mega-hq-supabase_default`) plus `bridge`, `host`, `none`. Named volumes live under `/volume1/@docker/volumes/`. DB volumes to protect: `mega-hq-supabase_db-data`, `mega-hq-supabase_db-config`, `stock-5-store_stock5-pgdata`, `health-stack_health-db-data`, `supabase_db_10x-astro-starter`.

### Layout on the host (verified)

- `~/homelab-stacks/<stack>/` holds one compose project each: autoheal, code-server, frigate-rehearsal, grok-gateway, ha2-navigator, homeassistant-rehearsal, job-gateway, **lesson-map**, librus-bridge, manager, media-core-rehearsal, **mega-hq-deck-visit**, **mega-hq-supabase**, **mega-hq-web**, mother-console, mqtt-rehearsal, stackchan-ai, stackchan-firmware-build, stackchan-tamagotchi, streaming-gateway-rehearsal, backups, plus the `fix-ugreen-ownership` service and timer.
- `~/Dev/`: `mega-dev`, `10x-coordinator`, `10x-registry`, `homelab-2`, `health-*`, `limen`, `s01e04-log`, `s01e05-rig`, `mega-hq-dispatch-live`, `mega-hq-overnight-live`, and others.
- `~/repos/mega-hq` (HQ repo, not in any container mount), `~/ops/` (`morning-report`, `mega-card`, heal script), `~/backups`, `~/homelab-backups`, `~/mail-agent-backup-*.tgz`, `~/logs`.
- Cron (verified): one entry, `~/mega-watch.sh` on 17 Nov, notifying through an ntfy topic (topic name is not recorded here).
- Secrets: `~/.config/mega-hq/` (`supabase.env`, `web.env`, `owner.pw`, mode 0600). **Never read or quote that folder.**

## 4. How the repo, the lesson map and the lessons connect

```
challenges/<code>/retro.md  --tools/retro-check-->  tools/lesson-map/data/episodes.json
        --npm run build--> site/ (stamps commit in footer + /version.json)
        --merge to main--> NAS: ~/homelab-stacks/lesson-map/update.sh (git pull main in ~/Dev/mega-dev, rebuild, swap)
        --> nginx container lesson-map  -->  http://192.168.50.63:18082/
```

- Lesson map today: 172 findings from 16 lessons, 10 recurring ideas, 107 applied (live page text). Tabs in `tools.html` per episode are hand-written in `tools/lesson-map/public/tools.html` and ship with the build.
- Repo layout: `challenges/<code>/` for S01E01 to S04E02 (log, handoff, debrief, retro per challenge), `docs/` (`playbook.md`, `lessons-learned.md`, `lessons-index.md`, `didnt-work.md`, `worked.md`, `tools.md`, `environments.md`), `tools/` (about 40 scripts with tests; `docs/tools.md` is the tool register), `hooks/pre-commit` (redaction guard; needs `git config core.hooksPath hooks` per clone), `context/foundation/` (`agent-background.md`, `hq.md`, `environment.md` which is outdated macOS text, and this file), `context/map/` (repo maps), `cards/` (nightly HQ export).
- Course side: MCP `mega-challenge` (login on the host user only). HQ side: ingest scripts in `mega-hq/ingest/` write lessons and solves into Supabase.
- Lessons by episode (verbatim detail in `docs/lessons-learned.md` and the lesson map; memory files hold the NAS-specific ones): S02E05 mail agent and live status log; S03E04 containing prod mistakes (flags, deploy watch, tested backups); S03E05 judging a release (owner vs agent calls); S04E01 payout batch; S04E02 "looks good to me" review.

## 5. Operational story

- **Preview deploys**: none. There is no CI and no preview environment. "Preview" means running a stack locally or the `*-rehearsal` containers on the NAS. The lesson map only changes after a merge to `main` and a manual `update.sh`.
- **Secrets**: env files on the host (`~/.config/mega-hq/`, per-stack `.env` next to each compose file), mode 0600, never in git. `hooks/pre-commit` and `tools/check-all` scan tracked files for tokens. Rotate by editing the env file and recreating the container; HQ proposer tokens are revoked in the app's Settings screen.
- **Rollback**: lesson map: copy `site/` to `site.bak-<date>` before `update.sh` (it backs nothing up itself) and restore that folder. Containers: `docker compose up -d` with the previous image tag (HQ web images are date-tagged, for example `mega-hq-web:20261102-1508`). Databases do not roll back with the code: take a tar of the data volume to `/home/Funky` first (the mail-agent backups show the pattern).
- **Approval**: per `CLAUDE.md`, anything touching a live service, host, account, NAS service or deploy is high risk and needs the owner's explicit yes naming that change. Agents may read (list, logs, `curl`), build locally and commit locally. Push, PR, `gh pr merge` (needs the exact words "merge PR N"), `update.sh`, and any stop/recreate/remove of a container need a yes.
- **Logs**: `mcp__docker-ugreen__fetch_container_logs` for one container; `ssh ugreen 'docker logs --tail 100 <name>'`; mail-agent journal and `/data/statuslog.jsonl` in its data volume; `~/logs/` on the host; uptime-kuma for liveness. After any deploy compare `curl http://192.168.50.63:18082/version.json` with `git rev-parse --short origin/main`.

## 6. Risk register

| Risk | Source | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| Single host: one NAS runs the course stack and 40+ personal services; 23 GiB RAM with about 9.6 GiB available | Research (live) | M | H | Check `free -h` before adding containers; keep rehearsal stacks stopped when not needed (owner decides). |
| No CI and no review gate in mega-hq; `tools/check-all` is local only | Research (`agent-background.md`) | H | M | Run `tools/check-all` before every commit; set `core.hooksPath hooks` in each new clone. |
| `update.sh` pulls `~/Dev/mega-dev`, which had a local edit (`spike-login.md`) on 2026-11-13; it does no backup | Pre-mortem | M | M | `git status` on the NAS clone first; copy `site/` to `site.bak-<date>`; compare `/version.json` after. |
| `docker-ugreen` MCP has remove/recreate tools with no confirm step | Devil's advocate | M | H | Read-only calls by default; destructive calls only with the owner's named yes; never touch DB volumes. |
| Path confusion between host, code-server and mother-console (exit 127) | Unknown unknowns | H | L | Run `tools/whereami`; use repo-root relative paths. |
| Secrets near the repo: `~/.config/mega-hq`, `challenges/S03E02/session.txt`, `.sched/cursors.json` are untracked tokens | Unknown unknowns | M | H | Stage files by name, never `git add -A`; never read the config folder. |
| Funnel is on at `:8443`; anything bound to the LAN (`0.0.0.0` ports like 5000, 8000, 5888) is reachable on the home network | Research (live) | M | M | Do not widen bindings; ask the owner before changing Funnel or tailnet settings. |
| Docs drift: `environment.md` is outdated macOS text; the tooling-split plan names the wrong mount | Research (records) | H | L | Trust `docs/environments.md` and live checks; update this file when a container or port changes. |
| One shared git identity ("Mother Console") on all commits, so git cannot show who decided | Research (records) | H | M | Read plans, PRs and `log.md`; keep the reviewer agent on medium and high changes. |
| `aws-mcp` temptation to connect an admin profile | Unknown unknowns | L | H | Leave disconnected; see memory `aws-mcp-left-disconnected`. |

## 7. Getting started for a new session

1. Read `CLAUDE.md`, then `context/foundation/agent-background.md`, then this file.
2. Run `tools/preflight` and `tools/whereami`.
3. Check the NAS is reachable: `ssh ugreen hostname` (expect `DXP6800PRO-8078`) and `curl -s http://192.168.50.63:18082/version.json`.
4. List what runs: call `mcp__docker-ugreen__list_containers` (save to file, parse with Python) or `ssh ugreen 'docker ps --format "{{.Names}}\t{{.Status}}"'`.
5. Before any NAS change, name it to the owner and wait for the yes; back up the volume or `site/` first.

## 8. Not covered

- Contents of the secret env files, the mega-hq SQL/RLS/RPC coupling, and the internals of the `*-rehearsal` homelab stacks.
- Docker image configuration, CI/CD setup, production-scale architecture.
- Items marked "from records" were not re-checked today (HQ at tailnet `:8445`, the Grok dispatcher status, the Mac mini).
