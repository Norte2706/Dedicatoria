// =============================================
// PARTÍCULAS FLOTANTES DE FONDO
// =============================================
const contenedorParticulas = document.getElementById('particles');

for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.classList.add('particle');
  p.style.setProperty('--dur', `${6 + Math.random() * 8}s`);
  p.style.setProperty('--delay', `${Math.random() * 8}s`);
  p.style.left = `${Math.random() * 100}%`;
  p.style.width = p.style.height = `${3 + Math.random() * 6}px`;
  contenedorParticulas.appendChild(p);
}

// =============================================
// EFECTO CORAZÓN EN GALERÍA (mouse y touch)
// =============================================
const galeria = document.getElementById('galeria');

// Mouse hover en el contenedor completo
galeria.addEventListener('mouseenter', () => {
  galeria.classList.add('activo');
});
galeria.addEventListener('mouseleave', () => {
  galeria.classList.remove('activo');
});

// Touch en móvil: al tocar cualquier tarjeta
const cards = document.querySelectorAll('.foto-card');
cards.forEach(card => {
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
