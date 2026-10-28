// Animaciones: marquesina, formas decorativas por sección y aparición al hacer scroll.
// 0) "Ver pasos": manejador propio (no depende de script.js ni del orden de carga).
//    Va en fase de captura y detiene el evento para que el de script.js no lo vuelva a alternar.
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('.btn-ver-mas');
  if (!btn) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const det = document.getElementById(btn.getAttribute('data-target'));
  if (!det) return;
  const abierto = det.classList.toggle('visible');
  btn.classList.toggle('active', abierto);
  btn.setAttribute('aria-expanded', String(abierto));
  const span = btn.querySelector('span');
  if (span) span.textContent = abierto ? 'Ocultar pasos' : 'Ver pasos';
}, true);

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Marquesina con los trámites (se inserta justo debajo de la portada)
  const hero = document.querySelector('header.hero');
  if (hero) {
    const palabras = ['DNI', 'Pasaporte', 'RUC', 'SIS', 'Brevete', 'CTS', 'Alquiler', 'Beca 18', 'SOAT', 'Certijoven', 'Antecedentes', 'AFP / ONP'];
    const fila = palabras.map(p => `<span>${p}</span>`).join('');
    const m = document.createElement('div');
    m.className = 'marquee';
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML = `<div class="marquee-track">${fila}${fila}</div>`;
    hero.insertAdjacentElement('afterend', m);
  }

  // 2) Una forma flotante en la esquina de cada sección
  const formas = ['s-chakana', 's-sun', 's-mount', 's-ring', 's-dia', 's-semi'];
  document.querySelectorAll('.box:not(.hero):not(.foot)').forEach((sec, i) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'deco d' + (i % 5));
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<use href="#${formas[i % formas.length]}"/>`;
    sec.prepend(svg);
  });

  // 3) Aparición suave al hacer scroll
  const items = document.querySelectorAll('.tramite-card, .bloque-head, .consejo-item, .intro, .enlaces ul, .formulario');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    items.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', (i % 4) * 70 + 'ms'); io.observe(el); });
  }

  // 4) Botón de la portada que abre el chat
  const hc = document.getElementById('heroChat'), ct = document.getElementById('chatToggle');
  if (hc && ct) hc.addEventListener('click', () => { if (!document.getElementById('chatWindow').classList.contains('abierto')) ct.click(); });
})();
