// Append-only journal. The agent has no tool that reaches it; only the harness writes.
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { redact } from './guard.mjs';

export function createJournal(path, secrets = [], now = () => new Date()) {
  mkdirSync(dirname(path), { recursive: true });
  return {
    append(event, data = {}) {
      const line = JSON.stringify({ t: now().toISOString(), event, ...data });
      appendFileSync(path, redact(line, secrets) + '\n', { flag: 'a', mode: 0o600 });
    },
  };
}
