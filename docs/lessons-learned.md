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
