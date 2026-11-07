import test from 'node:test';
import assert from 'node:assert/strict';
import { requestJson, HttpError } from '../src/http.mjs';

const res = (status, body, headers = {}) => ({ ok: status < 400, status, text: async () => JSON.stringify(body), headers: { get: (k) => headers[k.toLowerCase()] } });
const fast = { sleepFn: async () => {}, retries: 2 };

test('429 is retried and honors Retry-After', async () => {
  const waits = []; let n = 0;
  const r = await requestJson('u', {}, { fetchImpl: async () => (n++ < 1 ? res(429, {}, { 'retry-after': '1' }) : res(200, { ok: 1 })), sleepFn: async (ms) => waits.push(ms), retries: 2 });
  assert.deepEqual(r, { ok: 1 }); assert.deepEqual(waits, [1000]);
});
test('400 is not retried', async () => {
  let n = 0;
  await assert.rejects(() => requestJson('u', {}, { ...fast, fetchImpl: async () => { n++; return res(400, { message: 'bad' }); } }), (e) => e instanceof HttpError && e.status === 400);
  assert.equal(n, 1);
});
test('5xx stops after the retry limit', async () => {
  let n = 0;
  await assert.rejects(() => requestJson('u', {}, { ...fast, fetchImpl: async () => { n++; return res(503, {}); } }), (e) => e.status === 503);
  assert.equal(n, 3);
});
test('network errors are retried then thrown', async () => {
  let n = 0;
  await assert.rejects(() => requestJson('u', {}, { ...fast, fetchImpl: async () => { n++; throw new Error('reset'); } }), /reset/);
  assert.equal(n, 3);
});
