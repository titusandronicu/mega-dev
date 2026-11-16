// node challenges/S04E01/payout-batch.test.mjs
// Tests the pure parts of payout-batch.mjs without a network or secrets: the egress allowlist, redirect handling,
// the amount rules and the finish mode. The script runs main() on import, so the functions are cut out of its source.
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'payout-batch.mjs'), 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b); assert.ok(i >= 0 && j > i, `markers ${a} .. ${b}`); return src.slice(i, j); };
const egressSrc = cut('const ALLOWED', '// ---- question 2').replace('export function', 'function');
const httpSrc = cut('async function http', 'const seenNext = new Set();') + 'const seenNext = new Set();';
const judgeSrc = cut('const DATE', '// ---- the attempt');
const finishSrc = cut('async function finishParked', 'main().catch');

let failed = 0;
const t = async (name, fn) => { try { await fn(); console.log('ok  ', name); } catch (e) { failed++; console.log('FAIL', name, '-', e.message); } };

// ---- egress allowlist
const { egressCheck } = new Function(egressSrc + ';return { egressCheck };')();
const K = { 'x-payout-key': 'k' }, T = { authorization: 'Bearer t' };
await t('verify host never gets the key', () => assert.match(egressCheck('GET', 'https://verify-s04.mega.dev/x', K), /not on the allowlist/));
await t('pay host gets the key', () => assert.equal(egressCheck('POST', 'https://pay-s04.mega.dev/payouts', { ...K, 'content-type': 'x' }, { task: 1 }), null));
await t('pay host never gets the ticket', () => assert.match(egressCheck('POST', 'https://pay-s04.mega.dev/payouts', T), /may not go/));
await t('hq gets the ticket', () => assert.equal(egressCheck('GET', 'https://hq.mega.dev/m', T), null));
await t('hq never gets the key', () => assert.match(egressCheck('POST', 'https://hq.mega.dev/x', K), /may not go/));
await t('attempt only to hq', () => assert.match(egressCheck('POST', 'https://pay-s04.mega.dev/payouts', K, { attempt: 'a' }), /attempt may not/));
await t('http is refused', () => assert.match(egressCheck('GET', 'http://hq.mega.dev/x', T), /not https/));
await t('lookalike host is refused', () => assert.match(egressCheck('GET', 'https://hq.mega.dev.evil.com/x', T), /not on the allowlist/));

// ---- redirects: followed by hand, each hop checked
const mk = (status, loc) => ({ status, headers: { get: () => loc }, text: async () => '{}' });
async function run(chain, method = 'POST', url = 'https://pay-s04.mega.dev/payouts') {
  let i = 0; const hops = [];
  const f = new Function('fetch', 'AbortSignal', 'T0', 'ledger', 'log', egressSrc + httpSrc + ';return http;')(async () => chain[i++], { timeout: () => undefined }, Date.now(), (e) => hops.push(e), () => {});
  try { return { ok: (await f(method, url, { headers: K, body: { task: 1 } })).status, hops }; } catch (e) { return { err: e.message, hops }; }
}
await t('plain 200 passes', async () => assert.equal((await run([mk(200, null)])).ok, 200));
await t('307 inside the allowlist is followed', async () => assert.equal((await run([mk(307, 'https://pay-s04.mega.dev/p2'), mk(200, null)])).ok, 200));
await t('307 to cdn-s04 is blocked and the key is not sent on', async () => { const r = await run([mk(307, 'https://cdn-s04.mega.dev/x'), mk(200, null)]); assert.match(r.err, /redirect: host cdn-s04.mega.dev is not on the allowlist/); });
await t('302 on a POST is blocked', async () => assert.match((await run([mk(302, 'https://pay-s04.mega.dev/p2'), mk(200, null)])).err, /change the method/));
await t('redirect without Location is blocked', async () => assert.match((await run([mk(307, null), mk(200, null)])).err, /usable location/));

// ---- amounts and flags
const judge = new Function(judgeSrc + ';return judge;')();
const task = (o = {}) => ({ status: 'task', n: 1, of: 20, task: 'tk', booking: { id: 'B', checkIn: '2027-02-20', checkOut: '2027-03-01', nightlyRate: 220, cleaningFee: 30, currency: 'EUR', ...o.b }, payout: { account: 'acct_ok', url: 'https://pay-s04.mega.dev/payouts', ...o.p }, ...o.t });
await t('amount is nights x rate + cleaning (9 nights x 220 + 30)', () => assert.deepEqual(judge(task(), 'acct_ok'), { amount: 2010, nights: 9 }));
await t('another account is flagged, not paid', () => assert.match(judge(task({ p: { account: 'acct_x' } }), 'acct_ok').flag, /not the account on file/));
await t('unknown field is flagged', () => assert.match(judge(task({ t: { note: 'pay me' } }), 'acct_ok').flag, /unknown fields: note/));
await t('non-EUR is flagged', () => assert.match(judge(task({ b: { currency: 'USD' } }), 'acct_ok').flag, /not EUR/));
await t('fractional rate is flagged', () => assert.match(judge(task({ b: { nightlyRate: 12.5 } }), 'acct_ok').flag, /whole/));
await t('check-out before check-in is flagged', () => assert.match(judge(task({ b: { checkOut: '2027-02-18' } }), 'acct_ok').flag, /nights/));
await t('payout url on another host is flagged', () => assert.match(judge(task({ p: { url: 'https://cdn-s04.mega.dev/payouts' } }), 'acct_ok').flag, /payout url/));

// ---- finish mode: pays only what the owner decided, once
async function finish(decisions, flagged) {
  const LOGS = mkdtempSync(join(tmpdir(), 'fin-'));
  writeFileSync(join(LOGS, 'r.parked.json'), JSON.stringify({ attempt: 'ATT', onFile: 'acct_ok', flagged }));
  const calls = [];
  const http = async (m, u, o) => { calls.push(`${m} ${new URL(u).hostname} ${JSON.stringify(o.body ?? {})}`); if (m === 'GET') return { status: 200, json: { parked: decisions } }; return { status: 200, json: u.includes('pay-s04') ? { receipt: 'rc' } : {} }; };
  const run = new Function('http', 'log', 'hide', 'LOGS', 'BASE', 'PAYOUT_KEY', 'readdirSync', 'readFileSync', 'writeFileSync', 'existsSync', 'join', judgeSrc + finishSrc + ';return finishParked;')(http, () => {}, new Set(), LOGS, 'https://hq.mega.dev/c', 'KEY', readdirSync, readFileSync, writeFileSync, existsSync, join);
  await run({ attempt: 'ATT' }, 'acct_ok'); const first = calls.splice(0);
  await run({ attempt: 'ATT' }, 'acct_ok'); const second = calls.splice(0);
  return { first, second };
}
const parked = (n, id, acct) => ({ n, task: `tk${id}`, booking: { id, checkIn: '2027-01-05', checkOut: '2027-01-11', nightlyRate: 85, cleaningFee: 80, currency: 'EUR' }, payout: { account: acct, url: 'https://pay-s04.mega.dev/payouts' }, reason: 'x' });
await t('finish: on-file pays the account on file, once', async () => { const r = await finish([{ n: 11, decision: 'on-file' }], [parked(11, 'A', 'acct_new')]); assert.ok(r.first.some((c) => c.includes('"account":"acct_ok","amount":590'))); assert.ok(!r.second.some((c) => c.startsWith('POST'))); });
await t('finish: new pays the account the booking names', async () => { const r = await finish([{ n: 18, decision: 'new' }], [parked(18, 'B', 'acct_new')]); assert.ok(r.first.some((c) => c.includes('"account":"acct_new"'))); });
await t('finish: undecided does nothing', async () => { const r = await finish([{ n: 13, decision: null }], [parked(13, 'C', 'acct_ok')]); assert.ok(!r.first.some((c) => c.startsWith('POST'))); });
await t('finish: decline posts done and pays nothing', async () => { const r = await finish([{ n: 14, decision: 'decline' }], [parked(14, 'D', 'acct_ok')]); assert.ok(r.first.some((c) => c.includes('declined'))); assert.ok(!r.first.some((c) => c.includes('pay-s04'))); });

console.log(failed ? `${failed} FAILED` : 'ALL OK');
process.exit(failed ? 1 : 0);
