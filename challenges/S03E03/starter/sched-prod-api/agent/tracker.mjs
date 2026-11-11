#!/usr/bin/env node
// The only door from the agent to the tracker and to the live API. Token comes from the environment and is never printed.
// Usage: node agent/tracker.mjs <cmd> [args]
//   issues | issue <n> | comment <n> <body> | label <n> <label> | close <n>
//   records | record <id> | put-record <id> <file> | shiplog | ship <n> <verb> <live ✓|✗> <risks...>
//   live <path>        GET <LIVE_URL><path> and print status + body
import { readFileSync } from 'node:fs';
const { TRACKER_URL, TRACKER_TOKEN, LIVE_URL } = process.env;
const VERBS = ['shipped', 'declined', 'closed', 'asked', 'waiting'];
export async function api(path, method = 'GET', body) {
  const res = await fetch(TRACKER_URL.replace(/\/$/, '') + path, {
    method,
    headers: { Authorization: `Bearer ${TRACKER_TOKEN}`, 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${typeof data === 'string' ? data : data.message ?? text}`);
  return data;
}
export function shipLine(n, verb, live, risks) {
  if (!VERBS.includes(verb)) throw new Error(`verb must be one of ${VERBS.join(', ')}`);
  if (!['✓', '✗'].includes(live)) throw new Error('live must be ✓ or ✗');
  if (!risks) throw new Error('open risks: give "none" or "<issue id> <who reads it>"');
  // An ask says only that the agent asked: nothing built, no risks listed (S03E03 round 2, built_before_answer).
  if (verb === 'asked' || verb === 'waiting') { live = '✗'; risks = 'none'; }
  return `#${n} · ${verb} · live: ${live} · open risks: ${risks}`;
}
async function main() {
  const [cmd, a, b, ...rest] = process.argv.slice(2);
  const out = (x) => console.log(typeof x === 'string' ? x : JSON.stringify(x, null, 1));
  switch (cmd) {
    case 'issues': return out(await api('/issues'));
    case 'issue': return out(await api(`/issues/${a}`));
    case 'comment': return out(await api(`/issues/${a}/comments`, 'POST', { body: [b, ...rest].join(' ') }));
    case 'label': return out(await api(`/issues/${a}/labels`, 'POST', { label: b }));
    case 'close': return out(await api(`/issues/${a}/close`, 'POST'));
    case 'records': return out(await api('/records'));
    case 'record': return out(await api(`/records/${a}`));
    case 'put-record': return out(await api(`/records/${a}`, 'PUT', { text: readFileSync(b, 'utf8') }));
    case 'shiplog': return out((await api('/shiplog')).text);
    case 'ship': return out(await api('/shiplog', 'POST', { line: shipLine(a, b, rest[0], rest.slice(1).join(' ')) }));
    case 'live': {
      const res = await fetch(LIVE_URL.replace(/\/$/, '') + a);
      return out(`${res.status}\n${await res.text()}`);
    }
    default: console.error('unknown command'); process.exit(2);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(String(e.message ?? e)); process.exit(1); });
