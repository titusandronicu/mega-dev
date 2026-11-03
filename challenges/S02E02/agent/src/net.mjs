// web_fetch backend. The NAS sits on a home LAN, so the fetcher must never reach it:
// addresses are checked at connect time (no DNS-rebinding gap), redirects are re-checked,
// size, time and content type are capped.
import dns from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';

export class FetchError extends Error {}

function ipv4Private(ip) {
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

export function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) return ipv4Private(ip);
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(l);
    if (mapped) return ipv4Private(mapped[1]);
    return l === '::' || l === '::1' || /^f[cd]/.test(l) || /^fe[89ab]/.test(l) || l.startsWith('ff');
  }
  return true; // not an address we understand: refuse
}

/** dns.lookup replacement that refuses non-public answers. */
export function guardedLookup(hostname, options, cb) {
  dns.lookup(hostname, { ...options, all: true }, (err, addrs) => {
    if (err) return cb(err);
    const bad = addrs.find((a) => isPrivateAddress(a.address));
    if (bad) return cb(new FetchError(`blocked address for ${hostname}`));
    if (options && options.all) return cb(null, addrs);
    const first = addrs[0];
    return cb(null, first.address, first.family);
  });
}

export function htmlToText(html) {
  return html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|br)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t\f\v]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function once(url, { lookup, maxBytes, timeoutMs, allowPrivate }) {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.request(url, {
      method: 'GET',
      lookup: allowPrivate ? undefined : lookup,
      timeout: timeoutMs,
      headers: { 'user-agent': 'mail-agent/1.0 (+reader)', accept: 'text/html,text/plain,application/json;q=0.9', 'accept-encoding': 'identity' },
    }, (res) => {
      const status = res.statusCode ?? 0;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        return resolve({ redirect: new URL(res.headers.location, url) });
      }
      const type = String(res.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
      if (status >= 400) { res.resume(); return reject(new FetchError(`HTTP ${status}`)); }
      if (!/^(text\/|application\/(json|xml|xhtml\+xml))/.test(type)) { res.resume(); return reject(new FetchError(`unsupported content type ${type || 'unknown'}`)); }
      const chunks = []; let size = 0;
      res.on('data', (c) => {
        size += c.length;
        if (size > maxBytes) { res.destroy(); return reject(new FetchError(`page larger than ${maxBytes} bytes`)); }
        chunks.push(c);
      });
      res.on('end', () => resolve({ status, type, body: Buffer.concat(chunks).toString('utf8') }));
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new FetchError(`timeout after ${timeoutMs} ms`)));
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetch a public page and return readable text.
 * Options: maxBytes, timeoutMs, maxRedirects, maxChars; allowPrivate is for tests only.
 */
export async function safeFetch(rawUrl, opts = {}) {
  const o = { maxBytes: 1_000_000, timeoutMs: 10_000, maxRedirects: 3, maxChars: 20_000, allowPrivate: false, lookup: guardedLookup, ...opts };
  let url;
  try { url = new URL(rawUrl); } catch { throw new FetchError('not a valid URL'); }
  for (let hop = 0; hop <= o.maxRedirects; hop++) {
    if (!/^https?:$/.test(url.protocol)) throw new FetchError('only http and https are allowed');
    if (url.username || url.password) throw new FetchError('URLs with credentials are not allowed');
    if (!o.allowPrivate) {
      if (!['', '80', '443'].includes(url.port)) throw new FetchError('only ports 80 and 443 are allowed');
      const host = url.hostname.replace(/^\[|\]$/g, '');
      if (net.isIP(host) && isPrivateAddress(host)) throw new FetchError('blocked address');
    }
    const r = await once(url, o);
    if (r.redirect) { url = r.redirect; continue; }
    const text = r.type.includes('html') || r.type.includes('xml') ? htmlToText(r.body) : r.body;
    const clipped = text.length > o.maxChars;
    return { url: url.toString(), status: r.status, text: clipped ? text.slice(0, o.maxChars) : text, truncated: clipped };
  }
  throw new FetchError('too many redirects');
}
