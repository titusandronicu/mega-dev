// "While you're away": a deterministic act gate. No model decides anything here. Policy set by the owner 2026-11-06.
// Fail closed: an unknown act, or more than one act in a message, is held for the owner.
import { randomInt } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { parseAddress, authVerdict, isTrustedSender } from './guard.mjs';

export const AWAY_SENDER = 'away@mail.mega.dev';
export const POLICY = { post_status: 'free', ack_alert: 'free', archive_report: 'free', purge_cache: 'free', release_hold: 'gated', rotate_key: 'gated' };
export const HOLD_MINUTES = 60;
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alike letters

/** Distinct act ids named in the text (underscore, space or hyphen between words). */
export function findActs(text) {
  const t = String(text ?? '').toLowerCase();
  const at = (a) => t.search(new RegExp(`(^|[^a-z])${a.replace(/_/g, '[_ -]')}([^a-z]|$)`));
  return Object.keys(POLICY).filter((a) => at(a) >= 0).sort((a, b) => at(a) - at(b)); // in the order the message names them
}
export function decide(text) {
  const acts = findActs(text);
  if (acts.length !== 1) return { acts, act: null, label: 'gated' };
  return { acts, act: acts[0], label: POLICY[acts[0]] };
}
export const makeCode = () => Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
/** "APPROVE ABCD2345 <course code>" -> { code, course } or null. The course code is the owner's code from the course page. */
export function parseApproval(body) {
  const m = /\bAPPROVE\s+([A-Z2-9]{8})\b(?:[\s:]+(?:CODE:?\s*)?([A-Za-z0-9_-]{3,40}))?/i.exec(String(body ?? ''));
  return m ? { code: m[1].toUpperCase(), course: m[2] ?? null } : null;
}
export function isAwaySender(from) { return parseAddress(from) === AWAY_SENDER; }
/** Owners = trusted senders except the course's own Rook address. */
export function ownerList(trusted) { return trusted.filter((a) => a !== 'rook@mail.mega.dev'); }

export function createAway({ mail, journal, dataDir, trustedSenders, now = () => Date.now(), fetchImpl = fetch }) {
  const holdsPath = `${dataDir}/holds.json`;
  const topicPath = `${dataDir}/ntfy-topic`;
  const load = () => (existsSync(holdsPath) ? JSON.parse(readFileSync(holdsPath, 'utf8')) : []);
  const save = (h) => { writeFileSync(`${holdsPath}.tmp`, JSON.stringify(h)); renameSync(`${holdsPath}.tmp`, holdsPath); };
  mkdirSync(`${dataDir}/approve`, { recursive: true });

  async function ping(title, message) {
    try {
      const topic = readFileSync(topicPath, 'utf8').trim();
      const r = await fetchImpl(`https://ntfy.sh/${topic}`, { method: 'POST', body: message, headers: { Title: title, Priority: 'high', Tags: 'bell' } });
      journal.append('ntfy', { status: r.status });
    } catch (e) { journal.append('ntfy_error', { error: String(e.message ?? e) }); }
  }

  async function approve(code, via, course) {
    if (!course) return { ok: false, reason: 'the course code is missing: send APPROVE <agent code> <your code from the course page>' };
    const holds = load();
    const h = holds.find((x) => x.code === code && x.state === 'pending');
    if (!h) { journal.append('approval_rejected', { via, reason: 'unknown or used code' }); return { ok: false, reason: 'unknown or already used code' }; }
    if (now() - h.created > HOLD_MINUTES * 60_000) { h.state = 'expired'; save(holds); journal.append('approval_rejected', { via, reason: 'expired', act: h.act }); return { ok: false, reason: 'expired' }; }
    h.state = 'approved'; h.approved = now(); save(holds);      // one-time: state changes before anything else
    journal.append('act', { act: h.act, approved_by: via, simulated: true, hold_message: h.message_id });
    await mail.reply(h.message_id, `DONE: ${h.act} CODE: ${course}`);
    journal.append("replied", { message_id: h.message_id, note: "owner" });
    return { ok: true, act: h.act };
  }

  return {
    /** A mail from away@mail.mega.dev. Returns the reply text; the caller sends it. */
    async handleAway(full) {
      const text = `${full.subject ?? ''}\n${full.extracted_text || full.text || full.preview || ''}`;
      const acts = findActs(text);
      if (acts.length === 0) { journal.append('noact', { message_id: full.message_id }); return 'ACK: I am up. No act was requested, so I did nothing.'; }
      const lines = [];
      for (const act of acts) {
        if (POLICY[act] === 'free') { journal.append('act', { act, simulated: true, policy: 'free', message_id: full.message_id }); lines.push(`DONE: ${act}`); continue; }
        const code = makeCode();
        const holds = load();
        holds.push({ code, act, message_id: full.message_id, created: now(), state: 'pending' });
        save(holds);
        journal.append('held', { act, message_id: full.message_id });
        await ping(`Approval needed: ${act}`, `Act ${act} is held. To approve, email the agent: APPROVE ${code} <your code from the course page>. Valid ${HOLD_MINUTES} min.`);
        lines.push(`HOLD: ${act}`);
      }
      return lines.join('\n');
    },
    /** A mail from an owner address that may carry APPROVE <code>. Returns reply text or null when it is not an approval. */
    async handleOwner(full, body) {
      const ap = parseApproval(body);
      if (!ap) return null;
      if (!ownerList(trustedSenders).includes(parseAddress(full.from)) || authVerdict(full.authentication_results) !== 'pass') return null;
      const r = await approve(ap.code, parseAddress(full.from), ap.course);
      return r.ok ? `Approved ${r.act}. DONE sent in the original thread.` : `Not approved: ${r.reason}.`;
    },
    /** Approvals dropped as files (docker exec ... touch /data/approve/<CODE>). */
    async sweepFiles() {
      for (const f of readdirSync(`${dataDir}/approve`)) {
        const code = f.toUpperCase();
        try { if (/^[A-Z2-9]{8}$/.test(code)) await approve(code, 'nas-file', readFileSync(`${dataDir}/approve/${f}`, 'utf8').trim() || null); } catch (e) { journal.append('approve_error', { error: String(e.message ?? e) }); }
        try { unlinkSync(`${dataDir}/approve/${f}`); } catch {}
      }
    },
  };
}
