# Pre-commit token check (done 2026-10-26)
- `hooks/pre-commit` runs `redact.mjs --check --stdin` on the staged content of every committed file and blocks the commit if a course token or magic link is found. It skips `redact.mjs` itself, which holds sample tokens for its self-test, and binary-looking files.
- Install on a new clone: `git config core.hooksPath hooks` (this setting is local, so it is not in the repo).
- Tested: a staged file with a fake token is blocked (exit 1, HEAD unchanged); a clean file commits.
- Limit: it only knows the token shapes in `redact.mjs` (a course token of the form v1 plus two long base64 parts, a token query value, and a magic-link activate address). A new shape needs a new pattern there and a self-test case.
- Mishap while testing: a cleanup `git reset --hard` wiped an uncommitted edit of `redact.mjs`; I re-applied it and re-ran the self-test. Use `git reset` of single paths for cleanup, not `--hard`.
