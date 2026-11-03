// Per-mail pipeline. Every policy decision (who, once, safe to send) is made here, in code.
import { authVerdict, containsSecret, isTrustedSender, parseAddress, wantsAnswerLine, toAnswerLine } from './guard.mjs';
import { runAgent } from './agent.mjs';

const MAX_REPLY_CHARS = 6000;
const FAILURE_REPLY = 'I could not finish this request. Nothing was changed. Please send it again, or check that the link is a public page.';
const BLOCKED_REPLY = 'I produced an answer that I am not allowed to send, so I dropped it. Please ask again.';

export function createProcessor({ mail, store, journal, callModel, fetchPage, trustedSender, secrets, selfAddress, budgets }) {
  /** Earlier messages of this thread (max 6, 1500 chars each), oldest first. A failure here costs context, not the reply. */
  async function loadHistory(id, full, summary) {
    try {
      const threadId = full.thread_id ?? summary.thread_id;
      const at = full.timestamp ?? summary.timestamp;
      const earlier = (await mail.threadMessages(threadId)).filter((m) => m.message_id !== id && (!at || !m.timestamp || m.timestamp <= at)).slice(-6);
      return await Promise.all(earlier.map(async (m) => {
        const f = await mail.getMessage(m.message_id);
        const sent = (f.labels ?? []).includes('sent');
        // A stranger's words (and links) must never reach the model, not even as context: keep only that the mail existed.
        if (!sent && !isTrustedSender(f.from, trustedSender)) {
          return { from: parseAddress(f.from), sent: false, stranger: true, text: '(mail from an unverified sender, ignored by the system; content withheld)' };
        }
        return { from: parseAddress(f.from), sent, text: (f.extracted_text || f.text || f.preview || '').slice(0, 1500) };
      }));
    } catch (e) {
      journal.append('history_error', { message_id: id, error: String(e.message ?? e) });
      return [];
    }
  }

  async function run(summary) {
    const id = summary.message_id;
    const full = await mail.getMessage(id);
    const from = full.from ?? summary.from;

    if (!isTrustedSender(from, trustedSender)) {
      store.mark(id, 'ignored', { note: 'sender not trusted' });
      journal.append('ignored', { message_id: id, from: parseAddress(from), reason: 'sender not trusted' });
      return 'ignored';
    }
    if (authVerdict(full.authentication_results) === 'fail') {
      store.mark(id, 'ignored', { note: 'authentication failed' });
      journal.append('ignored', { message_id: id, from: parseAddress(from), reason: 'spf, dkim and dmarc all failed', auth: full.authentication_results });
      return 'ignored';
    }

    const body = (full.extracted_text || full.text || full.preview || '').slice(0, 8000);
    const history = await loadHistory(id, full, summary);
    const threadId = full.thread_id ?? summary.thread_id;
    const pages = store.pagesFor(threadId);
    journal.append('mail', { message_id: id, subject: full.subject, body_chars: body.length, history: history.length, pages: pages.length });
    // Every page the agent reads is kept for this thread, so a follow-up never depends on fetching it again.
    const trackedFetch = async (url) => {
      const page = await fetchPage(url);
      try { store.savePage(threadId, page.url, page.text); } catch (e) { journal.append('page_save_error', { message_id: id, error: String(e.message ?? e) }); }
      return page;
    };
    let reply; let note = null;
    try {
      const r = await runAgent({ mail: { from: parseAddress(from), subject: full.subject, body, history, pages }, callModel, fetchPage: trackedFetch, journal, budgets });
      reply = r.text;
      note = `${r.steps} steps, ${r.fetches} fetches, ${r.stop}`;
    } catch (e) {
      journal.append('agent_error', { message_id: id, error: String(e.message ?? e) });
      reply = FAILURE_REPLY; note = 'agent error';
    }

    if (wantsAnswerLine(body)) {
      const line = toAnswerLine(reply);
      if (line) reply = line; else journal.append('format_miss', { message_id: id, reply: reply.slice(0, 200) });
    }
    reply = reply.slice(0, MAX_REPLY_CHARS);
    if (containsSecret(reply, secrets)) {
      journal.append('secret_blocked', { message_id: id });
      reply = BLOCKED_REPLY; note = 'secret blocked';
    }

    store.mark(id, 'replying');
    const sent = await mail.reply(id, reply);
    store.mark(id, 'done', { replyId: sent.message_id, note });
    journal.append('replied', { message_id: id, thread_id: sent.thread_id, reply_id: sent.message_id, note, reply: reply.slice(0, 300) });
    return 'replied';
  }

  return {
    /** Handle one listed message. Safe to call again for the same id. */
    async handle(summary) {
      if ((summary.labels ?? []).includes('sent') || parseAddress(summary.from) === parseAddress(selfAddress)) return 'self';
      if (!store.claim(summary)) return 'duplicate';
      journal.append('received', { message_id: summary.message_id, thread_id: summary.thread_id, from: parseAddress(summary.from) });
      try { return await run(summary); } catch (e) {
        journal.append('process_error', { message_id: summary.message_id, error: String(e.message ?? e) });
        // leave state as is: recover() decides on the next start; do not mark done
        return 'error';
      }
    },

    /** After a crash: a "replying" row may or may not have sent. Ask the mailbox before doing anything twice. */
    async recover() {
      for (const row of store.unfinished()) {
        if (row.state === 'replying') {
          const sent = await mail.sentInThreadSince(row.thread_id, row.created_at);
          if (sent.length) { store.mark(row.message_id, 'done', { replyId: sent[0].message_id, note: 'recovered: reply already sent' }); journal.append('recovered', { message_id: row.message_id, outcome: 'already sent' }); continue; }
        }
        journal.append('recovered', { message_id: row.message_id, outcome: 'rerun' });
        try { await run({ message_id: row.message_id, from: row.sender }); } catch (e) { journal.append('process_error', { message_id: row.message_id, error: String(e.message ?? e) }); }
      }
    },
  };
}
