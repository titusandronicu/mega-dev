// hosts: which host each secret may reach, from hosts.json at the top of the Host Desk (one file for every role).
// A secret with no entry reaches no host.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// host-desk/roles/<role>/extensions/hosts.mjs → host-desk/
const DESK = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

// The fingerprint of hosts.json as the owner had it when the factory made this role (make.mjs writes it here). Who may change
// the hosts a key can reach: the owner only. A hosts.json that no longer matches reaches no host at all.
const PINNED = '__HOSTS_SHA256__';

/** name → the hosts it may reach. Missing file, bad JSON or a changed file → no host for any secret. */
export function loadHosts() {
  try {
    const text = readFileSync(join(DESK, 'hosts.json'), 'utf8');
    if (PINNED.startsWith('__') || createHash('sha256').update(text).digest('hex') !== PINNED) return {};
    const raw = JSON.parse(text);
    return Object.fromEntries(Object.entries(raw).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.map((h) => String(h).toLowerCase())]));
  } catch {
    return {};
  }
}

// A secret travels over https only; plain http only to this machine (localhost, 127.0.0.1, ::1), for a course run locally.
const LOOPBACK = (h) => h === 'localhost' || h.endsWith('.localhost') || h === '127.0.0.1' || h === '[::1]';

/** May the secret `name` go to `url`'s host? */
export const mayReach = (name, url, hosts = loadHosts()) => {
  const u = new URL(url);
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && LOOPBACK(u.hostname.toLowerCase()))) return false;
  return (hosts[name] ?? []).includes(u.host.toLowerCase());
};
