/* Client behaviors from the original template. Each page is static HTML, so
   every behavior mounts only when its elements are present. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Appearance ---------- */
const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.3 8.3 0 0 1 9.4 3.8a8.3 8.3 0 1 0 10.8 10.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
type Theme = 'light' | 'dark';
/** The saved choice, or the system setting when the visitor hasn't chosen. */
const themeEffective = (): Theme => {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'light' || t === 'dark' ? t : darkQuery.matches ? 'dark' : 'light';
};
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeUI();
}
function setTheme(theme: Theme) {
  try { localStorage.setItem('theme', theme); } catch { /* storage blocked */ }
  // A view transition restyles the page once and cross-fades two snapshots on
  // the GPU; transitioning colors per element repainted every element each frame.
  // Browsers without it (and reduced motion) switch instantly.
  if (reduceMotion || !document.startViewTransition) applyTheme(theme);
  else document.startViewTransition(() => applyTheme(theme));
}
function syncThemeUI() {
  const eff = themeEffective();
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach(b => {
    b.innerHTML = eff === 'dark' ? SUN : MOON;
    b.setAttribute('aria-label', eff === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}
darkQuery.addEventListener('change', syncThemeUI);

/* ---------- Filters (Projects by category, Blog by type) ---------- */
function applyFilter(kind: string, value: string) {
  document.querySelectorAll<HTMLElement>(`[data-filter="${kind}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === value)));
  const match = (el: HTMLElement) => value === 'All' || el.dataset[kind] === value;
  const count = document.getElementById('count')!;
  if (kind === 'cat') {
    let n = 0;
    document.querySelectorAll<HTMLElement>('.pcard').forEach(c => { const ok = match(c); c.hidden = !ok; if (ok) n++; });
    document.getElementById('empty')!.hidden = n > 0;
    count.textContent = `${n} ${n === 1 ? 'project' : 'projects'}`;
  } else {
    let total = 0;
    document.querySelectorAll<HTMLElement>('.tl-year').forEach(g => {
      let n = 0;
      g.querySelectorAll<HTMLElement>('.tl-item').forEach(it => { const ok = match(it); it.hidden = !ok; if (ok) n++; });
      g.hidden = n === 0; total += n;
      g.querySelector('[data-yc]')!.textContent = `${n} ${n === 1 ? 'post' : 'posts'}`;
    });
    count.textContent = `${total} ${total === 1 ? 'post' : 'posts'}`;
  }
}

/* ---------- Home hero: token-by-token decode ---------- */
function mountDecode() {
  const box = document.getElementById('decode'), caret = document.getElementById('caret');
  if (!box || !caret) return;
  // Animate once per visit; returning to the homepage shows the finished line.
  let seen = false;
  try { seen = sessionStorage.getItem('decoded') === '1'; sessionStorage.setItem('decoded', '1'); } catch { /* storage blocked */ }
  if (reduceMotion || seen) { box.classList.add('done'); caret.remove(); return; }
  const toks = Array.from(box.querySelectorAll('.tok'));
  box.classList.add('decoding'); box.insertBefore(caret, toks[0] ?? null);
  let i = 0;
  const step = () => {
    if (i >= toks.length) { box.appendChild(caret); box.classList.add('done'); return; }
    toks[i]!.classList.add('on'); toks[i]!.after(caret); i++;
    setTimeout(step, 50 + Math.random() * 90);
  };
  setTimeout(step, 300);
}

/* ---------- Project page: pipeline follows the scrolled step ---------- */
function mountScrolly() {
  const pipe = document.getElementById('pipe'), steps = Array.from(document.querySelectorAll<HTMLElement>('.step'));
  if (!pipe || !steps.length) return;
  const activate = (k: number) => {
    steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === k));
    pipe.querySelectorAll<SVGElement>('[data-i]').forEach(el => el.classList.toggle('on', Number(el.dataset.i) === k));
  };
  activate(0);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(Number((e.target as HTMLElement).dataset.step)); }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => io.observe(s));
}

/* ---------- Charts draw in when scrolled into view ---------- */
function mountDraw() {
  const els = Array.from(document.querySelectorAll('[data-draw]'));
  if (!els.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }), { threshold: .35 });
  els.forEach(e => io.observe(e));
}

/* ---------- Clicks ---------- */
document.addEventListener('click', e => {
  const t = e.target as Element;
  const xt = t.closest<HTMLElement>('[data-xp-toggle]');
  if (xt) {
    const list = xt.previousElementSibling as HTMLElement, open = xt.getAttribute('aria-expanded') === 'true';
    list.toggleAttribute('data-xp-collapsed', open);
    xt.setAttribute('aria-expanded', String(!open));
    xt.textContent = open ? `Show all ${list.children.length} roles` : 'Show fewer roles';
    if (open) list.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    return;
  }
  const tt = t.closest('[data-theme-toggle]');
  if (tt) { setTheme(themeEffective() === 'dark' ? 'light' : 'dark'); return; }
  const f = t.closest<HTMLElement>('[data-filter]');
  if (f) { applyFilter(f.dataset.filter!, f.dataset.value!); return; }
  const c = t.closest<HTMLElement>('[data-copy]');
  if (c) {
    const el = document.getElementById(c.dataset.copy!); if (!el) return;
    const done = (label: string) => { c.textContent = label; setTimeout(() => { c.textContent = 'Copy'; }, 1800); };
    const fallback = () => { const rg = document.createRange(); rg.selectNodeContents(el); const s = getSelection(); s?.removeAllRanges(); s?.addRange(rg); done('Selected'); };
    navigator.clipboard ? navigator.clipboard.writeText(el.innerText).then(() => done('Copied'), fallback) : fallback();
  }
});

/* ---------- Email links (see mailAttrs in src/lib/render.ts) ---------- */
document.querySelectorAll<HTMLAnchorElement>('a[data-mail]').forEach(a => { a.href = `mailto:${atob(a.dataset.mail!)}`; });

syncThemeUI();
mountDecode();
mountScrolly();
mountDraw();
