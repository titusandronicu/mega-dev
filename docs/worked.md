# What worked
- Reading `schema.json` from the page HTML (`/challenges/where-the-story-begins/api/schema.json`) instead of guessing the shape.
- Running the form and API calls from inside the signed-in headless page with `fetch`, so cookies apply.
- Logging every request and reply to `challenges/<code>/log.md` as we go.
