document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // 1. CONFIGURACIÓN (Revisa que esté tu URL)
  // ============================================
  const PROXY_URL = 'https://script.google.com/macros/s/AKfycbwPjNRXyhqupSczcjToHnoAbLDsl7ZAPAxa5nCaltfqIzUmqHjcy10Vua73p_jyUsRO/exec'; 
  const FORMSPREE_ID = 'https://formspree.io/f/moejqbrg"'; // ⚠️ Pon tu ID de Formspree aquí si usas el formulario

  // ============================================
  // 2. PROCESAR VIDEOS DE YOUTUBE
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
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = 'Video tutorial';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    }
  });

  // ============================================
  // 3. TOGGLE DE PASOS (Ver/Ocultar)
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
  // 4. CHAT FLOTANTE CON INTELIGENCIA ARTIFICIAL
  // ============================================
  const toggle = document.getElementById('chatToggle');
  const ventana = document.getElementById('chatWindow');
  const cerrar = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const mensajes = document.getElementById('chatMessages');
  const quickBtns = document.querySelectorAll('#msgQuick button');
  const badge = document.getElementById('chatBadge');

  if (!toggle || !ventana) return;

  function agregarMensaje(texto, quien) {
    const div = document.createElement('div');
    div.className = `msg msg-${quien}`;
    const p = document.createElement('p');
    p.textContent = texto; 
    div.appendChild(p);
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
    return div;
  }

  function mostrarEscribiendo() {
    const div = document.createElement('div');
    div.className = 'msg msg-bot msg-escribiendo';
    for (let i = 0; i < 3; i++) div.appendChild(document.createElement('span'));
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
    return div;
  }

  async function preguntarAGemini(mensaje) {
    try {
      const respuesta = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: mensaje })
      });
      if (!respuesta.ok) throw new Error('Error de red');
      const data = await respuesta.json();
      return data.respuesta || 'No obtuve respuesta.';
    } catch (error) {
      console.error('Error con Gemini:', error);
      return '❌ No pude conectarme al asistente. Revisa tu conexión.';
    }
  }

  async function procesarMensaje(texto) {
    const textoLimpio = texto.trim();
    if (!textoLimpio) return;

    agregarMensaje(textoLimpio, 'user');
    if (document.getElementById('msgQuick')) {
      document.getElementById('msgQuick').style.display = 'none';
    }

    const escribiendo = mostrarEscribiendo();

    setTimeout(async () => {
      escribiendo.remove();
      const respuestaIA = await preguntarAGemini(textoLimpio);
      agregarMensaje(respuestaIA, 'bot');
    }, 800);
  }

  function abrirChat() {
    ventana.classList.add('abierto');
    toggle.classList.add('abierto');
    if (badge) badge.style.display = 'none';
    setTimeout(() => input.focus(), 300);
  }

  function cerrarChat() {
    ventana.classList.remove('abierto');
    toggle.classList.remove('abierto');
  }

  toggle.addEventListener('click', () => {
    ventana.classList.contains('abierto') ? cerrarChat() : abrirChat();
  });

  cerrar.addEventListener('click', cerrarChat);

  // EVENTO PARA ENVIAR EL MENSAJE
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue
    const texto = input.value;
    input.value = '';
    procesarMensaje(texto);
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent.trim();
      // Simulamos que el usuario presionó enter
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  });

  console.log('✅ Script cargado correctamente. Chat listo.');
});
