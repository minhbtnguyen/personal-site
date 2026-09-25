/* HTML/SVG generators ported from the original template. They return markup
   strings, rendered in components with `set:html`. */
import type { Project, Post } from './content';
import { SITE } from '../data/site';
import { asset, isExternal, url } from './content';

type Visual = NonNullable<Project['data']['visual']>;
type Architecture = NonNullable<Project['data']['architecture']>;
type Figure = NonNullable<Post['data']['figure']>;
type Chart = Figure['chart'];

export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
/** Escape text and format `backticks` as inline code. */
export const inline = (s: string) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

export const CHEV = '<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const EXT = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Email link attributes. The address ships base64-encoded so address
    harvesters scanning the HTML don't find it; the page script decodes it into
    a mailto: link. Without JavaScript the link goes to the contact section. */
export const mailAttrs = () => ({ href: url('#contact'), 'data-mail': btoa(SITE.owner.email) });

/** Attributes for a link that leaves the site: new tab, no opener, no referrer. */
export const extAttrs = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parseDate = (d: string) => { const [y, m, day] = d.split('-').map(Number); return { y: y!, m: m || 1, d: day || 1 }; };
export const yearOf = (d: string) => parseDate(d).y;
export const fmtLong = (d: string) => { const p = parseDate(d); return `${MONTHS[p.m - 1]} ${p.d}, ${p.y}`; };
export const fmtShort = (d: string) => { const p = parseDate(d); return `${MONTHS[p.m - 1]!.slice(0, 3)} ${p.d}`; };
export const statusClass = (s: string) => /live/i.test(s) ? 'live' : /progress/i.test(s) ? 'wip' : '';

let uid = 0;
export const nextId = (p: string) => p + (++uid);

/** Collects footnotes in page order; the layout footer lists them. */
export class Footnotes {
  list: string[] = [];
  ref(text?: string) {
    if (!text) return '';
    this.list.push(text);
    const n = this.list.length;
    return `<sup><a href="#fn-${n}" aria-label="Footnote ${n}">${n}</a></sup>`;
  }
}

/* ---------- Visual kinds ---------- */
function chipSVG(blocks: Extract<Visual, { kind: 'chip' }>['blocks']) {
  const id = nextId('chip'), X0 = 84, Y0 = 84, W = 352, H = 352, G = 16;
  const rows = Math.max(1, Math.ceil(blocks.length / 2)), rh = (H - G * (rows - 1)) / rows;
  const blk = (b: typeof blocks[number], x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#${id}${b.accent ? 'c' : 'f'})" stroke="${b.accent ? '#3fd1bf' : '#3a3a3c'}" stroke-opacity="${b.accent ? .7 : 1}"/><text x="${x + 14}" y="${y + 26}"${b.accent ? ' fill="#8ee8dc"' : ''}>${esc(b.label)}</text>`;
  let out = '';
  for (let r = 0; r < rows; r++) {
    const y = Y0 + r * (rh + G), pair = blocks.slice(r * 2, r * 2 + 2);
    if (pair.length === 1) out += blk(pair[0]!, X0, y, W, rh);
    else { const w1 = (W - G) * (r % 2 ? 0.62 : 0.5); out += blk(pair[0]!, X0, y, w1, rh) + blk(pair[1]!, X0 + w1 + G, y, W - G - w1, rh); }
  }
  return `<svg viewBox="0 0 520 520" role="img" aria-label="${esc('Component diagram: ' + blocks.map(b => b.label).join(', '))}">
    <defs>
      <linearGradient id="${id}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a3c"/><stop offset=".5" stop-color="#1c1c1e"/><stop offset="1" stop-color="#2c2c2e"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5e5ea"/><stop offset=".45" stop-color="#636366"/><stop offset="1" stop-color="#c7c7cc"/></linearGradient>
      <pattern id="${id}f" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#111113"/><path d="M0 6L6 0" stroke="#2a2a2d"/></pattern>
      <pattern id="${id}c" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#062522"/><rect x="1.5" y="1.5" width="7" height="7" rx="1.2" fill="#0d5c54"/></pattern>
    </defs>
    <rect x="10" y="10" width="500" height="500" rx="56" fill="#1c1c1e" stroke="#48484a" stroke-width="2"/>
    <rect x="38" y="38" width="444" height="444" rx="34" fill="none" stroke="#4a4a4d" stroke-width="7" stroke-dasharray="2 9"/>
    <rect x="66" y="66" width="388" height="388" rx="18" fill="#0a0a0b" stroke="#3a3a3c"/>
    <g font-size="13" fill="#a1a1a6">${out}</g></svg>`;
}

export function windowHTML(title: string | undefined, bodyHTML: string, closed = false) {
  return `<div class="window${closed ? ' closed' : ''}"><div class="window-bar"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span><span class="window-title">${esc(title || 'Terminal')}</span></div><div class="window-body">${bodyHTML}</div></div>`;
}

/** Project visual; falls back to a monogram when the project has none. */
export function visual(v: Visual | undefined, name: string): string {
  const mono = () => `<div class="mono-card" aria-hidden="true">${esc(name.split(/\s+/).map(w => w[0]).join('').slice(-1))}</div>`;
  if (!v) return mono();
  switch (v.kind) {
    case 'chip': return `<div class="die-wrap">${chipSVG(v.blocks)}</div>`;
    case 'terminal': return windowHTML(v.title, v.lines.map(l => `<span class="k-lbl">${esc(l.label)}</span><span${l.tone ? ` class="k-${l.tone}"` : ''}>${esc(l.text)}</span>`).join('\n'));
    case 'steps': return `<div class="steps-card"><ol>${v.steps.map(s => `<li><span class="sdot"></span><div><b>${esc(s.title)}</b><span class="s">${esc(s.sub)}</span></div></li>`).join('')}</ol></div>`;
    case 'image': return `<img class="shot" src="${esc(asset(v.src))}" alt="${esc(v.alt || '')}">`;
  }
}

/* ---------- Pipeline diagram ---------- */
export function pipelineSVG(arch: Architecture) {
  const st = arch.stages, n = st.length, NH = 72, GAP = 54, TOP = 24;
  const hasSide = st.some(s => s.side), mx = 40, mw = hasSide ? 240 : 360, cx = mx + mw / 2;
  const H = TOP + n * NH + (n - 1) * GAP + (arch.output ? 76 : 24);
  const id = nextId('ah'), mk = `url(#${id})`;
  let s = `<svg id="pipe" viewBox="0 0 440 ${H}" role="img" aria-label="${esc('Pipeline: ' + st.map(x => x.title).join(', then '))}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#8e8e93"/></marker></defs>`;
  if (arch.loop && n > 1) {
    const yl = TOP + (n - 1) * (NH + GAP) + NH / 2, yf = TOP + NH / 2, ym = (yl + yf) / 2;
    s += `<path class="flow" data-i="${n - 1}" d="M${mx} ${yl} H16 V${yf} H${mx - 6}" marker-end="${mk}"/><text class="loop-label" transform="rotate(-90 9 ${ym})" x="9" y="${ym}" text-anchor="middle">${esc(arch.loop)}</text>`;
  }
  st.forEach((t, i) => {
    const y = TOP + i * (NH + GAP);
    if (i < n - 1) s += `<line class="flow" x1="${cx}" y1="${y + NH}" x2="${cx}" y2="${y + NH + GAP - 6}" marker-end="${mk}"/>`;
    s += `<g class="node" data-i="${i}"><rect x="${mx}" y="${y}" width="${mw}" height="${NH}" rx="14"/><text class="nt" x="${mx + 20}" y="${y + 32}">${esc(t.title)}</text>${t.sub ? `<text class="ns" x="${mx + 20}" y="${y + 54}">${esc(t.sub)}</text>` : ''}</g>`;
    if (t.side) {
      s += `<line class="flow" data-i="${i}" x1="${mx + mw + 6}" y1="${y + NH / 2}" x2="314" y2="${y + NH / 2}" marker-start="${mk}" marker-end="${mk}"/>`;
      s += `<g class="node" data-i="${i}"><rect x="320" y="${y}" width="104" height="${NH}" rx="14"/><text class="nt" x="336" y="${y + 32}" style="font-size:15px">${esc(t.side.title)}</text><text class="ns" x="336" y="${y + 54}">${esc(t.side.sub || '')}</text></g>`;
    }
  });
  if (arch.output) {
    const y = TOP + (n - 1) * (NH + GAP) + NH;
    s += `<line class="flow" x1="${cx}" y1="${y}" x2="${cx}" y2="${y + 40}" marker-end="${mk}"/><text class="out-label" x="${cx}" y="${y + 64}" text-anchor="middle">${esc(arch.output)}</text>`;
  }
  return s + '</svg>';
}

/* ---------- Line chart ---------- */
export function chartSVG(c: Chart, mini = false) {
  const x0 = 80, x1 = 600, y0 = 40, y1 = 300, n = c.x.length;
  const X = (i: number) => n === 1 ? (x0 + x1) / 2 : (x0 + 20) + i * ((x1 - x0 - 40) / (n - 1));
  const Y = (v: number) => y1 - v / c.yMax * (y1 - y0);
  const color = (sr: Chart['series'][number]) => sr.tone === 'muted' ? 'var(--series-muted)' : 'var(--series)';
  let s = '';
  if (!mini) {
    for (let v = 0; v <= c.yMax + 1e-9; v += c.yStep) {
      s += `<line class="gl" x1="${x0}" y1="${Y(v)}" x2="${x1 + 10}" y2="${Y(v)}"/><text class="tick" x="${x0 - 12}" y="${Y(v) + 4}" text-anchor="end">${+v.toFixed(2)}</text>`;
    }
    c.x.forEach((l, i) => { s += `<text class="tick" x="${X(i)}" y="${y1 + 26}" text-anchor="middle">${esc(l)}</text>`; });
    if (c.xLabel) s += `<text class="axt" x="${(x0 + x1) / 2}" y="${y1 + 52}" text-anchor="middle">${esc(c.xLabel)}</text>`;
    if (c.yLabel) s += `<text class="axt" x="${x0}" y="22">${esc(c.yLabel)}</text>`;
  }
  if (c.threshold) {
    s += `<line class="thr" x1="${x0}" y1="${Y(c.threshold.value)}" x2="${x1 + 10}" y2="${Y(c.threshold.value)}"/>`;
    if (!mini) s += `<text class="axt" x="${x0 + 4}" y="${Y(c.threshold.value) - 8}">${esc(c.threshold.label)}</text>`;
  }
  c.series.slice().reverse().forEach(sr => {
    const pts = sr.values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    s += `<polyline class="${mini ? '' : 'anim'}" pathLength="1" points="${pts}" fill="none" stroke="${color(sr)}" stroke-width="${mini ? 7 : 3.5}" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  (c.markers || []).forEach(m => {
    const v = c.series[m.series]?.values[m.index];
    if (v === undefined) return;
    const mxp = X(m.index), myp = Y(v);
    s += `<g class="${mini ? '' : 'pop'}"><circle cx="${mxp}" cy="${myp}" r="${mini ? 18 : 11}" fill="var(--danger)" opacity=".2"/><circle cx="${mxp}" cy="${myp}" r="${mini ? 11 : 6}" fill="var(--danger)"/>${mini ? '' : `<text class="mk-t" x="${mxp - 12}" y="${myp - 14}" text-anchor="end" fill="var(--danger)">${esc(m.label)}</text>`}</g>`;
  });
  const vb = mini ? `${x0} ${y0 - 20} ${x1 - x0 + 20} ${y1 - y0 + 30}` : '0 0 640 360';
  const a11y = mini ? ' aria-hidden="true"' : ` role="img" aria-label="${esc('Chart: ' + c.series.map(sr => sr.name + ' ' + sr.values.join(', ')).join('; '))}"`;
  return `<svg viewBox="${vb}"${a11y}>${s}</svg>`;
}

export function figureHTML(f: Figure, notes: Footnotes | null, inBody = false) {
  const legend = f.chart.series.map(sr => `<span><i style="background:${sr.tone === 'muted' ? 'var(--series-muted)' : 'var(--series)'}"></i>${esc(sr.name)}</span>`).join('');
  const note = notes ? notes.ref(f.footnote) : '';
  return `<figure class="fig${inBody ? ' in-body' : ''}"><div class="fig-tile" data-draw><div class="fig-head"><h2>${esc(f.title)}${note}</h2><div class="leg">${legend}</div></div>${chartSVG(f.chart)}</div>${f.caption ? `<figcaption class="cap">${inline(f.caption)}</figcaption>` : ''}</figure>`;
}

/** Terminal output: `$` prompts in the accent color, error lines in red. */
export function outputHTML(text: string) {
  return text.split('\n').map(l => {
    if (l.startsWith('$')) return `<span class="o-pr">$</span>${esc(l.slice(1))}`;
    if (/error|out of memory|failed|traceback/i.test(l)) return `<span class="o-err">${esc(l)}</span>`;
    return esc(l);
  }).join('\n');
}

/** Split text into tokens for the hero decode effect. */
export function tokenize(text: string) {
  const words = text.match(/\s?[A-Za-z’']+|\s?[^\sA-Za-z]+/g) || [];
  const out: string[] = [];
  words.forEach(w => {
    const core = w.trim();
    if (core.length > 8) { const cut = w.length - Math.ceil(core.length * 0.45); out.push(w.slice(0, cut), w.slice(cut)); }
    else out.push(w);
  });
  return out;
}
