# guardrails memories

Seeded 2026-11-18 from git history and the repo's own notes. Receipts are commits or files.

## Internal engineering

- **The guard is per clone.** `core.hooksPath` is a local git setting, not in the repo. On a clone where `git config core.hooksPath hooks` was never run, the hook does not fire and nothing blocks a token.
  Receipt: `context/archive/2026-10-26-pre-commit-hook.md`; `context/foundation/environment.md`; added in `83e1eaa`.
- **The hook depends on one skill file.** `hooks/pre-commit` calls `.claude/skills/read/scripts/redact.mjs` through the `CHECK` variable. If that file is moved or renamed, the `node` call fails and every commit is blocked (inferred from the code, not run).
  Receipt: `hooks/pre-commit` line `CHECK=...`; `context/map/repo-map.md`; `83e1eaa`.
- **It only knows three token shapes.** A `v1.<base64>.<base64>` token, the value of a query parameter named token, and a `/magic-link/activate` address. A new shape needs a new pattern in `redact.mjs` plus a self-test case.
  Receipt: `context/archive/2026-10-26-pre-commit-hook.md` ("Limit"); `redact.mjs` `PATTERNS`.
- **`redact.mjs` is exempt from its own check.** It holds sample tokens for its self-test, so the hook skips it and `check-all` filters it out. Do not add real-looking tokens to any other test file.
  Receipt: `hooks/pre-commit` (`SELF`); `tools/check-all`; `7712877`.
- **A token-like literal in a test breaks the gate.** A test literal that looked like a signed token failed the token scan; the fix was to build the fake token at runtime. Same cause hit the rehearsal script, fixed by quoting the mock value.
  Receipt: `580143a`; `7712877`.
- **Hook and `check-all` treat the allowlist differently.** The hook exempts only lines starting `signature: ` in listed files. `check-all` drops the listed files from the scan entirely. A token on any other line of an allowlisted file is caught by the hook but not by `check-all`.
  Receipt: `hooks/pre-commit` (`staged()`); `tools/check-all` (`allow=`, `grep -Fvxf`); `7712877`.
- **The `check-all` call in the hook is advisory.** It prints a warning and does not block. Only the token check sets the exit status, so a failing lint or test never stops a commit through the hook.
  Receipt: `hooks/pre-commit` last block; `7712877` (named `check-all` the one blocking gate before merge, not before commit).
- **Never clean up with `git reset --hard`.** It wiped an uncommitted `redact.mjs` edit during testing. Reset single paths instead.
  Receipt: `context/archive/2026-10-26-pre-commit-hook.md` ("Mishap").
- **Self-tests are not in CI.** `redact.mjs --self-test` runs only when someone runs it; there is no CI. After any edit to `redact.mjs`, run it and expect `self-test ok`.
  Receipt: `context/map/repo-map.md` ("Unknown"); `.claude/skills/read/README.md`.
- **Filenames with spaces are not handled.** The hook loops over `git diff --cached --name-only` unquoted, so a staged name with a space is split and mis-checked (read from the code, not run).
  Receipt: `hooks/pre-commit` `for f in $(...)`.
- **Committing guardrails files runs their checks, and can block.** When a commit stages `agents/guardrails/`, `.claude/agents/guardrails.md` or `.claude/settings.json`, the hook runs `check-wake.sh` and `check-scenarios.sh 2` and blocks on failure. It tests the working tree, not the staged copy, and takes a few minutes. Skip once with `SKIP_GUARDRAILS_CHECK=1`; it is skipped with a warning if `claude` is not installed.
  Receipt: `hooks/pre-commit` (guardrails block).

## Owner-facing rules

- **The repo is public.** It was made public after a full-history secret scan found 0 leaked commits in 30. Anything committed now is public; a leaked token is a rotate-now event, not a revert.
  Receipt: `challenges/S01E03/log.md` (Phase 3a); `83e1eaa`.
- **Signed pages carry the ticket on purpose.** The course wants the signature ticket exactly as given on a `signature:` line, so those pages are allowlisted. Do not "clean" that line.
  Receipt: `hooks/token-allowlist` header; `83e1eaa`.
- **Pushes and merges need an owner yes.** Outside actions (push, PR, merge) wait for an explicit yes; low and medium risk may merge on green, high risk needs the owner.
  Receipt: `CLAUDE.md`; `challenges/S03E03/retro.md`; `7712877`.
