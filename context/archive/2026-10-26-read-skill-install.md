# `read` skill installed and adapted (done 2026-10-26)
Location: `.claude/skills/read/` (project skill, tracked in this repo). Commit f7c8b33.
Rook's files kept; local changes are listed in `.claude/skills/read/README.md`:
anchor detection in find-contract, `save-page.mjs`, `redact.mjs`, project rules in SKILL.md.
Checks run: three `--self-test` passes; real signed-in S01E01 page parsed; cut-diff replay of S01E01 (1288 -> 669).
Known limit: `find-contract --open` sends no cookies, so contracts behind the sign-in must be read from the browser session.
