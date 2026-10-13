// Demos de la página "La etiqueta <canvas>".
// Todo está hecho con el contexto 2D nativo del navegador, sin ninguna librería.

document.addEventListener('DOMContentLoaded', () => {
  demoFormas();
  demoAnimacion();
  demoTransformaciones();
});

// Si la persona prefiere menos movimiento, las animaciones empiezan en pausa.
const MENOS_MOVIMIENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------
// 1) Formas, estilos, degradados y texto (dibujo estático)
// ---------------------------------------------------------------
function demoFormas() {
  const canvas = document.getElementById('demo-formas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#e8f4fd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rectángulo relleno y con borde
  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(20, 20, 90, 60);
  ctx.strokeStyle = '#17324d';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 90, 60);

  // Círculo con arc(): ángulos en radianes
  ctx.beginPath();
  ctx.arc(180, 55, 35, 0, Math.PI * 2);
  ctx.fillStyle = '#f4a261';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.stroke();

  // Triángulo con un trazado (path)
  ctx.beginPath();
  ctx.moveTo(285, 20);
  ctx.lineTo(335, 85);
  ctx.lineTo(240, 85);
  ctx.closePath();
  ctx.fillStyle = '#e76f51';
  ctx.fill();
  ctx.stroke();

  // Curva cuadrática
  ctx.beginPath();
  ctx.moveTo(20, 150);
  ctx.quadraticCurveTo(100, 100, 180, 150);
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Degradado lineal
  const degradado = ctx.createLinearGradient(200, 110, 340, 170);
  degradado.addColorStop(0, '#2a9d8f');
  degradado.addColorStop(1, '#f4a261');
  ctx.fillStyle = degradado;
  ctx.fillRect(200, 110, 140, 60);

  // Texto
  ctx.fillStyle = '#17324d';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Hola, canvas', 20, 188);
}

// ---------------------------------------------------------------
// 2) Animación con requestAnimationFrame: pelota que rebota
// ---------------------------------------------------------------
function demoAnimacion() {
  const canvas = document.getElementById('demo-animacion');
  const boton = document.getElementById('demo-pausa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const ancho = canvas.width;
  const alto = canvas.height;

  const r = 16;
  let x = 60, y = 40, vx = 3, vy = 0;
  let corriendo = !MENOS_MOVIMIENTO;

  if (boton) {
    boton.textContent = corriendo ? 'Pausar' : 'Reanudar';
    boton.addEventListener('click', () => {
      corriendo = !corriendo;
      boton.textContent = corriendo ? 'Pausar' : 'Reanudar';
    });
  }

  function cuadro() {
    // 1. Actualizar la posición (física sencilla)
    if (corriendo) {
      vy += 0.35;            // gravedad
      x += vx;
      y += vy;
      if (y + r > alto - 20) { y = alto - 20 - r; vy *= -0.85; }  // rebote en el suelo
      if (x + r > ancho) { x = ancho - r; vx *= -1; }
      if (x - r < 0) { x = r; vx *= -1; }
    }

    // 2. Borrar el cuadro anterior
    ctx.clearRect(0, 0, ancho, alto);

    // 3. Dibujar el cuadro nuevo
    ctx.fillStyle = '#d9ead3';
    ctx.fillRect(0, alto - 20, ancho, 20);               // suelo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(x, alto - 20, r, 4, 0, 0, Math.PI * 2);  // sombra
    ctx.fill();
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);                     // pelota
    ctx.fill();

    // 4. Pedir el siguiente cuadro al navegador
    requestAnimationFrame(cuadro);
  }
  cuadro();
}

// ---------------------------------------------------------------
// 3) Transformaciones: save, translate, rotate y restore
// ---------------------------------------------------------------
function demoTransformaciones() {
  const canvas = document.getElementById('demo-transformaciones');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angulo = 0;

  function cuadro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();                                       // guarda el estado
    ctx.translate(canvas.width / 2, canvas.height / 2); // el origen pasa al centro
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate(angulo + (i * Math.PI) / 3);         // gira alrededor del centro
      ctx.fillStyle = 'hsl(' + i * 60 + ', 70%, 55%)';
      ctx.fillRect(20, -10, 70, 20);
      ctx.restore();                                  // vuelve al estado anterior
    }
    ctx.restore();

    if (!MENOS_MOVIMIENTO) {
      angulo += 0.02;
      requestAnimationFrame(cuadro);
    }
  }
  cuadro();
}
