#!/usr/bin/env node
// tools/frame-scan.mjs <video> [--strip y0:y1] [--threshold N]: see tools/frame-scan.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const usage = () => { console.error('usage: tools/frame-scan <video.mp4> [--strip y0:y1] [--threshold N]'); process.exit(64); };
const args = process.argv.slice(2);
let video = null, strip = [45, 65], threshold = 25;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--strip') { const m = /^(\d+):(\d+)$/.exec(args[++i] ?? ''); if (!m || +m[1] >= +m[2]) usage(); strip = [+m[1], +m[2]]; }
  else if (args[i] === '--threshold') { threshold = Number(args[++i]); if (!Number.isFinite(threshold) || threshold < 0) usage(); }
  else if (args[i].startsWith('--') || video) usage();
  else video = args[i];
}
if (!video || !existsSync(video)) usage();

const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', video], { encoding: 'utf8' });
if (probe.status !== 0 || !probe.stdout.trim()) { console.error('ffprobe failed (is ffmpeg installed and the file a video?)'); process.exit(1); }
const [w, h, rate] = probe.stdout.trim().split(',');
const W = +w, H = +h, [num, den] = rate.split('/').map(Number), fps = num / (den || 1);
const y0 = Math.min(strip[0], H - 1), y1 = Math.min(strip[1], H);

const means = [];
const frameBytes = W * H * 3;
let buf = Buffer.alloc(0);
const ff = spawn('ffmpeg', ['-v', 'error', '-i', video, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { stdio: ['ignore', 'pipe', 'inherit'] });
ff.stdout.on('data', (chunk) => {
  buf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
  while (buf.length >= frameBytes) {
    const sum = [0, 0, 0];
    for (let y = y0; y < y1; y++) {
      const row = y * W * 3;
      for (let x = 0; x < W; x++) { const p = row + x * 3; sum[0] += buf[p]; sum[1] += buf[p + 1]; sum[2] += buf[p + 2]; }
    }
    const n = (y1 - y0) * W;
    means.push(sum.map((s) => s / n));
    buf = buf.subarray(frameBytes);
  }
});
ff.on('close', (code) => {
  if (code !== 0 || means.length === 0) { console.error('ffmpeg failed or no frames'); process.exit(1); }
  const median = (a) => { const s = [...a].sort((p, q) => p - q); return s[Math.floor(s.length / 2)]; };
  const base = [0, 1, 2].map((c) => median(means.map((m) => m[c])));
  const odd = means.map((m, i) => (Math.max(...m.map((v, c) => Math.abs(v - base[c]))) > threshold ? i : -1)).filter((i) => i >= 0);
  const bursts = [];
  for (const i of odd) {
    const last = bursts[bursts.length - 1];
    if (last && i === last.endFrame + 1) last.endFrame = i; else bursts.push({ startFrame: i, endFrame: i });
  }
  for (const b of bursts) { b.startSec = +(b.startFrame / fps).toFixed(2); b.endSec = +((b.endFrame + 1) / fps).toFixed(2); }
  console.log(JSON.stringify({ video, frames: means.length, fps, strip: [y0, y1], threshold, base: base.map((v) => Math.round(v)), bursts }, null, 2));
});
