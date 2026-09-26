/* HTML/SVG generators ported from the original template. They return markup
   strings, rendered in components with `set:html`. */
import type { Writing } from './content';
import { SITE } from '../data/site';
import { isExternal, url } from './content';

type Figure = NonNullable<Writing['data']['figure']>;
type Chart = Figure['chart'];

export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
/** Escape text and format `backticks` as inline code. */
export const inline = (s: string) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

export const CHEV = '<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const AWARD = '<svg class="award-i" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8v3a4 4 0 0 1-8 0zM4 3H2v1a2.5 2.5 0 0 0 2.5 2.5M12 3h2v1a2.5 2.5 0 0 1-2.5 2.5M8 9v3M5.5 14h5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

/** Default project visual: a stack of layers (the ML stack), top layer lit.
    Colors come from CSS (.glyph) so it follows the card's theme. */
const layer = (y: number, on = false) =>
  `<g${on ? ' class="on"' : ''}><path class="side" d="M40 ${y}L100 ${y + 28}L160 ${y}v8L100 ${y + 36}L40 ${y + 8}z"/><path class="face" d="M100 ${y - 28}L160 ${y}L100 ${y + 28}L40 ${y}z"/></g>`;
export const PROJECT_GLYPH = `<svg class="glyph" viewBox="0 0 200 160" aria-hidden="true">${layer(112)}${layer(80)}${layer(48, true)}</svg>`;

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
