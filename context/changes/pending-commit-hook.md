# Pending: pre-commit token check
Install a git pre-commit hook that runs `node .claude/skills/read/scripts/redact.mjs --check` on staged `.md` files and blocks the commit if a token or magic link is found. Waiting for the human's go-ahead ("add the hook").
