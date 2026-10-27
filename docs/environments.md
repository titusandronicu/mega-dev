# Environments
Where work runs, what each place has, and how to tell them apart. Run `tools/whereami` in a shell and paste the output into the log when something fails on one place only.

| Place | What it is | Has | Does not have |
|---|---|---|---|
| UGREEN host (`DXP6800PRO-8078`, user `Funky`) | Direct Claude Code session, repo at `/home/Funky/Dev/mega-dev` | Course MCP login, `ffmpeg`, `tools/*`, gitignored `challenges/*/media/`, docker (HQ stack) | |
| Mother Console container (`mother-console`, user `root`) | Grok code worker. Mounts `/home/Funky/agent-workspace` at `/data/workspace` (checked 2026-10-27) | `bash`, `awk`, `git`, `node` | The repo (`mega-dev` is not in `/data/workspace`), `ffmpeg`, course MCP |
| code-server (`ugreen-code-server`, user `root`, :8443) | Browser editor. Mounts `/home/Funky/Dev` at `/workspace`, so the repo is at `/workspace/mega-dev` (checked 2026-10-27) | Repo and `media/`, `bash`, `awk`, `git` | `ffmpeg`, `node`; the host path `/home/Funky/Dev/mega-dev` does not exist here |
| Mac mini | Same repo clone; headless browser session for deck and forms | Course browser session | `media/` (gitignored), unless copied. Unchecked |

## Rules
- Host path is `/home/Funky/Dev/mega-dev`; in code-server it is `/workspace/mega-dev`. Use `tools/whereami` to see which one you are in.
- Scripts use relative paths (`tools/...`, `challenges/...`): run them from the repo root, or use the full path.
- `challenges/*/media/` is gitignored, so recordings exist only where they were downloaded. `tools/speech-offsets` and `tools/transcribe` need them locally.
- An exit 127 means "command not found": wrong folder or an old checkout. Run `tools/whereami` before guessing.
- Update this table when a place is added or a fact is checked. Facts marked "Unchecked" are not verified.

## Open
- Likely cause of the 127 on 2026-10-27: the dry run was started in a shell that was not in the repo folder. In code-server the repo is `/workspace/mega-dev`, and `tools/retro-check` from `/tmp` gives exit 127 there (reproduced). Not confirmed which shell the owner used.
- `context/changes/2026-10-27-tooling-split.md` says Mother Console mounts `/home/Funky/Dev` at `/data/workspace`; the live mount is `/home/Funky/agent-workspace`. Correct that plan before Part B.
