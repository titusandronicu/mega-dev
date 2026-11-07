// Append-only journal. The agent has no tool that reaches it; only the harness writes.
// Also writes /data/statuslog.jsonl: one row per course event, written at the moment it happens.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { redact } from './guard.mjs';

export function createJournal(path, secrets = [], now = () => new Date()) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  const round = (t) => {
    try { return t < new Date(readFileSync(`${dir}/window-start`, 'utf8').trim()) ? 1 : 2; } catch { return 2; }
  };
  const statusEvent = (event, data) => {
    if (event === 'received') return data.from === 'away@mail.mega.dev' ? 'received' : null;
    if (event === 'ntfy') return 'notified';
    if (event === 'replied') return data.note === 'away' || data.note === 'owner' ? 'replied' : null;
    if (event === 'act' && data.approved_by) return 'owner_answered';
    return null;
  };
  return {
    append(event, data = {}) {
      const t = now();
      const line = JSON.stringify({ t: t.toISOString(), event, ...data });
      appendFileSync(path, redact(line, secrets) + '\n', { flag: 'a', mode: 0o600 });
      const se = statusEvent(event, data);
      if (se) appendFileSync(`${dir}/statuslog.jsonl`, JSON.stringify({ at: t.toISOString(), round: round(t), event: se }) + '\n', { flag: 'a', mode: 0o600 });
    },
  };
}
