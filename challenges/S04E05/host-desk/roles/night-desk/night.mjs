// The night's poller: claims a job on the board, keeps it beating, starts the night, pulls the events and wakes the
// night-desk for each one (run.mjs), then acks the event and posts its result. It stops after the night closes.
//
//   node roles/night-desk/night.mjs <challenge url>      (from host-desk/)
//
// The attempt comes from host-desk/vars.json (`ATTEMPT`). JOB names the job (default `night-desk/1`).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mayReach } from './extensions/hosts.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const desk = join(here, '..', '..');
const base = (process.argv[2] ?? process.env.CHALLENGE_URL ?? '').replace(/\/+$/, '');
const JOB = process.env.JOB ?? 'night-desk/1';
const PULL_EVERY_MS = 5_000;
const AFTER_CLOSE_MS = 60_000;

if (!/^https?:\/\//.test(base)) {
  console.error('usage: node roles/night-desk/night.mjs <challenge url>');
  process.exit(1);
}
// The attempt goes to the course only: a host it may reach (roles/night-desk/hosts.json), https (security review 2026-11-16 #10).
if (!mayReach('ATTEMPT', base) && !mayReach('TICKET', base)) {
  console.error(`not started: the attempt may not reach ${new URL(base).host} (roles/night-desk/hosts.json)`);
  process.exit(1);
}
const attempt = JSON.parse(readFileSync(join(desk, 'vars.json'), 'utf8')).ATTEMPT;
if (!attempt) {
  console.error('No ATTEMPT in host-desk/vars.json: fetch the manual once and put the attempt from its reply there.');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function call(method, path, body) {
  // A network error must not end the night: try again, then answer status 0 (the loop pulls again).
  let res;
  for (let i = 0; i < 3 && !res; i++) {
    try {
      res = await fetch(`${base}${path}`, {
        method,
        headers: { authorization: `Bearer ${attempt}`, ...(body ? { 'content-type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch (e) {
      console.error(`${method} ${path} → network error (${e.cause?.code ?? e.message}), try ${i + 1}`);
    }
  }
  if (!res) return { status: 0, body: {} };
  const json = await res.json().catch(() => ({}));
  if (!res.ok) console.error(`${method} ${path} → ${res.status} ${json.message ?? ''}`);
  return { status: res.status, body: json };
}

// One start of the night-desk for one event: the event in a file, its result back in another. Its answer = the status
// it wrote (applied, conflict or parked). It failed, ran out of time or wrote none → no status and why: the poller then
// posts nothing for that event and says so in its log (a made-up result would tell the course the desk acted).
// ROLE_TIMEOUT_MS sets the time (default 90 s, inside the 2 minutes an event has for its result).
const ROLE_TIMEOUT_MS = Number(process.env.ROLE_TIMEOUT_MS) || 90_000;
const STATUSES = ['applied', 'conflict', 'parked'];
function wake(event) {
  const inbox = join(desk, 'night', 'inbox');
  mkdirSync(inbox, { recursive: true });
  const eventFile = join(inbox, `${event.seq}.json`);
  const resultFile = join(inbox, `${event.seq}.result.json`);
  writeFileSync(eventFile, JSON.stringify(event, null, 2));
  rmSync(resultFile, { force: true });
  return new Promise((done) => {
    let late = false;
    const child = spawn(process.execPath, [join(here, 'run.mjs')], { cwd: here, stdio: ['ignore', 'inherit', 'inherit'], env: { ...process.env, NIGHT_EVENT: eventFile, NIGHT_RESULT: resultFile } });
    const timer = setTimeout(() => {
      late = true;
      child.kill();
    }, ROLE_TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(timer);
      let status;
      try {
        status = JSON.parse(readFileSync(resultFile, 'utf8')).status;
      } catch {}
      if (STATUSES.includes(status)) return done({ status });
      const why = late ? `the night-desk ran over ${ROLE_TIMEOUT_MS / 1000} s` : code ? `the night-desk stopped with exit code ${code}` : 'the night-desk wrote no status';
      done({ status: null, why });
    });
  });
}

const claim = await call('POST', '/board/claims', { job: JOB, role: 'night-desk' });
if (claim.status !== 200) process.exit(1);
const beatEveryMs = Math.max(claim.body.beatEveryMs ?? 30_000, 1_000);
await call('POST', '/board/heartbeats', { job: JOB });
const beats = setInterval(() => void call('POST', '/board/heartbeats', { job: JOB }).catch(() => {}), beatEveryMs);

const night = await call('POST', '/events/window');
if (night.status !== 200) process.exit(1);
const closesAt = Date.parse(night.body.closesAt);
console.log(`night: ${night.body.opensAt} → ${night.body.closesAt} · job ${JOB}`);

// Events answered so far (id → content and status), kept on disk so a restart does not answer them again.
const handledFile = join(desk, 'night', 'handled.json');
mkdirSync(join(desk, 'night'), { recursive: true });
const handled = existsSync(handledFile) ? JSON.parse(readFileSync(handledFile, 'utf8')) : {};

let cursor = '0';
while (true) {
  const page = await call('GET', `/events?after=${cursor}&job=${encodeURIComponent(JOB)}`);
  if (page.status === 200) {
    for (const event of page.body.events ?? []) {
      // Its seq names the event's file in night/inbox: a whole number only (security review 2026-11-16 #11).
      if (!Number.isInteger(event.seq) || event.seq < 0) {
        console.error(`event skipped: its seq is not a whole number (${JSON.stringify(event.seq)})`);
        continue;
      }
      console.log(`event ${event.seq}: ${event.type} ${event.id}`);
      // An event the desk already answered, delivered again with the same content: ack it, answer nothing again.
      // The course counts each time the desk says it applied an event, so one event is answered once.
      const data = JSON.stringify(event.data);
      if (handled[event.id] && handled[event.id].data === data) {
        console.log(`event ${event.seq} (${event.id}) came again: already answered ${handled[event.id].status}, not answered twice.`);
        await call('POST', '/events/ack', { ids: [event.id] });
        continue;
      }
      const { status, why } = await wake(event);
      await call('POST', '/events/ack', { ids: [event.id] });
      if (status) {
        const r = await call('POST', '/events/results', { id: event.id, result: { status } });
        if (r.status === 200) {
          handled[event.id] = { data, status };
          writeFileSync(handledFile, JSON.stringify(handled, null, 2));
        }
      } else console.error(`event ${event.seq} (${event.id}): no result posted: ${why}.`);
    }
    cursor = page.body.cursor ?? cursor;
  }
  if (Date.now() > closesAt + AFTER_CLOSE_MS && !(page.body.events ?? []).length) break;
  await sleep(PULL_EVERY_MS);
}
clearInterval(beats);
console.log('The night is over. Changes: host-desk/night/changes.json');
if (!existsSync(join(desk, 'night', 'changes.json'))) console.log('(no changes recorded)');
