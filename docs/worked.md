# What worked
- Reading `schema.json` from the page HTML (`/challenges/where-the-story-begins/api/schema.json`) instead of guessing the shape.
- Running the form and API calls from inside the signed-in headless page with `fetch`, so cookies apply.
- Logging every request and reply to `challenges/<code>/log.md` as we go.
- 2026-10-27: creating the HQ proposer token with the owner JWT over the REST RPC, keeping the token in a 0600 file and never printing it.
- 2026-10-27: loading lessons and challenges with the repo's own `ingest.mjs` (dry run first, secret scan built in).
- 2026-11-02 (S02E01): a Stop-hook gate that re-lists the session archive caught the late session 5d8a1f37 (database `reorder_3hnq`) before the stop; tested with a real change and a forced change. Script: `~/s02e01/gate/archive-gate.py`.
- 2026-11-02 (S02E01): verify against the NAS store printed PostgreSQL 17.11, md5 `8f03e343...`, port 5471 before the claim; the password stayed in `DATABASE_URL`, never in the files sent.
