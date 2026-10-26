document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. PROCESAR VIDEOS DE YOUTUBE CON SEGURIDAD
  // ============================================
  function extraerYouTubeID(url) {
    if (!url) return null;
    const patrones = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/v\/)([A-Za-z0-9_-]{11})/,
      /[?&]v=([A-Za-z0-9_-]{11})/
    ];
    for (const patron of patrones) {
      const match = url.match(patron);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  const wrappers = document.querySelectorAll('.video-wrapper[data-video]');
  wrappers.forEach(wrapper => {
    const url = wrapper.getAttribute('data-video');
    const videoId = extraerYouTubeID(url);

    if (videoId) {
      // Crear iframe de forma segura
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = 'Video tutorial';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      // Sandbox opcional para restringir aún más
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    } else {
      wrapper.innerHTML = `
        <div class="video-placeholder">
          <i class="fas fa-video-slash"></i>
          <span>Video no disponible</span>
          <span style="font-size:0.7rem; opacity:0.7;">Revisa el enlace</span>
        </div>
      `;
      console.warn('⚠️ No se pudo extraer el ID del video:', url);
    }
  });

  // ============================================
  // 2. TOGGLE DE PASOS
  // ============================================
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
    if (span) span.textContent = ahoraVisible ? 'Ocultar pasos' : 'Ver pasos';
  });

  // ============================================
  // 3. CHAT FLOTANTE (SEGURO)
  // ============================================
  (function () {
    const toggle = document.getElementById('chatToggle');
    const ventana = document.getElementById('chatWindow');
    const cerrar = document.getElementById('chatClose');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const mensajes = document.getElementById('chatMessages');
    const quickBtns = document.querySelectorAll('#msgQuick button');
    const badge = document.getElementById('chatBadge');

    if (!toggle || !ventana) return;

    // ⚠️ REEMPLAZA POR TU FORM ID DE FORMSPREE
    const FORMSPREE_ID = 'https://formspree.io/f/moejqbrg';

// 1. URL de tu Cloudflare Worker (Cámbiala por la que te dio Cloudflare)
const PROXY_URL = 'https://steep-truth-0416proxi-gemini.fernandojosehuamancallupe.workers.dev';

// 2. Función para llamar al proxy (y este a Gemini)
async function preguntarAGemini(mensaje) {
  try {
    const respuesta = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: mensaje })
    });

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const data = await respuesta.json();
    return data.respuesta || 'No se recibió una respuesta válida.';

  } catch (error) {
    console.error('Error al conectar con el asistente:', error);
    return '❌ No pude conectarme al asistente en este momento. Por favor, intenta de nuevo en unos minutos.';
  }
}

// 3. Modificar procesarMensaje para usar la IA
async function procesarMensaje(texto) {
  const textoLimpio = texto.trim().substring(0, 300);
  if (!textoLimpio) return;

  agregarMensaje(textoLimpio, 'user');

  const quick = document.getElementById('msgQuick');
  if (quick) quick.style.display = 'none';

  const escribiendo = mostrarEscribiendo();

  // Pequeña pausa para que se sienta natural
  setTimeout(async () => {
    escribiendo.remove();
    const respuestaIA = await preguntarAGemini(textoLimpio);
    agregarMensaje(respuestaIA, 'bot');
  }, 800);
}
    // Abrir / cerrar
    function abrirChat() {
      ventana.classList.add('abierto');
      toggle.classList.add('abierto');
      ventana.setAttribute('aria-hidden', 'false');
      if (badge) badge.style.display = 'none';
      setTimeout(() => input.focus(), 300);
    }

    function cerrarChat() {
      ventana.classList.remove('abierto');
      toggle.classList.remove('abierto');
      ventana.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', () => {
      if (ventana.classList.contains('abierto')) {
        cerrarChat();
      } else {
        abrirChat();
      }
    });

    cerrar.addEventListener('click', cerrarChat);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = input.value.trim();
      if (!texto) return;
      input.value = '';
      procesarMensaje(texto);
    });

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const texto = btn.textContent.trim();
        input.value = texto;
        form.dispatchEvent(new Event('submit'));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ventana.classList.contains('abierto')) {
        cerrarChat();
      }
    });
  })();

  console.log('✅ Guía segura cargada correctamente.');
});
