import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJournal } from '../src/journal.mjs';

const rows = (dir) => readFileSync(join(dir, 'statuslog.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));

test('status log: one row per course event, written as it happens, round from window-start', () => {
  const dir = mkdtempSync(join(tmpdir(), 'jr-'));
  writeFileSync(join(dir, 'window-start'), '2026-11-06T13:45:00Z\n');
  let t = new Date('2026-11-06T13:32:53.174Z');
  const j = createJournal(join(dir, 'journal.jsonl'), [], () => t);
  j.append('received', { from: 'away@mail.mega.dev' });
  t = new Date('2026-11-06T14:00:26.140Z');
  j.append('received', { from: 'away@mail.mega.dev' });
  j.append('ntfy', { status: 200 });
  j.append('replied', { note: 'away' });
  t = new Date('2026-11-06T14:02:20.299Z');
  j.append('act', { act: 'release_hold', approved_by: 'nas-file', simulated: true });
  j.append('replied', { note: 'owner' });
  assert.deepEqual(rows(dir), [
    { at: '2026-11-06T13:32:53.174Z', round: 1, event: 'received' },
    { at: '2026-11-06T14:00:26.140Z', round: 2, event: 'received' },
    { at: '2026-11-06T14:00:26.140Z', round: 2, event: 'notified' },
    { at: '2026-11-06T14:00:26.140Z', round: 2, event: 'replied' },
    { at: '2026-11-06T14:02:20.299Z', round: 2, event: 'owner_answered' },
    { at: '2026-11-06T14:02:20.299Z', round: 2, event: 'replied' },
  ]);
});

test('status log: ignores mail from other senders, free acts and unrelated events', () => {
  const dir = mkdtempSync(join(tmpdir(), 'jr-'));
  const j = createJournal(join(dir, 'journal.jsonl'));
  j.append('received', { from: 'stranger@example.com' });
  j.append('act', { act: 'post_status', policy: 'free' });
  j.append('started', {});
  assert.equal(existsSync(join(dir, 'statuslog.jsonl')), false);
  assert.equal(readFileSync(join(dir, 'journal.jsonl'), 'utf8').trim().split('\n').length, 3);
});

test('status log: no window-start file means round 2', () => {
  const dir = mkdtempSync(join(tmpdir(), 'jr-'));
  const j = createJournal(join(dir, 'journal.jsonl'));
  j.append('received', { from: 'away@mail.mega.dev' });
  assert.equal(rows(dir)[0].round, 2);
});
