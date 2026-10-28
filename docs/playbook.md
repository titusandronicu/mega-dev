# Challenge playbook (from S01E01)
Before the first send
1. Find the contract. Check page HTML for links (schema.json, service-desc, describedby) and form fields. A file marked "unavailable" on screen may still have a real link in the source. Quote it before building a body.
2. Never send a guess to learn from the error. Each refusal can cost a try (S01E01 burned 5).
3. Read the question literally. "I asked what they shipped" was a fact lookup, not a question about me.

When cutting text to a limit
1. Write the keep list first (copy, never retype).
2. Count with a script (characters, limit, how much must go).
3. Show the human every cut before posting. Log what the server says was lost.

Facts that change (newest model, version, price)
1. Say the memory answer and how sure, then check a live page from the maker. Cite URL and date.
2. Course lesson text can be stale. Trust a dated live source over it.
3. Ask the human before changing an answer already sent.

Recording challenges (from S01E02)
1. Start with `tools/transcribe <file>` (local, no key). Do not ask for an API key before trying it.
2. Confirm any sentence offset with `tools/speech-offsets <file>`; never take a model's own timestamp. Take words by majority across several runs.
3. Answer only the event asked. Recordings say decoy times aloud (scheduled, started, first report) next to the real one.

Session hygiene
- Keep the log in the repo, tokens redacted. One log file per challenge.
- Browser: headless session via browser-automation skill; magic link opened once; use refs for clicks.
- Brave profile and ~/Desktop are not writable from the shell; work in ~/mega-dev.
- One short message per step, headed with the step number; end with Needed from you.

Filing and closing tickets, rendering a kb (from S01E03)
1. `tools/preflight` at the start of the session, before relying on `gh`/node's ICU.
2. Before filing more than one ticket from one analysis: `tools/subset-check <counts.json>` on the id-sets - two tickets whose ids overlap are one problem filed twice, and that's what a "the same problem" rejection means, not similar-sounding fix text.
3. Before filing each draft: `tools/safe-issue-refs <draft.md> <owner/repo>` - a bare `#N` can silently autolink to an unrelated existing issue.
4. If the brief asks for a rendered page, not just source: `tools/scaffold-kb-render <kb-root-dir>`, then build and read the actual HTML. The rendered page is the product; a computed number you never looked at in the browser isn't checked yet.
5. After every `claim-challenge` call: `tools/record-claim <code> <reply.json>` first (status can be `progress`, not just solved/rejected), then act on exactly what it tells you.
6. Before any `claim-challenge` call after the first: `tools/pre-claim-gate <code>`. It will refuse until a human has re-read the challenge's live page since the last non-solved reply - a byte-identical re-download does not mean the page is unchanged.
7. Closing a ticket: `tools/close-ticket <owner/repo> <issue> <completed|not-planned> <comment-file>` - never close without an explicit reason; the course checks "fixed" vs "won't fix", not just "closed".
8. Never call `rook` yourself, or to work on a Challenge - its own tool description forbids both.

Next: S01E02 opens Tue 27 Oct 05:00 CET. Run mega-start, read the whole startPoint before the first call, install the `read` skill first.

Skill commands (from the repo root)
- Contract: save the signed-in page with save-page.mjs, then find-contract.mjs <file> --base <url>. See .claude/skills/read/SKILL.md, "Project rules".
- Cuts: cut-diff.mjs original short --keep-file keep --max-chars N. Replay example: challenges/S01E01/keep.txt.
- Before commit: redact.mjs --check on the files you changed.
- --open has no cookies: read contracts behind the sign-in from the browser session.
