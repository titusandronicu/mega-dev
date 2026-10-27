# What worked
- Reading `schema.json` from the page HTML (`/challenges/where-the-story-begins/api/schema.json`) instead of guessing the shape.
- Running the form and API calls from inside the signed-in headless page with `fetch`, so cookies apply.
- Logging every request and reply to `challenges/<code>/log.md` as we go.
- 2026-10-27: creating the HQ proposer token with the owner JWT over the REST RPC, keeping the token in a 0600 file and never printing it.
- 2026-10-27: loading lessons and challenges with the repo's own `ingest.mjs` (dry run first, secret scan built in).
