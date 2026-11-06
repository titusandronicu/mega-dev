import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { isPrivateAddress, safeFetch, htmlToText } from '../src/net.mjs';

test('private and special addresses are refused', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '192.168.50.63', '172.20.0.1', '169.254.169.254', '100.64.0.1', '::1', 'fd00::1', '::ffff:192.168.1.1', '0.0.0.0'])
    assert.equal(isPrivateAddress(ip), true, ip);
  for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) assert.equal(isPrivateAddress(ip), false, ip);
});
test('safeFetch refuses LAN, loopback, odd schemes, credentials and ports', async () => {
  for (const u of ['http://192.168.50.63:18082/', 'http://127.0.0.1/', 'http://[::1]/', 'file:///etc/passwd', 'ftp://x.com/', 'https://u:p@example.com/', 'https://example.com:22/', 'nonsense'])
    await assert.rejects(() => safeFetch(u), (e) => e.name === 'FetchError' || e instanceof Error, u);
});
test('hostname resolving to a private address is blocked at connect time', async () => {
  await assert.rejects(() => safeFetch('http://localhost/'), /blocked|ECONN|ENOTFOUND/);
});
test('html becomes readable text, scripts dropped', () => {
  const t = htmlToText('<html><script>evil()</script><h1>Hi</h1><p>a &amp; b</p><!-- c --></html>');
  assert.match(t, /Hi/); assert.match(t, /a & b/); assert.doesNotMatch(t, /evil|<|--/);
});
test('size cap, content type, redirects and truncation (local server, allowPrivate for tests only)', async () => {
  const srv = http.createServer((req, res) => {
    if (req.url === '/big') { res.setHeader('content-type', 'text/plain'); return res.end('x'.repeat(5000)); }
    if (req.url === '/bin') { res.setHeader('content-type', 'image/png'); return res.end('png'); }
    if (req.url === '/loop') { res.statusCode = 302; res.setHeader('location', '/loop'); return res.end(); }
    if (req.url === '/hop') { res.statusCode = 302; res.setHeader('location', '/ok'); return res.end(); }
    res.setHeader('content-type', 'text/html'); res.end('<p>hello</p>');
  }).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  const o = { allowPrivate: true };
  try {
    assert.equal((await safeFetch(`${base}/ok`, o)).text, 'hello');
    assert.equal((await safeFetch(`${base}/hop`, o)).text, 'hello');
    await assert.rejects(() => safeFetch(`${base}/big`, { ...o, maxBytes: 1000 }), /larger than/);
    assert.equal((await safeFetch(`${base}/big`, { ...o, maxChars: 100 })).truncated, true);
    await assert.rejects(() => safeFetch(`${base}/bin`, o), /content type/);
    await assert.rejects(() => safeFetch(`${base}/loop`, o), /redirects/);
  } finally { srv.close(); }
});
