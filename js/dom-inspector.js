// Inspector del DOM
// Carga cada página del sitio dentro de un <iframe> oculto, espera a que termine de
// ejecutarse (así p5.js ya creó sus <canvas>), recorre su árbol DOM y lo dibuja
// como un árbol visual interactivo. Si el iframe no se puede leer, usa fetch + DOMParser.

const PAGINAS = [
  { archivo: 'index.html', nombre: 'Inicio' },
  { archivo: 'canvas.html', nombre: 'Canvas (teoría)' },
  { archivo: 'p5js.html', nombre: 'p5.js (teoría)' },
  { archivo: 'rana.html', nombre: 'Rana' },
  { archivo: 'dientes-conejo.html', nombre: 'Dientes de conejo' },
  { archivo: 'cena.html', nombre: '¿Qué hay de cena?' },
  { archivo: 'dia-nevado.html', nombre: 'Día nevado soleado' },
  { archivo: 'muneco-nieve.html', nombre: 'Muñeco de nieve' },
  { archivo: 'dom-inspector.html', nombre: 'DOM (esta página)' }
];

// Categoría de color según la etiqueta
const CATEGORIAS = {
  documento: { nombre: 'Documento y cabecera', etiquetas: ['html', 'head', 'meta', 'title', 'link', 'style'] },
  estructura: { nombre: 'Contenedores semánticos', etiquetas: ['body', 'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'div', 'ul', 'ol', 'li', 'details', 'summary', 'table', 'thead', 'tbody', 'tr'] },
  texto: { nombre: 'Texto y enlaces', etiquetas: ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'span', 'code', 'pre', 'strong', 'em', 'kbd', 'td', 'th', 'blockquote'] },
  interactivo: { nombre: 'Controles', etiquetas: ['button', 'input', 'select', 'label', 'form'] },
  grafico: { nombre: 'Gráficos (canvas)', etiquetas: ['canvas', 'svg', 'img'] },
  script: { nombre: 'Scripts', etiquetas: ['script', 'noscript'] }
};

const estado = {
  pagina: 'index.html',
  raiz: null,         // árbol ya convertido a objetos simples
  verTexto: false,
  verAtributos: true,
  vertical: false,
  oscuro: false,
  fuente: ''          // 'DOM vivo' o 'HTML descargado'
};

const $ = (s) => document.querySelector(s);

document.addEventListener('DOMContentLoaded', () => {
  crearSelector();
  crearLeyenda();
  $('#opt-texto').addEventListener('change', (e) => { estado.verTexto = e.target.checked; dibujar(); });
  $('#opt-attr').addEventListener('change', (e) => { estado.verAtributos = e.target.checked; dibujar(); });
  $('#expandir').addEventListener('click', () => cambiarTodo(false));
  $('#colapsar').addEventListener('click', () => cambiarTodo(true));
  $('#nivel').addEventListener('change', (e) => limitarNivel(Number(e.target.value)));
  $('#orientacion').addEventListener('change', (e) => { estado.vertical = e.target.value === 'vertical'; dibujar(); });
  $('#tema').addEventListener('change', (e) => { estado.oscuro = e.target.value === 'oscuro'; aplicarTema(); });

  // Permite abrir una página concreta con dom-inspector.html#rana.html
  const hash = location.hash.replace('#', '');
  if (PAGINAS.some((p) => p.archivo === hash)) estado.pagina = hash;
  cargar(estado.pagina);
});

// ------------------------------------------------------------------
// Interfaz
// ------------------------------------------------------------------

function crearSelector() {
  const cont = $('#selector');
  PAGINAS.forEach((p) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pestana';
    b.textContent = p.nombre;
    b.dataset.archivo = p.archivo;
    b.addEventListener('click', () => cargar(p.archivo));
    cont.appendChild(b);
  });
}

function crearLeyenda() {
  const cont = $('#leyenda');
  Object.entries(CATEGORIAS).forEach(([clave, c]) => {
    const s = document.createElement('span');
    s.className = 'leyenda-item';
    s.innerHTML = '<i class="cat-' + clave + '"></i>' + c.nombre;
    cont.appendChild(s);
  });
}

function marcarPestana() {
  document.querySelectorAll('.pestana').forEach((b) => {
    const activa = b.dataset.archivo === estado.pagina;
    b.classList.toggle('activa', activa);
    b.setAttribute('aria-pressed', String(activa));
  });
}

// ------------------------------------------------------------------
// Carga del DOM de una página
// ------------------------------------------------------------------

async function cargar(archivo) {
  estado.pagina = archivo;
  history.replaceState(null, '', '#' + archivo);
  marcarPestana();
  $('#arbol').innerHTML = '<p class="cargando">Leyendo el DOM de ' + archivo + '…</p>';
  $('#resumen').textContent = '';

  try {
    let doc;
    if (archivo === 'dom-inspector.html') {
      // Esta misma página: se lee su HTML original (el DOM vivo incluiría el propio árbol dibujado)
      doc = await leerConFetch(archivo);
      estado.fuente = 'HTML descargado (sin el árbol que dibuja este inspector)';
    } else {
      try {
        doc = await leerConIframe(archivo);
        estado.fuente = 'DOM vivo (incluye lo que crea JavaScript)';
      } catch (e) {
        doc = await leerConFetch(archivo);
        estado.fuente = 'HTML descargado (sin lo que crea JavaScript)';
      }
    }
    estado.raiz = convertir(doc.documentElement);
    dibujar();
  } catch (error) {
    $('#arbol').innerHTML =
      '<div class="aviso"><strong>No se pudo leer la página.</strong><br>' +
      'Este inspector necesita abrirse desde un servidor (por ejemplo GitHub Pages o ' +
      '<code>python3 -m http.server</code>); no funciona abriendo el archivo con doble clic (file://).</div>';
  }
}

function leerConIframe(archivo) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.className = 'oculto';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.src = archivo;

    const limite = setTimeout(() => { iframe.remove(); reject(new Error('tiempo agotado')); }, 8000);

    iframe.addEventListener('load', () => {
      // Se da un momento para que p5.js termine de crear sus lienzos
      setTimeout(() => {
        try {
          const doc = iframe.contentDocument;
          if (!doc || !doc.documentElement) throw new Error('sin acceso');
          // Se convierte el árbol ANTES de quitar el iframe
          const arbol = convertir(doc.documentElement);
          clearTimeout(limite);
          iframe.remove();
          resolve({ documentElement: { __arbol: arbol } });
        } catch (e) {
          clearTimeout(limite);
          iframe.remove();
          reject(e);
        }
      }, 900);
    });
    document.body.appendChild(iframe);
  });
}

async function leerConFetch(archivo) {
  const r = await fetch(archivo);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const texto = await r.text();
  return new DOMParser().parseFromString(texto, 'text/html');
}

// ------------------------------------------------------------------
// Conversión del DOM a objetos simples
// ------------------------------------------------------------------

function convertir(el) {
  if (el && el.__arbol) return el.__arbol;   // ya convertido (viene del iframe)

  const nodo = {
    tag: el.tagName.toLowerCase(),
    id: el.id || '',
    clases: el.classList ? Array.from(el.classList) : [],
    attrs: {},
    texto: '',
    hijos: [],
    colapsado: false
  };

  ['href', 'src', 'type', 'lang', 'charset', 'name', 'rel', 'width', 'height', 'role', 'aria-label', 'data-src'].forEach((a) => {
    if (el.hasAttribute && el.hasAttribute(a)) nodo.attrs[a] = el.getAttribute(a);
  });

  // Texto propio del elemento (nodos de texto directos)
  const propio = Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
  nodo.texto = propio;

  // El inspector no muestra su propio contenido dinámico ni el contenido de scripts/estilos
  if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
    Array.from(el.children).forEach((h) => {
      if (h.classList && h.classList.contains('oculto') && h.tagName === 'IFRAME') return;
      nodo.hijos.push(convertir(h));
    });
  }
  return nodo;
}

// ------------------------------------------------------------------
// Dibujo del árbol
// ------------------------------------------------------------------

function categoria(tag) {
  for (const [clave, c] of Object.entries(CATEGORIAS)) {
    if (c.etiquetas.includes(tag)) return clave;
  }
  return 'texto';
}

function contar(n) {
  return n.hijos.reduce((suma, h) => suma + contar(h), 1);
}

function profundidad(n) {
  return 1 + (n.hijos.length ? Math.max(...n.hijos.map(profundidad)) : 0);
}

function dibujar() {
  const cont = $('#arbol');
  cont.innerHTML = '';
  if (!estado.raiz) return;

  const total = contar(estado.raiz);
  const prof = profundidad(estado.raiz);
  const canvas = contarEtiqueta(estado.raiz, 'canvas');
  $('#resumen').innerHTML =
    '<strong>' + estado.pagina + '</strong> · ' + total + ' elementos · ' + prof + ' niveles de profundidad · ' +
    canvas + ' &lt;canvas&gt; · Fuente: ' + estado.fuente;

  cont.classList.toggle('vertical', estado.vertical);
  aplicarTema();

  const ul = document.createElement('ul');
  ul.className = 'arbol-raiz';
  ul.appendChild(crearNodo(estado.raiz, 0));
  cont.appendChild(ul);

  // Deja a la vista la raíz <html>: centrada verticalmente (vista horizontal)
  // o centrada horizontalmente (vista vertical)
  const marco = cont.parentElement;
  const raiz = ul.querySelector('.caja');
  if (marco && raiz) {
    const m = marco.getBoundingClientRect();
    const r = raiz.getBoundingClientRect();
    if (estado.vertical) {
      marco.scrollTop = 0;
      marco.scrollLeft = Math.max(0, marco.scrollLeft + (r.left - m.left) - m.width / 2 + r.width / 2);
    } else {
      marco.scrollLeft = 0;
      marco.scrollTop = Math.max(0, marco.scrollTop + (r.top - m.top) - m.height / 2 + r.height / 2);
    }
  }

  // Opciones de nivel
  const sel = $('#nivel');
  sel.innerHTML = '<option value="0">Mostrar todos los niveles</option>';
  for (let i = 1; i <= prof; i++) {
    sel.insertAdjacentHTML('beforeend', '<option value="' + i + '">Hasta el nivel ' + i + '</option>');
  }
}

function aplicarTema() {
  const marco = document.querySelector('.arbol-contenedor');
  if (marco) marco.classList.toggle('oscuro', estado.oscuro);
}

function contarEtiqueta(n, tag) {
  return (n.tag === tag ? 1 : 0) + n.hijos.reduce((s, h) => s + contarEtiqueta(h, tag), 0);
}

function crearNodo(n, nivel) {
  const li = document.createElement('li');
  li.className = 'nodo';
  li.dataset.nivel = String(nivel + 1);

  const fila = document.createElement('div');
  fila.className = 'fila';

  // Caja de la etiqueta
  const caja = document.createElement(n.hijos.length ? 'button' : 'div');
  caja.className = 'caja cat-' + categoria(n.tag);
  if (n.hijos.length) {
    caja.type = 'button';
    caja.setAttribute('aria-expanded', String(!n.colapsado));
    caja.title = 'Clic para contraer o expandir (' + n.hijos.length + ' hijos)';
  }

  let etiqueta = '&lt;' + n.tag + '&gt;';
  const detalle = [];
  if (n.id) detalle.push('#' + escapar(n.id));
  if (n.clases.length) detalle.push('.' + n.clases.map(escapar).join('.'));
  caja.innerHTML = '<span class="tag">' + etiqueta + '</span>' +
    (detalle.length ? '<span class="idclase">' + detalle.join('') + '</span>' : '') +
    (n.hijos.length ? '<span class="hijos-n">' + n.hijos.length + '</span>' : '');
  fila.appendChild(caja);

  // Atributos
  if (estado.verAtributos) {
    const claves = Object.keys(n.attrs);
    if (claves.length) {
      const a = document.createElement('span');
      a.className = 'attrs';
      a.textContent = claves.map((k) => k + '="' + recortar(n.attrs[k], 34) + '"').join('  ');
      fila.appendChild(a);
    }
  }
  // Texto
  if (estado.verTexto && n.texto) {
    const t = document.createElement('span');
    t.className = 'texto-nodo';
    t.textContent = '“' + recortar(n.texto, 50) + '”';
    fila.appendChild(t);
  }
  li.appendChild(fila);

  if (n.hijos.length) {
    const ul = document.createElement('ul');
    ul.className = 'hijos';
    n.hijos.forEach((h) => ul.appendChild(crearNodo(h, nivel + 1)));
    li.appendChild(ul);
    if (n.colapsado) li.classList.add('colapsado');

    caja.addEventListener('click', () => {
      const c = li.classList.toggle('colapsado');
      n.colapsado = c;
      caja.setAttribute('aria-expanded', String(!c));
    });
  }
  return li;
}

function cambiarTodo(colapsar) {
  recorrer(estado.raiz, (n, d) => { n.colapsado = colapsar && n.hijos.length > 0 && d > 0; });
  dibujar();
}

function limitarNivel(maximo) {
  recorrer(estado.raiz, (n, d) => { n.colapsado = maximo > 0 && d + 1 >= maximo && n.hijos.length > 0; });
  const guardado = maximo;
  dibujar();
  $('#nivel').value = String(guardado);
}

function recorrer(n, fn, d = 0) {
  fn(n, d);
  n.hijos.forEach((h) => recorrer(h, fn, d + 1));
}

function recortar(s, max) {
  s = String(s);
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

function escapar(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
