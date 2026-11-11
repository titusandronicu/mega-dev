// node tools/check-ask-order.test.mjs
import assert from 'node:assert/strict';
import { checkAskOrder } from './check-ask-order';
const T = (m) => `2026-11-11T10:${m}:00Z`;
const ask = { n: 2, labels: ['needs-human'], thread: [{ by: 'agent', at: T('01'), kind: 'comment' }, { by: 'owner', at: T('05'), kind: 'comment' }, { by: 'agent', at: T('06'), kind: 'close' }] };
const ok = { issues: [ask, { n: 1, labels: [], thread: [{ by: 'agent', at: T('02'), kind: 'close' }] }], stamp: [[T('02'), '#1 · shipped · live: ✓ · open risks: none'], [T('03'), '#2 · asked · live: ✗ · open risks: none'], [T('07'), '#2 · declined · live: ✗ · open risks: none']] };
assert.deepEqual(checkAskOrder(ok), [], 'good order passes; an issue never asked may ship alone');
const waiting = { ...ok, stamp: [[T('01'), '#2 · waiting · live: ✗ · open risks: none'], ...ok.stamp] };
assert.match(checkAskOrder(waiting)[0], /"waiting".*before the owner entry/, 'round-2 failure: a waiting line before the answer');
const early = { issues: [{ ...ask, thread: [{ by: 'agent', at: T('04'), kind: 'close' }, { by: 'owner', at: T('05'), kind: 'comment' }] }], stamp: ok.stamp };
assert.match(checkAskOrder(early)[0], /closed.*before the owner entry/, 'closing before the answer fails');
const noAsk = { issues: [ask], stamp: [[T('07'), '#2 · declined · live: ✗ · open risks: none']] };
assert.ok(checkAskOrder(noAsk).some((b) => /no "asked" ship line/.test(b)), 'needs-human without an asked line fails');
const unanswered = { issues: [{ n: 2, labels: ['needs-human'], thread: [] }], stamp: [[T('03'), '#2 · asked · live: ✗ · open risks: none'], [T('04'), '#2 · shipped · live: ✓ · open risks: none']] };
assert.match(checkAskOrder(unanswered)[0], /none yet/, 'work with no owner entry at all fails');
console.log('check-ask-order: 5 cases ok');
