// Idempotency. One row per inbound message; the row, not the model, decides if work happens again.
// States: claimed -> replying -> done | ignored | failed
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`CREATE TABLE IF NOT EXISTS messages (
    message_id TEXT PRIMARY KEY, thread_id TEXT, sender TEXT, state TEXT NOT NULL,
    reply_id TEXT, note TEXT, attempts INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`);
  db.exec(`CREATE TABLE IF NOT EXISTS pages (
    thread_id TEXT NOT NULL, url TEXT NOT NULL, text TEXT NOT NULL, fetched_at TEXT NOT NULL,
    PRIMARY KEY (thread_id, url))`);
  const now = () => new Date().toISOString();
  const putPage = db.prepare('INSERT OR REPLACE INTO pages (thread_id, url, text, fetched_at) VALUES (?,?,?,?)');
  const getPages = db.prepare('SELECT url, text, fetched_at FROM pages WHERE thread_id=? ORDER BY fetched_at DESC LIMIT ?');
  const insert = db.prepare('INSERT OR IGNORE INTO messages (message_id, thread_id, sender, state, created_at, updated_at) VALUES (?,?,?,?,?,?)');
  const set = db.prepare('UPDATE messages SET state=?, reply_id=COALESCE(?, reply_id), note=COALESCE(?, note), updated_at=? WHERE message_id=?');
  const bump = db.prepare('UPDATE messages SET attempts=attempts+1, updated_at=? WHERE message_id=?');
  const one = db.prepare('SELECT * FROM messages WHERE message_id=?');
  const unfinished = db.prepare("SELECT * FROM messages WHERE state IN ('claimed','replying')");
  return {
    /** true for the first caller, and again for a row stuck in "claimed" (an earlier attempt failed), at most 3 attempts */
    claim(m) {
      if (insert.run(m.message_id, m.thread_id ?? null, m.from ?? null, 'claimed', now(), now()).changes === 1) return true;
      const row = one.get(m.message_id);
      if (row.state === 'claimed' && row.attempts < 3) { bump.run(now(), m.message_id); return true; }
      if (row.state === 'claimed') set.run('failed', null, 'gave up after 3 attempts', now(), m.message_id);
      return false;
    },
    mark(id, state, { replyId = null, note = null } = {}) { set.run(state, replyId, note, now(), id); },
    get(id) { return one.get(id); },
    unfinished() { return unfinished.all(); },
    /** Working memory: the text of a page the agent read in this thread (cut at 6000 chars). */
    savePage(threadId, url, text) { if (threadId) putPage.run(threadId, String(url), String(text ?? '').slice(0, 6000), now()); },
    /** Newest first, at most `limit`. */
    pagesFor(threadId, limit = 4) { return threadId ? getPages.all(threadId, limit) : []; },
    close() { db.close(); },
  };
}
