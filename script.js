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
    const FORMSPREE_ID = 'TU_FORM_ID';

    // Base de conocimiento (sin HTML malicioso)
    const FAQ = [
      { keys: ['dni', 'documento', 'identidad', 'reniec'], answer: '🪪 DNI: Puedes tramitarlo desde los 17 años en RENIEC (presencial). Costo: S/ 30 o S/ 41. Vigencia: 10 años.' },
      { keys: ['pasaporte', 'viajar', 'extranjero'], answer: '🛂 Pasaporte: DNI vigente y pago de S/ 120.90 en Págalo.pe. Cita en citaspasaporte.migraciones.gob.pe. Vigencia: 10 años.' },
      { keys: ['ruc', 'sunat', 'facturar', 'honorarios'], answer: '🧾 RUC: Gratuito. Online en SUNAT Virtual o presencial con cita. Necesitas DNI, correo y celular.' },
      { keys: ['sis', 'essalud', 'seguro', 'salud'], answer: '❤️ SIS / EsSalud: SIS gratuito en sis.gob.pe. EsSalud automático en planilla o +SALUD para independientes.' },
      { keys: ['banco', 'cuenta', 'ahorro', 'tarjeta'], answer: '🏦 Cuenta bancaria: Solo DNI y ser mayor de 18. Varios bancos permiten apertura 100% online. Cuentas juveniles sin mantenimiento.' },
      { keys: ['voto', 'votar', 'multa'], answer: '🗳️ Voto: Obligatorio de 18 a 70 años. Multa por no votar: S/ 27.50 en zonas de pobreza extrema. Paga en Banco de la Nación.' },
      { keys: ['hola', 'buenas', 'hey'], answer: '¡Hola! 👋 ¿En qué trámite te ayudo? Elige un botón o escribe tu duda.' },
      { keys: ['gracias', 'thanks'], answer: '¡De nada! 😊 Si tienes otra duda, aquí estoy.' },
      { keys: ['adios', 'chau', 'hasta luego'], answer: '¡Hasta luego! 👋 Éxitos con tus trámites.' }
    ];

    // Normalizar texto
    function normalizar(texto) {
      return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Buscar respuesta (SEGURO: devuelve solo texto plano)
    function buscarRespuesta(texto) {
      const t = normalizar(texto);
      for (const item of FAQ) {
        if (item.keys.some(k => t.includes(normalizar(k)))) {
          return item.answer;
        }
      }
      return null;
    }

    // Agregar mensaje SIN innerHTML (evita XSS)
    function agregarMensaje(texto, quien) {
      const div = document.createElement('div');
      div.className = `msg msg-${quien}`;
      const p = document.createElement('p');
      p.textContent = texto; // ⚠️ textContent, no innerHTML
      div.appendChild(p);
      mensajes.appendChild(div);
      mensajes.scrollTop = mensajes.scrollHeight;
      return div;
    }

    // Animación "escribiendo"
    function mostrarEscribiendo() {
      const div = document.createElement('div');
      div.className = 'msg msg-bot msg-escribiendo';
      for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        div.appendChild(span);
      }
      mensajes.appendChild(div);
      mensajes.scrollTop = mensajes.scrollHeight;
      return div;
    }

    // Enviar a Formspree (SEGURO: solo texto)
    async function enviarAFormspree(pregunta) {
      try {
        const resp = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            tipo: 'Consulta desde chat',
            mensaje: pregunta.substring(0, 500), // límite de seguridad
            origen: 'Chat flotante'
          })
        });
        return resp.ok;
      } catch (err) {
        console.error('Error al enviar a Formspree:', err);
        return false;
      }
    }

    // Procesar mensaje del usuario
    async function procesarMensaje(texto) {
      // Sanitizar entrada del usuario
      const textoLimpio = texto.trim().substring(0, 300);
      if (!textoLimpio) return;

      agregarMensaje(textoLimpio, 'user');

      const respuesta = buscarRespuesta(textoLimpio);

      const quick = document.getElementById('msgQuick');
      if (quick) quick.style.display = 'none';

      const escribiendo = mostrarEscribiendo();

      setTimeout(async () => {
        escribiendo.remove();

        if (respuesta) {
          agregarMensaje(respuesta, 'bot');
        } else {
          agregarMensaje('🤔 No tengo una respuesta exacta, pero ya envié tu pregunta al equipo. Te responderemos por correo.', 'bot');
          await enviarAFormspree(textoLimpio);
        }
      }, 900);
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
