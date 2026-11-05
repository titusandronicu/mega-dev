# Taking back the S02E03 server (memo, upload, transcribe)

Written 2026-11-05. These steps are for the owner. Nothing here has been run. They cut off the course, delete your data, or both, so run a step only when you mean it. Needs `wrangler` signed in to the Cloudflare account that owns the Worker (`npx wrangler whoami`).

What exists: a Cloudflare Worker `s02e03-mcp` (public address `https://s02e03-mcp.mega-kamil.workers.dev`), a D1 database `s02e03-mcp-db` (notes, uploaded files, file chunks), a KV namespace (OAuth clients, grants and hashed tokens), a secret `OWNER_PASSPHRASE`. The project is `~/s02e03-mcp`; the KV namespace id and the account id are in its `wrangler.jsonc`.

Changing the passphrase is not a take-back: it blocks new sign-ins only, and tokens that were already issued keep working until their grant is gone.

Set this once in the project folder (reads the id from the config):

    cd ~/s02e03-mcp
    KV=$(grep -o '"id": "[0-9a-f]\{32\}"' wrangler.jsonc | head -1 | grep -o '[0-9a-f]\{32\}')

## A. Cut the course off, keep the server and your data
1. See who is let in. Grants are the sign-ins, clients are the registered apps:

       npx wrangler kv key list --namespace-id "$KV" --remote --prefix grant:
       npx wrangler kv key list --namespace-id "$KV" --remote --prefix client:

2. Find the course's client. Read each `client:` key; the value has the client name and redirect addresses:

       npx wrangler kv key get --namespace-id "$KV" --remote "client:<id>"

   Your own Claude Code connection is also a client. Keep it unless you want it gone too.
3. Delete the course client's grant and tokens, then the client. Key shapes are `grant:owner:<grantId>`, `token:owner:<grantId>:<tokenId>` and `client:<clientId>`:

       npx wrangler kv key list --namespace-id "$KV" --remote --prefix "token:owner:<grantId>"
       npx wrangler kv key delete --namespace-id "$KV" --remote "token:owner:<grantId>:<tokenId>"   # each one
       npx wrangler kv key delete --namespace-id "$KV" --remote "grant:owner:<grantId>"
       npx wrangler kv key delete --namespace-id "$KV" --remote "client:<clientId>"

4. Check: a call with the course's old token now returns 401, and `/authorize` for that client id no longer shows a consent page. Your own connection (if you kept it) still works.
5. Rotate the passphrase so a copy in an old log is useless: `npx wrangler secret put OWNER_PASSPHRASE`, then save the new value outside the session log. Paste it, do not retype it, and avoid look-alike letters.

## B. Delete your data, keep the server
Use the server's own tools from your Claude Code session (`memo_search` to list ids, then `memo_delete`; `file_delete` with each link or its 32-character id). They are live. Reconnect the server with `/mcp` first, because a connection made before they were added does not list them. To empty everything at once:

    npx wrangler d1 execute s02e03-mcp-db --remote --command "DELETE FROM file_chunks; DELETE FROM files; DELETE FROM notes;"

Links from `upload` stop working at once; the file page caches for up to an hour at the edge.

## C. Take the whole server down
Run A first if the course should keep seeing a 401 rather than a missing server. Then:

    npx wrangler delete s02e03-mcp
    npx wrangler d1 delete s02e03-mcp-db
    npx wrangler kv namespace delete --namespace-id "$KV"

Deleting the Worker frees `s02e03-mcp.mega-kamil.workers.dev`. Also remove the connection from Claude Code: `claude mcp remove s02e03-memo`.

## After any step
Record the date and what was removed in `challenges/S02E03/log.md` (create it if absent) and note it in the retro. The course notes live on its side; the course sheet says you can delete them once the Challenge is solved.
