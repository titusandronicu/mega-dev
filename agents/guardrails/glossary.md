# guardrails glossary

What a word means here. The why lives in `memories.md`. Keep this short.

- **token**: a course sign-in credential. Three shapes are known: `v1.<base64>.<base64>`, the value of a query parameter named token, and a `/magic-link/activate` address. Anything else is not a token to the guard.
- **magic link**: a sign-in address ending in `/magic-link/activate`. The whole address counts as a secret, not only its query.
- **guard**: `hooks/pre-commit`. It checks staged content (not the working tree) and blocks the commit when it finds a token. Only the token check can block.
- **gate**: `tools/check-all`. The one blocking check before a merge. It is not run as a blocker by the guard.
- **advisory**: reports a problem but does not stop the commit. The guard's call to the gate is advisory.
- **allowlisted file**: a path listed in `hooks/token-allowlist`. It may carry a course signature ticket. The guard exempts only its `signature:` lines; the gate skips the whole file.
- **signature ticket**: the course-issued proof on a `signature:` line of a signed page. Keep it exactly as given.
- **hooksPath**: the per-clone git setting (`core.hooksPath hooks`) that turns the guard on. Not stored in the repo.
- **self-test**: `redact.mjs --self-test`. Prints `self-test ok`. Run it after any edit to `redact.mjs`.
