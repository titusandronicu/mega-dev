// Thin AgentMail client (REST, https://docs.agentmail.to, read 3 Nov 2026). Only what the agent needs.
import { requestJson } from './http.mjs';

export function createMailClient({ apiKey, inboxId, base = 'https://api.agentmail.to/v0', fetchImpl = fetch, sleepFn }) {
  const headers = { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' };
  const opts = { fetchImpl, sleepFn };
  const inbox = `${base}/inboxes/${encodeURIComponent(inboxId)}`;
  const get = (url) => requestJson(url, { method: 'GET', headers }, opts);

  return {
    /** Newest first. Our own sent mail has the "sent" label and is skipped by the caller. */
    async listRecent(limit = 50) {
      const r = await get(`${inbox}/messages?limit=${limit}`);
      return r.messages ?? [];
    },
    /** Full body (list items only carry a preview). */
    getMessage(messageId) {
      return get(`${inbox}/messages/${encodeURIComponent(messageId)}`);
    },
    /** Reply stays in the same thread. Not retried on 5xx: a retry could send twice. */
    reply(messageId, text) {
      return requestJson(
        `${inbox}/messages/${encodeURIComponent(messageId)}/reply`,
        { method: 'POST', headers, body: JSON.stringify({ text }) },
        { ...opts, retries: 0 },
      );
    },
    /** Recent messages of one thread, oldest first. Uses only the list endpoint (no thread permission needed). */
    async threadMessages(threadId, limit = 50) {
      const r = await get(`${inbox}/messages?limit=${limit}`);
      return (r.messages ?? []).filter((m) => m.thread_id === threadId).reverse();
    },
    /** Sent messages in a thread after a time: tells recovery whether a reply already left. */
    async sentInThreadSince(threadId, sinceIso) {
      const r = await get(`${inbox}/messages?labels=sent&after=${encodeURIComponent(sinceIso)}&limit=50`);
      return (r.messages ?? []).filter((m) => m.thread_id === threadId);
    },
  };
}
