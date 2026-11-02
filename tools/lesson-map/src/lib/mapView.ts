type Item = { id: string; topic: string; n: number; label: string; text: string; evidence: string; fix: string; status: string; ideas: string[] };
type Idea = { id: string; label: string; summary: string; count: number };
type Topic = { id: string; label: string; title: string; retro: boolean; feedback?: string[] };
const data = JSON.parse(document.getElementById('map-data')!.textContent!) as { topics: Topic[]; items: Item[]; ideas: Idea[] };

const $ = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends Element>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const map = $('#map'), svg = $<SVGSVGElement>('#links'), panel = $('#panel');
const itemEl = (id: string) => $<HTMLElement>(`.item[data-item="${CSS.escape(id)}"]`);
const ideaEl = (id: string) => $<HTMLElement>(`.idea[data-idea="${id}"]`);
const topicEl = (id: string) => $<HTMLElement>(`.topic[data-topic="${id}"]`);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

let sel: { kind: 'item' | 'idea' | 'topic'; id: string } | null = null;

function box(el: Element) {
  const m = map.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { l: r.left - m.left, r: r.right - m.left, y: r.top - m.top + r.height / 2 };
}
const ns = 'http://www.w3.org/2000/svg';
function path(d: string, cls: string, attrs: Record<string, string> = {}) {
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', d); p.setAttribute('class', cls);
  for (const [k, v] of Object.entries(attrs)) p.setAttribute(k, v);
  svg.appendChild(p);
}
function draw() {
  svg.replaceChildren();
  const m = map.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${m.width} ${m.height}`);
  if (getComputedStyle(svg).display === 'none') return;
  const seen = new Set<string>();
  for (const t of data.topics) {
    const tEl = topicEl(t.id), label = $('.topic-label', tEl), collapsed = tEl.classList.contains('collapsed');
    const lb = box(label), mine = data.items.filter((i) => i.topic === t.id);
    if (!collapsed) for (const i of mine) {
      const b = box(itemEl(i.id)), mx = lb.r + 14;
      path(`M${lb.r} ${lb.y} H${mx} V${b.y} H${b.l}`, 'elbow');
    }
    for (const i of mine) for (const id of i.ideas) {
      const from = collapsed ? lb : box(itemEl(i.id)), key = collapsed ? `${t.id}>${id}` : `${i.id}>${id}`;
      if (collapsed && seen.has(key)) continue;
      seen.add(key);
      const to = box(ideaEl(id)), dx = Math.max(40, (to.l - from.r) * 0.5);
      path(`M${from.r} ${from.y} C${from.r + dx} ${from.y} ${to.l - dx} ${to.y} ${to.l} ${to.y}`, 'link',
        { 'data-from': i.id, 'data-link-idea': id });
    }
  }
  paint();
}

function active(l: Element) {
  if (!sel) return false;
  const item = data.items.find((i) => i.id === l.getAttribute('data-from'))!;
  if (sel.kind === 'item') return item.id === sel.id;
  if (sel.kind === 'idea') return l.getAttribute('data-link-idea') === sel.id;
  return item.topic === sel.id;
}
function paint() {
  map.classList.toggle('has-sel', !!sel);
  $$('.item,.idea,.topic-label').forEach((e) => e.classList.remove('sel', 'on'));
  $$('[aria-pressed]').forEach((e) => e.setAttribute('aria-pressed', 'false'));
  if (sel) {
    const items = sel.kind === 'item' ? [sel.id] : sel.kind === 'idea' ? data.items.filter((i) => i.ideas.includes(sel!.id)).map((i) => i.id) : data.items.filter((i) => i.topic === sel!.id).map((i) => i.id);
    const ideas = new Set(data.items.filter((i) => items.includes(i.id)).flatMap((i) => i.ideas));
    items.forEach((id) => itemEl(id).classList.add('on'));
    ideas.forEach((id) => ideaEl(id).classList.add('on'));
    const self = sel.kind === 'item' ? itemEl(sel.id) : sel.kind === 'idea' ? ideaEl(sel.id) : $('.topic-label', topicEl(sel.id));
    self.classList.remove('on'); self.classList.add('sel'); self.setAttribute('aria-pressed', 'true');
  }
  $$('.link', svg).forEach((l) => l.classList.toggle('active', active(l)));
  renderPanel();
}

function renderPanel() {
  if (!sel) {
    panel.innerHTML = `<div class="eyebrow">How to read the map</div><h2>Start anywhere</h2>
      <ol><li><b>Click a finding</b> to read what happened, the evidence and the fix.</li>
      <li><b>Click an idea</b> on the right to light up every finding that uses it, across lessons.</li>
      <li><b>Collapse a lesson</b> with its arrow to see only its links.</li>
      <li>Press <span class="kbd">←</span> <span class="kbd">→</span> to walk the findings. <span class="kbd">Esc</span> clears.</li></ol>
      <button class="go" type="button" data-go>Start with the first finding →</button>`;
    return;
  }
  if (sel.kind === 'item') {
    const i = data.items.find((x) => x.id === sel!.id)!;
    const chips = i.ideas.map((id) => `<button class="chip" type="button" data-pick-idea="${id}">${esc(data.ideas.find((d) => d.id === id)!.label)}</button>`).join('');
    panel.innerHTML = `<div class="eyebrow">${i.topic} · finding ${i.n}</div><h2>${esc(i.label)}</h2><p style="margin:0">${esc(i.text)}</p>
      <div class="chips">${chips}</div>
      <dl><dt>Evidence</dt><dd>${esc(i.evidence || 'none recorded')}</dd><dt>Fix in</dt><dd>${esc(i.fix)}</dd><dt>Status</dt><dd>${esc(i.status)}</dd></dl>`;
  } else if (sel.kind === 'idea') {
    const d = data.ideas.find((x) => x.id === sel!.id)!;
    const list = data.items.filter((i) => i.ideas.includes(d.id)).map((i) => `<li><button type="button" data-pick-item="${i.id}"><b>${i.topic}</b> · ${esc(i.label)}</button></li>`).join('');
    panel.innerHTML = `<div class="eyebrow">Idea · in ${d.count} findings</div><h2>${esc(d.label)}</h2><p style="margin:0">${esc(d.summary)}</p><ul>${list}</ul>`;
  } else {
    const t = data.topics.find((x) => x.id === sel!.id)!;
    const list = data.items.filter((i) => i.topic === t.id).map((i) => `<li><button type="button" data-pick-item="${i.id}">${esc(i.label)}</button></li>`).join('');
    const fb = (t.feedback ?? []).map((f) => `<p style="margin:8px 0 0">“${esc(f)}”</p>`).join('');
    panel.innerHTML = `<div class="eyebrow">Lesson</div><h2>${t.label} · ${esc(t.title)}</h2>${t.retro ? `<ul>${list}</ul>${fb ? `<div class="eyebrow" style="margin-top:14px">Course feedback</div>${fb}` : ''}` : '<p style="margin:0">No retro yet. Add data/retros/' + t.id + '.md and run npm run map.</p>'}`;
  }
}

function select(next: typeof sel, scroll = true) {
  sel = sel && next && sel.kind === next.kind && sel.id === next.id ? null : next;
  paint();
  if (sel && scroll) { const el = sel.kind === 'item' ? itemEl(sel.id) : sel.kind === 'idea' ? ideaEl(sel.id) : null; el?.scrollIntoView({ block: 'nearest' }); }
  try { history.replaceState(null, '', sel?.kind === 'item' ? '#' + sel.id.replace('#', '-') : location.pathname); } catch { /* ignore */ }
}
const visibleItems = () => $$<HTMLElement>('.item').filter((e) => !e.closest('.collapsed')).map((e) => e.dataset.item!);
function walk(dir: number) {
  const v = visibleItems(); if (!v.length) return;
  const at = sel?.kind === 'item' ? v.indexOf(sel.id) : -1;
  const to = v[(at + dir + v.length) % v.length];
  sel = { kind: 'item', id: to }; paint(); itemEl(to).scrollIntoView({ block: 'nearest' });
}
function setCollapsed(t: HTMLElement, c: boolean) {
  t.classList.toggle('collapsed', c);
  $('.topic-label', t).setAttribute('aria-expanded', String(!c));
}

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('.item[data-item],.idea[data-idea],[data-topic-btn],[data-go],[data-pick-idea],[data-pick-item]');
  if (!el) return;
  if (el.dataset.item) select({ kind: 'item', id: el.dataset.item });
  else if (el.dataset.idea) select({ kind: 'idea', id: el.dataset.idea });
  else if (el.dataset.topicBtn) { const t = topicEl(el.dataset.topicBtn); setCollapsed(t, !t.classList.contains('collapsed')); select({ kind: 'topic', id: el.dataset.topicBtn }, false); requestAnimationFrame(draw); return; }
  else if (el.hasAttribute('data-go')) walk(1);
  else if (el.dataset.pickIdea) { sel = null; select({ kind: 'idea', id: el.dataset.pickIdea }); }
  else if (el.dataset.pickItem) { sel = null; select({ kind: 'item', id: el.dataset.pickItem }); }
});
$('#expand').addEventListener('click', () => { $$<HTMLElement>('.topic').forEach((t) => setCollapsed(t, false)); requestAnimationFrame(draw); });
$('#collapse').addEventListener('click', () => { $$<HTMLElement>('.topic').forEach((t) => setCollapsed(t, true)); requestAnimationFrame(draw); });
$('#theme').addEventListener('click', () => {
  const root = document.documentElement, dark = root.dataset.theme ? root.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('lesson-map-theme', root.dataset.theme); } catch { /* ignore */ }
});
document.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).closest('input,textarea')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); walk(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); walk(-1); }
  else if (e.key === 'Escape' && sel) { sel = null; paint(); }
});
new ResizeObserver(() => draw()).observe(map);
document.fonts?.ready.then(draw);
const hash = location.hash.slice(1).replace('-', '#');
if (hash && data.items.some((i) => i.id === hash)) sel = { kind: 'item', id: hash };
draw();
