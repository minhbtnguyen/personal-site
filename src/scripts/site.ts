/* Client behaviors from the original template. Each page is static HTML, so
   every behavior mounts only when its elements are present. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Appearance ---------- */
const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.3 8.3 0 0 1 9.4 3.8a8.3 8.3 0 1 0 10.8 10.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
type Theme = 'light' | 'dark';
/** The saved choice; light unless the visitor picked dark. */
const themeEffective = (): Theme => {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'dark' ? 'dark' : 'light';
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
  // Safari tints its toolbar with theme-color; match the nav bar in each theme.
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', eff === 'dark' ? '#121213' : '#fbfbfd');
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach(b => {
    b.innerHTML = eff === 'dark' ? SUN : MOON;
    b.setAttribute('aria-label', eff === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* ---------- Filters (Projects by category, Writing by type) ---------- */
function applyFilter(kind: string, value: string) {
  document.querySelectorAll<HTMLElement>(`[data-filter="${kind}"]`).forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.value === value));
    if (b.dataset.value === value) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); // bring a half-hidden tab fully into view
  });
  // A project lists its categories as "A|B"; it matches if any of them is selected.
  const match = (el: HTMLElement) => value === 'All' || (el.dataset[kind] ?? '').split('|').includes(value);
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
      g.querySelector('[data-yc]')!.textContent = `${n} ${n === 1 ? 'writing' : 'writings'}`;
    });
    count.textContent = `${total} ${total === 1 ? 'writing' : 'writings'}`;
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
  // "Show all" buttons expand the list right before them (experience, skills).
  const xt = t.closest<HTMLElement>('[data-expand]');
  if (xt) {
    const list = xt.previousElementSibling as HTMLElement, open = xt.getAttribute('aria-expanded') === 'true';
    list.toggleAttribute('data-collapsed', open);
    xt.setAttribute('aria-expanded', String(!open));
    xt.textContent = (open ? xt.dataset.more : xt.dataset.less) ?? '';
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

/* ---------- Filter bars: fade whichever edge has more tabs to scroll to ---------- */
function mountSegFade() {
  document.querySelectorAll<HTMLElement>('.seg').forEach(seg => {
    const update = () => {
      seg.classList.toggle('fade-l', seg.scrollLeft > 1);
      seg.classList.toggle('fade-r', seg.scrollLeft + seg.clientWidth < seg.scrollWidth - 1);
    };
    update();
    seg.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update, { passive: true });
  });
}

syncThemeUI();
mountDecode();
mountDraw();
mountSegFade();
