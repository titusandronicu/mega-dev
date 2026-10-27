---
project: mega-hq
checked_at: 2026-10-27T15:25:48Z
health_status: healthy
context_type: brownfield
language_family: multi
stack_assessment_available: false
checks_run:
  - lockfile
  - dependency_audit
  - outdated_deps
  - test_runner
  - ci_cd
  - configuration
audit_findings:
  critical: 0
  high: 0
  moderate: 0
  low: 0
test_runner_detected: true
ci_provider: null
recommended_fixes: 7
---
# Health check: mega-hq (checked from mega-dev, read-only)

Checked checkout: `/home/Funky/repos/mega-hq` at `a0f0bfd`, UGREEN host. The skill writes into the repo it runs in; this report sits in `mega-dev` on purpose so the mega-hq checkout (which had staged work from another session) stayed untouched. No fixes were run. mega-dev itself has no package marker (bash, python, markdown), so the skill does not apply to it.

## Dependency Health

### Lockfile
Status: present for `web/` (`web/package-lock.json`). The root `package.json` has no dependencies (Node built-ins only), so it needs none.
Package manager: npm

### Security Audit
Tool: `npm audit --json` in `web/`
Summary: 0 CRITICAL, 0 HIGH, 0 MODERATE, 0 LOW (671 packages: 218 prod, 353 dev, 101 optional, 10 peer)
Direct vs transitive: no findings to split.
Blind spot (unknown): the Deno edge function `supabase/functions/mcp` is not covered by `npm audit`; its imports were not audited here.

### Outdated Dependencies
Packages with major version gaps: 4 of 8 outdated (the rest are patch bumps).
- **typescript**: 5.9.3 → 7.0.2 (2 major versions behind)
- **@types/node**: 22.20.5 → 26.6.5 (4 major versions; matches `engines.node >=22` and `.nvmrc` 22, so likely deliberate)
- **eslint** and **@eslint/js**: 9.39.5 → 10.x (1 major version)

## Test Suite
Test runner: Vitest 5.0.5 (web), `node --test` (shared, ingest, export), pgTAP via `supabase test db`, `deno test` (edge function)
Tests found: 242 web tests (`npx vitest list`); 14 Node test files (shared 3, ingest 7, export 4); 8 pgTAP files; 5 Deno test files
Test execution: not attempted. Tests were enumerated, not run; pgTAP and Deno tests need the local Supabase stack.
Configuration: `web/vitest.config.ts`, `web/playwright.config.mjs`, `web/playwright.container.config.mjs`
Framework: Vitest 5.0.5, Playwright 1.64.1, Testing Library (React 16.3.3), axe-core for accessibility checks in e2e.
Local gate: `make validate` (docs checks via `scripts/validate.sh`, Node tests, pgTAP, Deno tests). Web: `npm run lint && npm run typecheck && npm test && npm run e2e` in `web/`.

## CI/CD
Provider: not detected
Configuration: not found (no `.github/`, no pipeline files tracked)

| Stage      | Status | Notes                                                  |
|------------|--------|--------------------------------------------------------|
| Lint       | ✗      | ESLint exists locally (`npm run lint`), not in CI      |
| Test       | ✗      | runs locally only (`make validate`)                    |
| Build      | ✗      | `npm run build` / `deploy/web/deploy.sh`, manual       |
| Type check | ✗      | `astro check` locally                                  |
| Security   | ✗      | `npm run audit:prod` locally                           |

The only enforcement is discipline: nothing runs on push or PR.

## Configuration
### High severity
None. `web/tsconfig.json` extends `astro/tsconfigs/strict` and adds `noUncheckedIndexedAccess`; `.gitignore` covers `.env` (only `.env.example` files are tracked, and `scripts/validate.sh` fails if an env file is tracked).

### Medium severity
- **Formatter** (no Prettier or Biome config) — formatting will drift between agent sessions. Fix: add one formatter to `web/` and run it once in a separate commit.
- **`CLAUDE.md` / `AGENTS.md`** — none in mega-hq, so a session started there has no rules, env facts or "run make validate" pointer.

### Low severity
- **`.editorconfig`** — missing. Fix: add a 6-line file (utf-8, lf, 2-space indent).
- **Node version** — this host runs Node v26.12.0 while `.nvmrc` and `engines` say 22. Tests passing here do not prove they pass on 22.

## Stack Assessment Cross-Reference
No stack-assessment.md found. Run /10x-stack-assess for quality-gate analysis.

## Recommended Fixes
Single ranked list (this is the owner's own tool, not a course project, so no A/B split).

### 1. Add a CI pipeline that runs the existing local gate
**Impact**: every check exists but nothing enforces it; an agent's push is never verified.
**Severity**: medium
**Effort**: moderate (15–30 min)
**Fix**: add `.github/workflows/ci.yml` that runs `make validate`, then `cd web && npm ci && npm run lint && npm run typecheck && npm test`, on Node 22. The Supabase CLI and Docker are available on GitHub runners for pgTAP.

### 2. Add an agent instruction file to mega-hq
**Impact**: a session opened in mega-hq has no rules or environment facts.
**Severity**: medium
**Effort**: quick (< 5 min)
**Fix**: create `CLAUDE.md` listing: `make validate`, the web commands above, the Supabase/Deno requirement, "no secrets", and a pointer to `mega-dev/docs/environments.md` and `context/map/mega-hq/`.

### 3. Run the full suites once on Node 22
**Impact**: this host's Node 26 may hide breakage on the pinned version.
**Severity**: low
**Effort**: quick (< 5 min)
**Fix**: `cd web && npx -y node@22 ./node_modules/.bin/vitest run`, and `npx -y node@22 --test "shared/*.test.mjs" "ingest/*.test.mjs" "export/*.test.mjs"` at the repo root.

### 4. Add a formatter
**Impact**: inconsistent style from different agent sessions.
**Severity**: medium
**Effort**: moderate (15–30 min)
**Fix**: `cd web && npm i -D -E @biomejs/biome && npx biome init`, format once in its own commit.

### 5. Plan the ESLint 10 and TypeScript 7 upgrades as their own change
**Impact**: 1–2 major versions behind; later upgrades get harder.
**Severity**: low
**Effort**: significant (> 1 hour)
**Fix**: upgrade one at a time on a branch with `npm run lint && npm run typecheck && npm test` as the gate. Leave `@types/node` at 22 while Node 22 is the target.

### 6. Check the Deno edge function's imports
**Impact**: `npm audit` does not see them, so vulnerabilities there are unknown.
**Severity**: low
**Effort**: moderate (15–30 min)
**Fix**: list imports with `deno info supabase/functions/mcp/index.ts`, pin versions, and review them against advisories.

### 7. Add `.editorconfig`
**Impact**: editor defaults differ between code-server and the Mac.
**Severity**: low
**Effort**: quick (< 5 min)
**Fix**: add `.editorconfig` with `root = true`, `charset = utf-8`, `end_of_line = lf`, `indent_style = space`, `indent_size = 2`.

## Summary
Health status: healthy

The web app has a clean dependency audit (0 findings in 671 packages), a working test setup (242 web tests enumerated plus Node, pgTAP and Deno suites) and strict TypeScript. The gaps are around enforcement: no CI, no formatter, no agent instruction file, and the Node 22 target is not exercised on this Node 26 host. Tests were listed, not run, and the Deno function is outside the audit.

Next step: add CI and a `CLAUDE.md` to mega-hq (fixes 1 and 2), then run the suites on Node 22 (fix 3).
