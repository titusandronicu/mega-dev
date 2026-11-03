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
 * Does the mail prove it came from the domain in its From address?
 * "pass" only when DMARC passed: that means SPF or DKIM passed AND matched the From domain, so a forger who sends
 * "From: owner@example.com" from another server cannot pass. Anything else is not trusted:
 *   "fail"    - DMARC failed, or is "none" (no policy to check against), or is missing while other fields exist;
 *   "unknown" - the mail carries no authentication result at all (treated as not trusted too).
 */
export function authVerdict(ar) {
  if (!ar || typeof ar !== 'object') return 'unknown';
  return ar.dmarc === 'pass' ? 'pass' : 'fail';
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
