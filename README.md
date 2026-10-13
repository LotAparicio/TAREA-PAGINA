# De Khan Academy al código web: Canvas y p5.js

Sitio web estático hecho con **HTML, CSS y JavaScript** que reúne cinco dibujos interactivos
(creados con p5.js) y dos secciones teóricas.

## Contenido

| Página | Descripción |
| --- | --- |
| `index.html` | Página principal con enlaces a todos los dibujos y a la teoría |
| `canvas.html` | Teoría: la etiqueta `<canvas>` y su contexto de renderizado 2D (con demos) |
| `p5js.html` | Teoría: fundamentos de p5.js (con un sketch de ejemplo en vivo) |
| `dom-inspector.html` | Inspector del DOM: árbol visual e interactivo de cada página del sitio |
| `rana.html` | Dibujo 1: Rana |
| `dientes-conejo.html` | Dibujo 2: Dientes de conejo |
| `cena.html` | Dibujo 3: ¿Qué hay de cena? |
| `dia-nevado.html` | Dibujo 4: Día nevado soleado |
| `muneco-nieve.html` | Dibujo 5: Muñeco de nieve |

```
index.html, canvas.html, p5js.html, rana.html, ...
css/style.css          estilos de todo el sitio
js/main.js             menú de navegación, visor de código y botón "Guardar imagen"
js/canvas-demo.js      demos con canvas nativo (sin librerías)
js/dom-inspector.js    lee el DOM de cada página y dibuja su árbol
js/sketches/*.js       un archivo p5.js por dibujo (+ demo-p5.js)
```

p5.js se carga desde una CDN (cdnjs, con jsDelivr como respaldo), por lo que se necesita conexión a internet.

## Verlo en tu computadora

Abre `index.html` con doble clic. Para que el visor de código de cada página también funcione
(usa `fetch`), conviene un servidor local:

```
python3 -m http.server 8000
```

y entrar a <http://localhost:8000>.

## Publicarlo con GitHub Pages

1. Crea una cuenta en <https://github.com> si no tienes una.
2. Crea un repositorio nuevo, **público** (por ejemplo `canvas-p5js`).
3. Sube todo el contenido de esta carpeta (no la carpeta en sí): `index.html` debe quedar en la raíz del repositorio.
   En la web: **Add file → Upload files**, arrastra los archivos y las carpetas `css` y `js`, y pulsa **Commit changes**.
4. Ve a **Settings → Pages**. En *Build and deployment*, elige **Deploy from a branch**,
   rama **main** y carpeta **/ (root)**, y guarda.
5. Espera uno o dos minutos. La dirección será:

   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

6. Abre esa URL, comprueba que el menú y los cinco dibujos funcionan y entrega **solo esa URL**.
