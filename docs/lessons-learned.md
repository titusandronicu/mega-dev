# Lessons learned
1. When a server says "don't guess", find the stated spec first (here: the attachment link hidden behind `#attachment-unavailable`).
2. Count limits with a tool. Show every cut to the human.
3. A form field can ask for something that is not true of you. Ask the human before answering.
4. Read a refusal literally: "what they shipped" is a fact lookup, not a question about me. Search, then confirm with the human before changing an answer.
5. 'Certainty' hint: course pages and my own training can be stale. For 'latest X' questions, search the live web and cite the date.
6. Debrief rule of thumb: record the exact refusal text per snag; the refusal usually names its own fix ("line 06", "count again", "today's paper").
7. See docs/playbook.md for the checklist to run at the start of each challenge.
8. Creating a cloud routine attached all 11 claude.ai connectors by default (Gmail, Drive, Notion...) although none were requested. Always check mcp_connections in the create reply and clear them (clear_mcp_connections) for agents that read the web.
9. Test a claim on the real page before writing it down: I first said the schema was a plain link; the real page declares it in a <link rel=service-desc>, and the original script already found it.
10. Clean up test commits with path-limited commands. `git reset --hard` also discards uncommitted edits (it wiped my redact.mjs change once).
11. A sign-in link belongs to the browser that asked for it. A machine that did not ask gets 403; ask from the machine that needs the session.
12. Check the real constraint before you grant things: the HQ `proposers.allowed_tools` check allows three tools only, so the first token request failed. Read the migration first.
13. A first load can look done and still show an empty screen (Task screen with no steps). Open the consuming screen's data columns before calling it loaded.
14. Check which machine you are on (`hostname`, `ip`, running containers) before saying "this machine is not the server".
15. After a 429, stop. Each extra request can extend the block.
16. Model timestamps for speech were unreliable (the same sentence at 19.7 s, 64.9 s and 119.6 s depending on the model). Confirm offsets with `ffmpeg silencedetect`; take word content by majority across several runs.
17. A bot told "read-only, no shell" still ran shell commands when launched with `--yolo`. Do not rely on a prompt as a guardrail; do not give that worker untrusted input.
18. Read a secret out of another service only with the owner's explicit OK for that secret, hold it in memory, and never write it down.
19. PostgREST connects as a role with `pg_safeupdate` preloaded, so an `UPDATE` or `DELETE` without a `WHERE` fails there ('UPDATE requires a WHERE clause') but passes local pgTAP, which runs as `postgres`. Give single-row updates a real predicate, and keep the migration lint test (`shared/migrations-where.test.mjs` in mega-hq).
20. When two screens show the same number, put the rule in one helper. Today printed the stored step count while Task counted a solved challenge as fully done, so a solved S01E02 read 0 / 6 on one screen and 6 / 6 on the other (`web/src/lib/progress.ts`).
21. Check a deployment's claims against the running thing, not only the tests: a live read showed S01E01 with no notes after a 'done', and a served-bundle grep showed the web container still on the old build.
22. An OAuth loopback callback binds to the container's own `localhost`, not the human's browser's. When the agent's shell and the human's browser aren't on the same host, the only way to finish the flow is to hand the failed-redirect URL back and deliver it with `curl` from inside the container — plan for that hand-off, don't assume `--no-browser` paste-back alone gets you there.
23. A download gated behind a browser sign-in (no API) has to move through whatever channel the agent has, even a bad one: shipped S01E03's kb export as checksummed base64 chunks over an ~8000-char prompt limit, ~3 min per chunk. Fine once; a real system needs a proper file-transfer or signed-in-browser path.
24. "Logged in everywhere" doesn't mean every CLI is even installed. `gh` was missing entirely from the console's base image; check presence before assuming auth is the only gap.
