import test from 'node:test';
import assert from 'node:assert/strict';
import { openStore } from '../src/store.mjs';

test('pages are kept per thread, newest first, cut at 6000 chars', () => {
  const s = openStore(':memory:');
  s.savePage('t1', 'https://a.test/1', 'x'.repeat(9000));
  s.savePage('t1', 'https://a.test/2', 'second');
  s.savePage('t2', 'https://a.test/3', 'other thread');
  const p = s.pagesFor('t1');
  assert.equal(p.length, 2); assert.equal(p.every((x) => x.text.length <= 6000), true);
  assert.deepEqual(s.pagesFor('nope'), []); assert.deepEqual(s.pagesFor(undefined), []);
  s.savePage('t1', 'https://a.test/1', 'replaced'); assert.equal(s.pagesFor('t1').find((x) => x.url.endsWith('/1')).text, 'replaced');
});
test('a stuck claim is retried at most 3 times', () => {
  const s = openStore(':memory:'); const m = { message_id: 'a', thread_id: 't' };
  assert.equal(s.claim(m), true); assert.equal(s.claim(m), true); assert.equal(s.claim(m), true);
  assert.equal(s.claim(m), false); assert.equal(s.get('a').state, 'failed');
});
