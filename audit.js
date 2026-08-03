(() => {
  const out = { url: location.pathname, issues: [] };
  const add = (t, d) => out.issues.push(t + ': ' + d);

  // 1. overflow horizontal (quebra o mobile)
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    const wide = [...document.querySelectorAll('body *')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.right > de.clientWidth + 2 && r.width > 20 && getComputedStyle(e).position !== 'fixed';
    }).slice(0, 4).map(e => e.tagName + '.' + (e.className || '-').toString().slice(0, 30));
    add('OVERFLOW-X', de.scrollWidth + 'px vs ' + de.clientWidth + ' | ' + wide.join(', '));
  }

  // 2. texto transparente/invisivel que sobrou de animacao
  [...document.querySelectorAll('body *')].forEach(e => {
    const c = getComputedStyle(e);
    if (parseFloat(c.opacity) < 0.15 && e.textContent.trim().length > 15 && c.position !== 'fixed') {
      const r = e.getBoundingClientRect();
      if (r.width > 50 && r.top < 3000) add('INVISIVEL', e.tagName + '.' + (e.className || '-') + ' op=' + c.opacity + ' "' + e.textContent.trim().slice(0, 30) + '"');
    }
  });

  // 3. contraste baixo em texto (WCAG AA aprox)
  const lum = s => { const m = s.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const bgOf = el => { let e = el; while (e) { const b = getComputedStyle(e).backgroundColor; if (b && !b.includes('rgba(0, 0, 0, 0)')) return b; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const seen = new Set();
  [...document.querySelectorAll('p,h1,h2,h3,h4,a,li,span,td,button,label')].forEach(e => {
    const txt = e.textContent.trim(); if (txt.length < 8 || e.children.length) return;
    const c = getComputedStyle(e); if (parseFloat(c.opacity) < .5) return;
    const l1 = lum(c.color), l2 = lum(bgOf(e)); if (l1 === null || l2 === null) return;
    const ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
    const size = parseFloat(c.fontSize), bold = parseInt(c.fontWeight) >= 700;
    const min = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    if (ratio < min) { const k = c.color + c.fontSize; if (!seen.has(k)) { seen.add(k); add('CONTRASTE', ratio.toFixed(2) + ':1 (min ' + min + ') ' + Math.round(size) + 'px ' + c.color + ' "' + txt.slice(0, 28) + '"'); } }
  });

  // 4. texto estourando o container
  [...document.querySelectorAll('button,a.btn,.btn,nav a,.chip,.tag,.badge')].forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0) add('TEXTO-ESTOURA', e.tagName + '.' + (e.className || '-').toString().slice(0, 24) + ' "' + e.textContent.trim().slice(0, 20) + '" ' + e.scrollWidth + '>' + e.clientWidth);
  });

  // 5. ancoras quebradas
  [...document.querySelectorAll('a[href^="#"]')].forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (id && !document.getElementById(id)) add('ANCORA-QUEBRADA', a.getAttribute('href') + ' "' + a.textContent.trim().slice(0, 20) + '"');
  });

  // 6. alvos de toque pequenos (mobile)
  [...document.querySelectorAll('a,button')].forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.height < 32 && e.textContent.trim().length > 2 && !e.closest('footer')) {
      add('ALVO-PEQUENO', e.tagName + ' "' + e.textContent.trim().slice(0, 18) + '" ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
  });

  // 7. imagens sem alt
  [...document.querySelectorAll('img:not([alt])')].forEach(i => add('IMG-SEM-ALT', (i.getAttribute('src') || '').slice(0, 50)));

  // 8. vazios gigantes (espaco morto entre secoes)
  [...document.querySelectorAll('section')].forEach(s => {
    const c = getComputedStyle(s), pt = parseFloat(c.paddingTop), pb = parseFloat(c.paddingBottom);
    if (pt > 180 || pb > 180) add('PADDING-EXCESSIVO', 'section.' + (s.className || '-').toString().slice(0, 24) + ' ' + Math.round(pt) + '/' + Math.round(pb) + 'px');
  });

  const dedup = [...new Set(out.issues)];
  return JSON.stringify({ pag: out.url, total: dedup.length, issues: dedup.slice(0, 22) }, null, 1);
})()