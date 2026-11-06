// One-off: make the agent's inbox. Idempotent: reuses an inbox with the same username. Prints the address only.
// Usage: AGENTMAIL_API_KEY=... node src/create-inbox.mjs <username> [display name]
import { requestJson } from './http.mjs';

const key = process.env.AGENTMAIL_API_KEY;
const username = process.argv[2];
if (!key) { console.error('missing AGENTMAIL_API_KEY'); process.exit(1); }
if (!/^[a-z0-9][a-z0-9._-]{2,40}$/.test(username ?? '')) { console.error('usage: create-inbox.mjs <username: 3-41 chars a-z 0-9 . _ ->'); process.exit(1); }

const headers = { authorization: `Bearer ${key}`, 'content-type': 'application/json' };
const base = 'https://api.agentmail.to/v0/inboxes';
const list = await requestJson(`${base}?limit=100`, { headers });
const want = `${username}@agentmail.to`;
const have = (list.inboxes ?? []).find((i) => (i.email ?? i.inbox_id) === want);
if (have) { console.log(`exists: ${have.email ?? have.inbox_id}`); process.exit(0); }
const made = await requestJson(base, { method: 'POST', headers, body: JSON.stringify({ username, display_name: 'Mail agent' }) }, { retries: 0 });
console.log(`created: ${made.email ?? made.inbox_id}`);
