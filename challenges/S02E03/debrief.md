# S02E03 · schema first — debrief

Solved 2026-11-04 (course sheet: https://hq.mega.dev/challenges/schema-first#debrief). Harness: Claude Code, model claude-sonnet-5-5. The course turned down 1 try before it accepted.

Task: build a remote MCP server of your own (memo, upload, transcribe), put it on a public address, connect it to your own harness, and hand it to the course. The course found it through its published metadata, signed in through your own authorization server, called the tools by their schemas, read a file through the server's own link, and came back hours later.

What happened: the first pass was refused because the transcribe result was too big and its error did not name the url; both were fixed. The owner chose Cloudflare, approved each public step and typed the owner passphrase at every sign-in. The server runs as a Cloudflare Worker (source in `~/s02e03-mcp`, redeploy with `wrangler deploy`); Claude Code has it at user scope as `s02e03-memo`.

Questions:
- Getting a file from your disk to your server: went wrong first. The 8.5 MB course log with the lane line was sent as base64, so the model saw only a link and a size; the 8 MB limit was too small and went to 16 MB. Rule: the server hands out a place to send bytes, and the bytes travel beside the model.
- Letting in a client your server never met: went right. Dynamic client registration and a consent page from the start; only a client let in with the owner passphrase gets a token. The approval page asks for your own sign-in first.
- Errors the model can act on: went wrong first. For a web page as the url the error said "Failed to decode audio file" and never named the url; the course refused it. The error now names the url, its type text/html and what to send instead.
- What a tool result costs your agent: went wrong first. The first transcribe result was 1341 B (transcript twice plus server info); copies were dropped and segments merged, 848 B for the calibration clip.
- Speaking the current MCP revision: went right. The spec page was fetched first; 2026-07-28 is current, with 2025-11-25 and 2025-06-18 kept for older clients.
- Still up when the course came back: went right. Cloudflare and Workers AI were chosen over the NAS speech container, which only the local network could reach.

Snags: 1 result too big and error without the url (right call: read the course's numbers first so each change fixed only what it measured); 2 transcribe could not fetch its own public file link (it now reads its files from the database; unseen move, test result from the server); 3 the first connect link was mistyped when copying and had expired (claimed again, copied exactly); 4 the sign-in page refused the passphrase because of look-alike letters (new one without look-alikes, pasted).

Toolbox: page fetch and Cloudflare Workers were had; added an upload tool on the server, an OAuth provider library, rewritten results and errors. Still missing: nothing. Not yet: a tool to delete notes and files (cleanup needs a local deploy login); taking it back (delete the OAuth grants in the KV namespace or the Worker cuts the course off; a new passphrase only blocks new sign-ins).
Rook: "everything i touch, i touch with these. schema first." and "careful. they're quick." The artifact "Hands" is in the deck (tool contract template and validator).
Takeaway: read the brief's limits on result size and error text before building, because the course measures them. Rotate any passphrase printed in the session, because it stays in the log.
Note: the passphrase and the course's receipts are not recorded here.
