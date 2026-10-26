# Environment (facts that live outside this repo)
- GitHub account: titusandronicu. Repo: https://github.com/titusandronicu/mega-dev (private).
- Local repo `~/mega-dev`. `~/Desktop/MEGA` is not writable from the shell (macOS).
- Claude Code memory (not in the repo): `~/.claude/projects/-Users-kamilnowosad-Desktop-MEGA/memory/` holds the playbook and repo notes.
- Headless browser: `~/.claude/skills/browser-automation/browser.mjs --session mega` (throwaway profile, closed when done).
- Course MCP `mega-challenge` is configured locally; cloud routines cannot use it.
- Session-only items that vanish when Claude Code closes: the overnight cron job, the `caffeinate` process.
- Git hook: `git config core.hooksPath hooks` (local setting; repeat it on a new clone). `hooks/pre-commit` blocks tokens.
