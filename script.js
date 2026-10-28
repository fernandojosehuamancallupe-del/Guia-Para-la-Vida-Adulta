document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // 1. CONFIGURACIÓN DEL CHAT
  // ============================================
  const PROXY_URL = 'https://script.google.com/macros/s/AKfycbwPjNRXyhqupSczcjToHnoAbLDsl7ZAPAxa5nCaltfqIzUmqHjcy10Vua73p_jyUsRO/exec'; 

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
  // 3. FUNCIÓN MAESTRA PARA LEER EN VOZ ALTA
  // ============================================
  function reproducirTexto(textoParaLeer) {
    if (!('speechSynthesis' in window)) {
      alert("Tu navegador no soporta la lectura en voz alta.");
      return;
    }

    window.speechSynthesis.cancel();
    const textoLimpio = textoParaLeer.replace(/[⚠️❌⏳🪪🛂🧾❤️🏦🗳️👉]/g, ''); 
    const mensaje = new SpeechSynthesisUtterance(textoLimpio);

    const voces = window.speechSynthesis.getVoices();
    const vozElegida = 
      voces.find(v => v.lang === 'es-PE') || 
      voces.find(v => v.lang === 'es-MX') || 
      voces.find(v => v.lang === 'es-ES') || 
      voces.find(v => v.lang.startsWith('es'));

    if (vozElegida) {
      mensaje.voice = vozElegida;
      mensaje.lang = vozElegida.lang;
    } else {
      mensaje.lang = 'es-ES';
    }

    mensaje.rate = 1.0;
    window.speechSynthesis.speak(mensaje);
  }

  // Evento para botones de Escuchar
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-escuchar-tramite');
    if (!btn) return;

    const card = btn.closest('.tramite-card');
    if (!card) return;

    if (btn.classList.contains('leyendo')) {
      window.speechSynthesis.cancel();
      document.querySelectorAll('.btn-escuchar-tramite').forEach(b => {
        b.classList.remove('leyendo');
        b.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
      });
      return;
    }

    window.speechSynthesis.cancel();
    document.querySelectorAll('.btn-escuchar-tramite').forEach(b => {
      b.classList.remove('leyendo');
      b.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    });

    const titulo = card.querySelector('h3').innerText;
    const descripcion = card.querySelector('p').innerText; 
    let pasosTexto = "";
    const detalle = card.querySelector('.detalle');
    if (detalle) pasosTexto = detalle.innerText;

    let textoParaLeer = `${titulo}. ${descripcion}. ${pasosTexto}`;
    
    btn.classList.add('leyendo');
    btn.innerHTML = '<i class="fas fa-stop"></i> Detener';

    reproducirTexto(textoParaLeer);

    setTimeout(() => {
      const checkSpeech = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          btn.classList.remove('leyendo');
          btn.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
          clearInterval(checkSpeech);
        }
      }, 1000);
    }, 1000);
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

  if (toggle && ventana) {
    
    function agregarMensaje(texto, quien) {
      const div = document.createElement('div');
      div.className = `msg msg-${quien}`;
      const p = document.createElement('p');
      p.textContent = texto; 
      div.appendChild(p);

      if (quien === 'bot') {
        const btnAudio = document.createElement('button');
        btnAudio.className = 'btn-audio';
        btnAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
        btnAudio.title = 'Escuchar mensaje';
        btnAudio.setAttribute('aria-label', 'Escuchar mensaje en voz alta');
        btnAudio.onclick = () => reproducirTexto(texto);
        div.appendChild(btnAudio);
      }

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
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ mensaje: mensaje })
        });
        if (!respuesta.ok) throw new Error('Error de red');
        const data = await respuesta.json();

        if (data.error) {
          if (data.error.includes("high demand") || data.error.includes("overloaded")) {
            return "⏳ El asistente está muy solicitado. Intenta de nuevo en un ratito.";
          }
          return "⚠️ Error: " + data.error;
        }
        return data.respuesta || 'No obtuve respuesta.';
      } catch (error) {
        console.error('Error con la IA:', error);
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = input.value;
      input.value = '';
      procesarMensaje(texto);
    });

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.textContent.trim();
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
    });
  }

  // ============================================
  // 5. TRADUCCIÓN AUTOMÁTICA (QUECHUA / ESPAÑOL)
  // ============================================
  const btnQuechua = document.getElementById('btnQuechua');
  const btnEspanol = document.getElementById('btnEspanol');

  function traducirPagina(codigoIdioma) {
    // Buscamos el menú desplegable oculto de Google Translate
    const combo = document.querySelector('.goog-te-combo');

    if (combo) {
      // Si existe, le cambiamos el idioma y disparamos el evento
      combo.value = codigoIdioma;
      combo.dispatchEvent(new Event('change'));
      
      // Si el usuario elige español, a veces Google no vuelve al original de una, 
      // así que hacemos una pequeña recarga de respaldo.
      if (codigoIdioma === 'es') {
        setTimeout(() => {
          if (document.body.style.top !== '0px') {
             document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
             window.location.reload();
          }
        }, 500);
      }
    } else {
      // Si el combo no existe (por ejemplo, porque un AdBlock lo bloqueó),
      // usamos el método de la cookie y recargamos.
      if (codigoIdioma === 'es') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else {
        document.cookie = `googtrans=/es/${codigoIdioma}; path=/;`;
      }
      window.location.reload();
    }
  }

  if (btnQuechua) btnQuechua.addEventListener('click', () => traducirPagina('qu'));
  if (btnEspanol) btnEspanol.addEventListener('click', () => traducirPagina('es'));
