// Policy that must hold whatever the model says. Pure functions, no I/O.
import { Buffer } from 'node:buffer';

/** "Name <a@b.c>" or "a@b.c" -> "a@b.c" (lower case). */
export function parseAddress(from) {
  const s = String(from ?? '');
  const m = /<([^<>]+)>\s*$/.exec(s);
  return (m ? m[1] : s).trim().toLowerCase();
}

/** Exact address match against one address or a list. A display name or a look-alike domain never passes; an empty list trusts nobody. */
export function isTrustedSender(from, trusted) {
  const list = (Array.isArray(trusted) ? trusted : [trusted]).map((t) => String(t ?? '').trim().toLowerCase()).filter(Boolean);
  const address = parseAddress(from);
  return address !== '' && list.includes(address);
}

/**
 * Reject only clear spoofing: DMARC failed and neither SPF nor DKIM passed.
 * The AgentMail docs advise against rejecting on dmarc=fail alone.
 * A missing field is "unknown", not a failure (older mail has none).
 */
export function authVerdict(ar) {
  if (!ar || typeof ar !== 'object') return 'unknown';
  if (ar.dmarc === 'fail' && ar.spf !== 'pass' && ar.dkim !== 'pass') return 'fail';
  return 'ok';
}

const KEY_PATTERNS = [/\bam_[A-Za-z0-9_-]{16,}/, /\bsk-ant-[A-Za-z0-9_-]{10,}/, /\bsk-[A-Za-z0-9]{24,}/];

/** Forms a secret can take once a model or a page has touched it. */
function variants(secret) {
  const b64 = Buffer.from(secret).toString('base64');
  return [secret, encodeURIComponent(secret), b64, b64.replace(/=+$/, ''), [...secret].reverse().join('')];
}

/** True when text contains a configured secret (plain, URL-encoded, base64, reversed) or a key-shaped string. */
export function containsSecret(text, secrets = []) {
  const t = String(text ?? '');
  for (const s of secrets) {
    if (typeof s !== 'string' || s.length < 8) continue;
    if (variants(s).some((v) => v.length >= 8 && t.includes(v))) return true;
  }
  return KEY_PATTERNS.some((re) => re.test(t));
}

/** Redact for logs (the journal), where a refusal is not an option. */
export function redact(text, secrets = []) {
  let t = String(text ?? '');
  for (const s of secrets) {
    if (typeof s !== 'string' || s.length < 8) continue;
    for (const v of variants(s)) if (v.length >= 8) t = t.split(v).join('[redacted]');
  }
  for (const re of KEY_PATTERNS) t = t.replace(new RegExp(re.source, 'g'), '[redacted]');
  return t;
}

/** Keep untrusted text from closing the data block it is wrapped in. */
export function neutralise(text, tag) {
  return String(text ?? '').replace(new RegExp(`<(\\s*/?\\s*${tag})`, 'gi'), '&lt;$1');
}

/** The mail asks for a fixed one-line answer, e.g. "ANSWER: <value>". */
export function wantsAnswerLine(body) {
  return /\bANSWER:\s*<[^>\n]+>/i.test(String(body ?? '')); // anywhere in a line: "one line again: ANSWER: <x>"
}

/** The first "ANSWER: ..." line of a reply, or null. Everything else the model wrote is dropped. */
export function toAnswerLine(reply) {
  const m = /^\s*(ANSWER:[^\n]*\S)\s*$/im.exec(String(reply ?? ''));
  return m ? m[1].trim() : null;
}
