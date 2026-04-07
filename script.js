// ============================================================
// ▶ CAMBIA ESTA FECHA POR LA FECHA EN QUE SE CONOCIERON
//    Formato: año, mes (0-11), día, hora, minuto
// ============================================================
const FECHA_INICIO = new Date(2025, 8, 16, 12, 0, 0);

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.5)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

// ============================================================
// PARTÍCULAS FLOTANTES
// ============================================================
const contenedorParticulas = document.getElementById('particles');
for (let i = 0; i < 35; i++) {
  const p = document.createElement('div');
  p.classList.add('particle');
  p.style.setProperty('--dur', `${6 + Math.random() * 9}s`);
  p.style.setProperty('--delay', `${Math.random() * 9}s`);
  p.style.left   = `${Math.random() * 100}%`;
  const size = 3 + Math.random() * 5;
  p.style.width  = size + 'px';
  p.style.height = size + 'px';
  contenedorParticulas.appendChild(p);
}

// ============================================================
// CONTADOR DE TIEMPO JUNTOS
// ============================================================
function actualizarContador() {
  const ahora = new Date();

  // Calcular años, meses y días exactos
  let anios   = ahora.getFullYear() - FECHA_INICIO.getFullYear();
  let meses   = ahora.getMonth()    - FECHA_INICIO.getMonth();
  let dias    = ahora.getDate()     - FECHA_INICIO.getDate();

  // Ajustar si los días son negativos
  if (dias < 0) {
    meses--;
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
    dias += mesAnterior.getDate();
  }

  // Ajustar si los meses son negativos
  if (meses < 0) {
    anios--;
    meses += 12;
  }

  // Horas, minutos y segundos del día actual
  const diff           = ahora - FECHA_INICIO;
  const segundosTotales = Math.floor(diff / 1000);
  const horas           = Math.floor((segundosTotales % 86400) / 3600);
  const minutos         = Math.floor((segundosTotales % 3600) / 60);
  const segundos        = segundosTotales % 60;

  document.getElementById('cAnios').textContent   = anios;
  document.getElementById('cMeses').textContent   = meses;
  document.getElementById('cDias').textContent    = dias;
  document.getElementById('cHoras').textContent   = String(horas).padStart(2,'0');
  document.getElementById('cMinutos').textContent = String(minutos).padStart(2,'0');
  document.getElementById('cSegundos').textContent= String(segundos).padStart(2,'0');
}
actualizarContador();
setInterval(actualizarContador, 1000);

// ============================================================
// REVEAL AL SCROLL
// ============================================================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// ============================================================
// GALERÍA - EFECTO CORAZÓN
// ============================================================
const galeria = document.getElementById('galeria');
galeria.addEventListener('mouseenter', () => galeria.classList.add('activo'));
galeria.addEventListener('mouseleave', () => galeria.classList.remove('activo'));

document.querySelectorAll('.foto-card').forEach(card => {
  card.addEventListener('touchstart', (e) => {
    e.preventDefault();
    galeria.classList.add('activo');
    card.classList.add('tocado');
  }, { passive: false });
  card.addEventListener('touchend', () => {
    setTimeout(() => {
      galeria.classList.remove('activo');
      card.classList.remove('tocado');
    }, 1200);
  });
});

// ============================================================
// LLUVIA DE CORAZONES (Canvas)
// ============================================================
const btnLluvia  = document.getElementById('btnLluvia');
const canvas     = document.getElementById('lluviaCanvas');
const ctx        = canvas.getContext('2d');
let lluviaActiva = false;
let lluviaFrames = [];
let lluviaAnim;

function iniciarLluvia() {
  if (lluviaActiva) return;
  lluviaActiva = true;
  canvas.classList.remove('hidden');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const emojis = ['💖','💗','💕','❤','💝','🌹','✨','💘'];
  lluviaFrames = [];

  for (let i = 0; i < 60; i++) {
    lluviaFrames.push({
      x:     Math.random() * canvas.width,
      y:    -Math.random() * canvas.height,
      speed: 2 + Math.random() * 4,
      size:  20 + Math.random() * 30,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      rot:   (Math.random() - 0.5) * 0.1,
      angle: 0,
      swing: (Math.random() - 0.5) * 2,
    });
  }

  let dur = 0;
  function animarLluvia() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lluviaFrames.forEach(h => {
      h.y    += h.speed;
      h.x    += h.swing;
      h.angle += h.rot;
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.angle);
      ctx.font = `${h.size}px serif`;
      ctx.globalAlpha = 0.85;
      ctx.fillText(h.emoji, 0, 0);
      ctx.restore();
      if (h.y > canvas.height + 50) {
        h.y = -60;
        h.x = Math.random() * canvas.width;
      }
    });
    dur++;
    if (dur < 300) {
      lluviaAnim = requestAnimationFrame(animarLluvia);
    } else {
      cancelAnimationFrame(lluviaAnim);
      canvas.classList.add('hidden');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lluviaActiva = false;
    }
  }
  lluviaAnim = requestAnimationFrame(animarLluvia);
}

btnLluvia.addEventListener('click', iniciarLluvia);
btnLluvia.addEventListener('touchstart', (e) => { e.preventDefault(); iniciarLluvia(); }, { passive: false });

// ============================================================
// JUEGO - ATRAPA LOS CORAZONES
// ============================================================
const DURACION_JUEGO = 30;
const EMOJIS_JUEGO   = ['💖','💗','💝','❤','💕','🌹','💘'];

let puntaje     = 0;
let record      = 0;
let tiempoRestante = DURACION_JUEGO;
let juegoActivo = false;
let timerJuego;
let corazonesActivos = [];

const juegoArea    = document.getElementById('juegoArea');
const juegoInicio  = document.getElementById('juegoInicio');
const juegoFin     = document.getElementById('juegoFin');
const elPuntaje    = document.getElementById('puntaje');
const elTiempo     = document.getElementById('tiempo');
const elRecord     = document.getElementById('record');
const mensajeFin   = document.getElementById('mensajeFin');
const puntajeFinal = document.getElementById('puntajeFinal');

function iniciarJuego() {
  puntaje = 0;
  tiempoRestante = DURACION_JUEGO;
  juegoActivo = true;
  juegoInicio.classList.add('hidden');
  juegoFin.classList.add('hidden');
  elPuntaje.textContent = 0;
  elTiempo.textContent  = DURACION_JUEGO;

  // Limpiar corazones anteriores
  document.querySelectorAll('.corazon-juego').forEach(c => c.remove());
  corazonesActivos = [];

  // Timer principal
  timerJuego = setInterval(() => {
    tiempoRestante--;
    elTiempo.textContent = tiempoRestante;
    if (tiempoRestante <= 0) terminarJuego();
  }, 1000);

  // Spawnear corazones
  spawnCorazon();
}

function spawnCorazon() {
  if (!juegoActivo) return;

  const rect  = juegoArea.getBoundingClientRect();
  const emoji = EMOJIS_JUEGO[Math.floor(Math.random() * EMOJIS_JUEGO.length)];
  const el    = document.createElement('div');
  el.classList.add('corazon-juego');
  el.textContent = emoji;

  const margen = 50;
  el.style.left = `${margen + Math.random() * (juegoArea.clientWidth  - margen * 2)}px`;
  el.style.top  = `${margen + Math.random() * (juegoArea.clientHeight - margen * 2)}px`;

  // Quitar si no se atrapa en 2.5s
  const timeout = setTimeout(() => {
    if (el.parentNode) el.remove();
  }, 2500);

  el.addEventListener('click', () => {
    if (!juegoActivo) return;
    clearTimeout(timeout);

    // Puntaje volador
    const volador = document.createElement('div');
    volador.classList.add('puntos-volador');
    volador.textContent = '+1 💖';
    volador.style.left  = el.style.left;
    volador.style.top   = el.style.top;
    juegoArea.appendChild(volador);
    setTimeout(() => volador.remove(), 900);

    el.remove();
    puntaje++;
    elPuntaje.textContent = puntaje;
  });

  // Touch
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    el.click();
  }, { passive: false });

  juegoArea.appendChild(el);

  // Velocidad aumenta conforme pasa el tiempo
  const delay = Math.max(400, 900 - (DURACION_JUEGO - tiempoRestante) * 20);
  setTimeout(spawnCorazon, delay);
}

function terminarJuego() {
  juegoActivo = false;
  clearInterval(timerJuego);
  document.querySelectorAll('.corazon-juego').forEach(c => c.remove());

  if (puntaje > record) {
    record = puntaje;
    elRecord.textContent = record;
  }

  const mensajes = [
    [0,  5,  '¡Sigue intentando! 😅'],
    [6,  15, '¡Bien hecho! 💕'],
    [16, 25, '¡Increíble! Eres lo máximo 💖'],
    [26, 40, '¡Eres una campeona del amor! 👑💗'],
    [41, 999,'¡Eres sobrehumana! 🔥❤‍🔥'],
  ];
  const msg = mensajes.find(([min, max]) => puntaje >= min && puntaje <= max);
  mensajeFin.textContent   = msg ? msg[2] : '¡Genial!';
  puntajeFinal.textContent = `Atrapaste ${puntaje} corazones 💝`;
  juegoFin.classList.remove('hidden');
}

document.getElementById('btnJugar').addEventListener('click', iniciarJuego);
document.getElementById('btnReiniciar').addEventListener('click', iniciarJuego);

function abrirWhatsApp() {
  const numero  = '5217351619885'; // ← tu número aquí
  const mensaje = encodeURIComponent(
    'Hola amor, actualicé nuestra página especial para ti. Entra a verla'
  );

  const esMovil = /Android|iPhone|iPad/i.test(navigator.userAgent);

  if (esMovil) {
    // En celular abre la app de WhatsApp
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  } else {
    // En computadora abre WhatsApp Desktop
    window.location.href = `whatsapp://send?phone=${numero}&text=${mensaje}`;

    // Si WhatsApp Desktop no está instalado, abre WhatsApp Web como respaldo
    setTimeout(() => {
      window.open(`https://web.whatsapp.com/send?phone=${numero}&text=${mensaje}`, '_blank');
    }, 2500);
  }
}
/////////////////////////////////////
const navMenu  = document.getElementById('navMenu');
const navLinks = document.getElementById('navLinks');
if (navMenu && navLinks) {
  navMenu.addEventListener('click', () => {
    navLinks.classList.toggle('abierto');
    navMenu.textContent = navLinks.classList.contains('abierto') ? '✕' : '☰';
  });
  // Cerrar al dar clic en un link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('abierto');
      navMenu.textContent = '☰';
    });
  });
}