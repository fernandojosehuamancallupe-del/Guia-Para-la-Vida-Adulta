document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ver-mas');
    if (!btn) return;

    e.preventDefault();

    const targetId = btn.getAttribute('data-target');
    const detalle = document.getElementById(targetId);
    if (!detalle) return;

    const ahoraVisible = detalle.classList.toggle('visible');
    btn.classList.toggle('active', ahoraVisible);

    const span = btn.querySelector('span');
    if (span) {
      span.textContent = ahoraVisible ? 'Ocultar pasos' : 'Ver pasos';
    }
  });

  console.log('✅ Script de la guía cargado correctamente');
});