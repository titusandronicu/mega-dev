// Usage: node tools/mcp-call.test.mjs   (starts a local mock MCP server, runs tools/mcp-call.mjs against it)
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const tool = join(dirname(fileURLToPath(import.meta.url)), 'mcp-call.mjs');
const TOKEN = ['v1', 'eyJzdWIiOiJ0ZXN0In0', 'SECRETSIGNATUREvalue1234567890'].join('.'); // built at runtime so the repo token scan stays clean
let sse = false, sessions = 0;
const srv = http.createServer((req, res) => {
  let b = ''; req.on('data', (d) => (b += d)); req.on('end', () => {
    const m = JSON.parse(b);
    const reply = (result, error) => {
      const body = JSON.stringify({ jsonrpc: '2.0', id: m.id, ...(error ? { error } : { result }) });
      res.setHeader('content-type', sse ? 'text/event-stream' : 'application/json');
      res.end(sse ? `event: message\ndata: ${body}\n\n` : body);
    };
    if (m.method === 'initialize') { sessions++; res.setHeader('mcp-session-id', 'sess-1'); return reply({ protocolVersion: '2025-06-18', capabilities: {}, serverInfo: { name: 'mock' } }); }
    if (req.headers['mcp-session-id'] !== 'sess-1') { res.statusCode = 400; return res.end('missing session'); }
    if (m.method === 'notifications/initialized') { res.statusCode = 202; return res.end(); }
    if (m.method === 'tools/list') return reply({ tools: [{ name: 'echo', description: 'Echo the text\nmore', inputSchema: { type: 'object' } }] });
    if (m.method === 'tools/call' && m.params.name === 'echo') return reply({ content: [{ type: 'text', text: JSON.stringify({ text: m.params.arguments.text, step: TOKEN, receipt: TOKEN }) }] });
    if (m.method === 'tools/call' && m.params.name === 'bad') return reply({ isError: true, content: [{ type: 'text', text: 'wrong input: url' }] });
    if (m.method === 'tools/call') return reply(null, { code: -32601, message: 'unknown tool' });
    res.statusCode = 404; res.end('nope');
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${srv.address().port}/mcp/job/${TOKEN}`;
const dir = mkdtempSync(join(tmpdir(), 'mcp-call-'));
const run = (args, env = {}) => new Promise((resolve) => {
  const p = spawn('node', [tool, ...args], { env: { ...process.env, MCP_URL: url, ...env } });
  let stdout = '', stderr = '';
  p.stdout.on('data', (d) => (stdout += d)); p.stderr.on('data', (d) => (stderr += d));
  p.on('close', (status) => resolve({ status, stdout, stderr }));
});
const logf = join(dir, 'log.txt');

for (const mode of [false, true]) {
  sse = mode;
  const l = await run(['--log', logf, 'list']);
  assert.equal(l.status, 0, l.stderr); assert.match(l.stdout, /^echo\tEcho the text/);
  const c = await run(['--log', logf, 'call', 'echo', '{"text":"hi"}']);
  assert.equal(c.status, 0, c.stderr);
  assert.equal(JSON.parse(c.stdout).receipt, TOKEN, 'stdout keeps the receipt whole');
  console.log(`ok  list and call (${mode ? 'SSE' : 'JSON'}), session header carried`);
}
const log = readFileSync(logf, 'utf8');
assert.ok(!log.includes('SECRETSIGNATURE') && !log.includes(url), 'log must not hold the token or the URL');
assert.ok(log.includes('<url>'), 'url marker'); assert.ok(log.includes('v1.<masked>'), 'token marker: ' + log.slice(0, 600));
console.log('ok  log masks the URL and signed tokens');

writeFileSync(join(dir, 'args.json'), '{"text":"from file"}'); writeFileSync(join(dir, 'u.txt'), url + '\n');
const f = await run(['--url-file', join(dir, 'u.txt'), 'call', 'echo', '@' + join(dir, 'args.json')], { MCP_URL: '' });
assert.equal(f.status, 0, f.stderr); assert.equal(JSON.parse(f.stdout).text, 'from file');
console.log('ok  --url-file and @file arguments');

const bad = await run(['call', 'bad', '{}']); assert.equal(bad.status, 1); assert.match(bad.stdout, /wrong input/);
const unk = await run(['call', 'nope', '{}']); assert.equal(unk.status, 2); assert.match(unk.stderr, /JSON-RPC error -32601/);
const usage = await run(['frobnicate']); assert.equal(usage.status, 64);
const noarg = await run(['call', 'echo', '{bad json'], {}); assert.equal(noarg.status, 64);
const down = await run(['list'], { MCP_URL: 'http://127.0.0.1:1/x' }); assert.equal(down.status, 2); assert.match(down.stderr, /request failed/);
console.log('ok  isError exits 1, protocol errors 2, usage 64, unreachable host 2');
srv.close();
