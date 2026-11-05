// mcp-call.mjs -- run through tools/mcp-call (bash wrapper). Usage below.
// Usage:
//   MCP_URL=<url> tools/mcp-call list
//   MCP_URL=<url> tools/mcp-call call <tool> '<json args>'     (args: inline JSON, @file, or - for stdin)
//   tools/mcp-call --url-file <file> [--log <file>] [--raw] list|call ...
// Talks to a remote MCP server over Streamable HTTP with no MCP client: initialize,
// notifications/initialized, then one request. Handles the Mcp-Session-Id header and
// JSON or SSE replies. The URL is a key for some servers (course job links): read it from
// MCP_URL or --url-file, never from argv, so it stays out of `ps` and shell history.
// The log masks the URL and anything shaped like a signed token (v1.<...>); stdout keeps
// the reply whole, so a receipt is printed once and never written to the log.
// Exit codes: 0 ok, 1 tool returned isError, 2 transport or protocol failure, 64 bad usage.
import { readFileSync, appendFileSync } from 'node:fs';

const argv = process.argv.slice(2);
let urlFile, logFile, raw = false;
const rest = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--url-file') urlFile = argv[++i];
  else if (argv[i] === '--log') logFile = argv[++i];
  else if (argv[i] === '--raw') raw = true;
  else rest.push(argv[i]);
}
const die = (code, msg) => { process.stderr.write(msg + '\n'); process.exit(code); };
const url = (process.env.MCP_URL || (urlFile && readFileSync(urlFile, 'utf8').trim()) || '').trim();
if (!url || !['list', 'call'].includes(rest[0]) || (rest[0] === 'call' && !rest[1])) {
  die(64, 'usage: MCP_URL=<url> tools/mcp-call [--url-file f] [--log f] [--raw] list | call <tool> [json|@file|-]');
}

const mask = (s) => String(s)
  .split(url).join('<url>')
  .replace(/v1\.[A-Za-z0-9_-]{16,}(\.[A-Za-z0-9_-]+)*/g, 'v1.<masked>');
const log = (line) => { if (logFile) appendFileSync(logFile, mask(line) + '\n'); };

let sessionId, protocolVersion = '2025-06-18', nextId = 1;
async function post(body) {
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
  if (sessionId) headers['mcp-session-id'] = sessionId;
  if (sessionId || body.method !== 'initialize') headers['mcp-protocol-version'] = protocolVersion;
  let res;
  try {
    res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  } catch (e) {
    const cause = e.cause?.message || e.message;
    die(2, `request failed: ${mask(cause)}${/403|tunnel|proxy/i.test(cause) ? ' (a proxy or network policy may block this host: allow it, do not route around it)' : ''}`);
  }
  const sid = res.headers.get('mcp-session-id');
  if (sid) sessionId = sid;
  const text = await res.text();
  log(`> POST ${url} ${JSON.stringify(body)}`);
  log(`< ${res.status} ${text.slice(0, 4000)}`);
  if (!res.ok) die(2, `HTTP ${res.status}: ${mask(text.slice(0, 300))}`);
  if (body.id === undefined) return null; // notification: nothing to read
  const ct = res.headers.get('content-type') || '';
  const msgs = ct.includes('text/event-stream')
    ? text.split(/\r?\n\r?\n/).map((ev) => ev.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trimStart()).join('\n')).filter(Boolean).map((d) => JSON.parse(d))
    : [JSON.parse(text)].flat();
  const reply = msgs.find((m) => m.id === body.id);
  if (!reply) die(2, `no reply for request ${body.id}`);
  if (reply.error) die(2, `JSON-RPC error ${reply.error.code}: ${mask(reply.error.message)}`);
  return reply.result;
}
const rpc = (method, params) => post({ jsonrpc: '2.0', id: nextId++, method, params });

const init = await rpc('initialize', { protocolVersion, capabilities: {}, clientInfo: { name: 'mega-dev mcp-call', version: '1' } });
if (init?.protocolVersion) protocolVersion = init.protocolVersion;
await post({ jsonrpc: '2.0', method: 'notifications/initialized' });

let result;
if (rest[0] === 'list') {
  result = await rpc('tools/list', {});
} else {
  let a = rest[2] ?? '{}';
  if (a === '-') a = readFileSync(0, 'utf8');
  else if (a.startsWith('@')) a = readFileSync(a.slice(1), 'utf8');
  let args;
  try { args = JSON.parse(a); } catch { die(64, 'arguments are not valid JSON'); }
  result = await rpc('tools/call', { name: rest[1], arguments: args });
}

if (raw) process.stdout.write(JSON.stringify(result, null, 2) + '\n');
else if (rest[0] === 'list') for (const t of result.tools || []) process.stdout.write(`${t.name}\t${(t.description || '').split('\n')[0]}\n${JSON.stringify(t.inputSchema)}\n`);
else {
  const out = result.structuredContent ?? (result.content || []).map((c) => c.text ?? JSON.stringify(c)).join('\n');
  process.stdout.write((typeof out === 'string' ? out : JSON.stringify(out, null, 2)) + '\n');
}
process.exit(result?.isError ? 1 : 0);
