# Prep notes (archived)

Six daily prep notes written by an automated, read-only routine, one branch per day (`claude/prep-<date>`, author "Claude", about 04:11 UTC). Each run tried to read the course site before the day's Challenge opened. It could not: `hq.mega.dev` was unreachable from the routine's sandbox (network allowlist, proxy 403 or DNS, depending on the day). So each note holds the repo-side checklist and the open questions for the student, and no Challenge content.

The branches were never merged and never had a pull request, and the first five had a git history unrelated to `main`. On 2026-11-03 the notes were archived here, byte for byte as they were on each branch tip, and the six branches were removed after this folder was merged. Each branch also appended one line to `docs/CHANGELOG.md`; those lines are quoted in the table instead of being added to the changelog.

| Date | Note | Source branch | Tip commit | Commit subject | Line the routine added to the changelog |
|---|---|---|---|---|---|
| 2026-10-27 | [2026-10-27.md](2026-10-27.md) | `claude/prep-2026-10-27` | `8e0b563` | Daily prep 2026-10-27 (hq.mega.dev unreachable) | 2026-10-27: prep agent drafted challenges/2026-10-27/prep.md; hq.mega.dev unreachable (403/DNS), no content read. |
| 2026-10-28 | [2026-10-28.md](2026-10-28.md) | `claude/prep-2026-10-28` | `b97ead1` | Daily prep 2026-10-28 | 2026-10-28: daily prep draft challenges/2026-10-28/prep.md (hq.mega.dev not reachable from the routine: host not in allowed network domains). |
| 2026-10-29 | [2026-10-29.md](2026-10-29.md) | `claude/prep-2026-10-29` | `5ab43d4` | Prep 2026-10-29: hq.mega.dev unreachable, checklist only | 2026-10-29: Daily prep run could not reach hq.mega.dev (network blocked); wrote challenges/2026-10-29/prep.md with playbook checklist only, no Challenge content. |
| 2026-10-30 | [2026-10-30.md](2026-10-30.md) | `claude/prep-2026-10-30` | `29bcaa5` | Prep notes for 2026-10-30 (hq.mega.dev unreachable) | 2026-10-30: automated prep run for the day's Challenge; hq.mega.dev unreachable from the routine (network policy), so challenges/2026-10-30/prep.md has repo-side checklist only. |
| 2026-11-02 | [2026-11-02.md](2026-11-02.md) | `claude/prep-2026-11-02` | `a6cbdcb` | Daily prep 2026-11-02 (hq.mega.dev unreachable) | 2026-11-02: daily prep draft (challenges/2026-11-02/prep.md); hq.mega.dev unreachable from the routine sandbox (network allowlist), so Challenge content not read. |
| 2026-11-03 | [2026-11-03.md](2026-11-03.md) | `claude/prep-2026-11-03` | `ef3757a` | Prep 2026-11-03: hq.mega.dev unreachable | 2026-11-03: automated prep run; hq.mega.dev unreachable (403 proxy / DNS), wrote challenges/2026-11-03/prep.md from repo only. |

The tip commits stay on GitHub for a while after the branches are deleted; `git fetch origin <sha>` fetches one while it exists. After that, this folder is the only copy.
