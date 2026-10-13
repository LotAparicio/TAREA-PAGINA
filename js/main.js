// Comportamiento común a todas las páginas del sitio.
// 1) Menú de navegación (botón hamburguesa y submenús)
// 2) Marcar la página actual en el menú
// 3) Mostrar el código fuente de cada dibujo y guardar el lienzo como imagen

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  marcarPaginaActual();
  mostrarCodigoFuente();
  activarBotonGuardar();
});

function iniciarMenu() {
  const boton = document.querySelector('.menu-boton');
  const menu = document.getElementById('menu');
  if (!boton || !menu) return;

  // Botón hamburguesa (pantallas pequeñas)
  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });

  // Submenús "Teoría" y "Dibujos"
  const grupos = menu.querySelectorAll('.grupo');
  grupos.forEach((grupo) => {
    const gBoton = grupo.querySelector('.grupo-boton');
    gBoton.addEventListener('click', (e) => {
      e.stopPropagation();
      const yaAbierto = grupo.classList.contains('abierto');
      cerrarSubmenus(grupos);
      if (!yaAbierto) {
        grupo.classList.add('abierto');
        gBoton.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Cerrar al hacer clic fuera o al presionar Escape
  document.addEventListener('click', () => cerrarSubmenus(grupos));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarSubmenus(grupos);
      menu.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
    }
  });
}

function cerrarSubmenus(grupos) {
  grupos.forEach((g) => {
    g.classList.remove('abierto');
    g.querySelector('.grupo-boton').setAttribute('aria-expanded', 'false');
  });
}

function marcarPaginaActual() {
  // Compara el nombre del archivo de la URL con el href de cada enlace
  let actual = location.pathname.split('/').pop();
  if (actual === '') actual = 'index.html';

  document.querySelectorAll('#menu a').forEach((a) => {
    const destino = a.getAttribute('href').split('#')[0];
    if (destino === actual) {
      a.setAttribute('aria-current', 'page');
      const grupo = a.closest('.grupo');
      if (grupo) grupo.querySelector('.grupo-boton').classList.add('activo');
    }
  });
}

async function mostrarCodigoFuente() {
  const bloque = document.getElementById('codigo-fuente');
  if (!bloque) return;

  const ruta = bloque.dataset.src;
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    bloque.textContent = await respuesta.text();
  } catch (error) {
    bloque.textContent =
      '// No se pudo cargar el código desde esta vista.\n' +
      '// Si abriste el archivo directamente (file://), usa un servidor local\n' +
      '// (por ejemplo: python3 -m http.server) o abre el sitio publicado.\n' +
      '// Archivo: ' + ruta;
  }
}

function activarBotonGuardar() {
  const boton = document.getElementById('guardar');
  if (!boton) return;
  boton.addEventListener('click', () => {
    // saveCanvas es una función de p5.js: descarga el lienzo como PNG
    if (typeof saveCanvas === 'function') {
      saveCanvas(boton.dataset.nombre || 'dibujo', 'png');
    }
  });
}
