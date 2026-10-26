# MEGA.dev course workspace

Private workspace for the MEGA.dev course (https://hq.mega.dev), worked as a normal project with Claude Code.

## Layout (10x-style)
- `context/foundation/` – stable facts: course setup, tools, conventions
- `context/changes/` – work in flight, one file per change
- `context/archive/` – finished changes
- `challenges/<code>/` – per challenge: log, inputs, outputs, notes
- `cards/` – cards gathered from https://hq.mega.dev/deck
- `docs/` – running notes: `lessons-learned.md`, `worked.md`, `didnt-work.md`, `tools.md`, `CHANGELOG.md`

## Rules
- Never commit sign-in links, tokens or auth files. Redact before commit.
- Update `docs/` in the same commit as the work it describes.
