// Día nevado soleado · p5.js
// Mueve el mouse: el sol recorre el cielo. Mantén el clic presionado: sopla el viento.

const NUM_COPOS = 120;
let copos = [];
let nubes = [];
let solX = 200;          // posición actual del sol (suavizada)
let objetivoSolX = 200;  // hacia dónde quiere ir el sol
let viento = 0;

function setup() {
  createCanvas(400, 400).parent('lienzo');

  for (let i = 0; i < NUM_COPOS; i++) {
    copos.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 4),
      vy: random(0.6, 1.8),
      fase: random(TWO_PI)
    });
  }
  nubes = [
    { x: 60, y: 70, escala: 1.0, v: 0.25 },
    { x: 250, y: 105, escala: 0.75, v: 0.18 },
    { x: 340, y: 50, escala: 0.6, v: 0.3 }
  ];
}

function draw() {
  // Posición del sol sobre un arco: sale por la izquierda y se pone por la derecha
  solX = lerp(solX, objetivoSolX, 0.08);
  const progreso = map(solX, 40, 360, 0, PI);
  const solY = 330 - sin(progreso) * 250;
  const altura = sin(progreso);                    // 0 en el horizonte, 1 al mediodía
  const luz = constrain(altura * 1.8, 0, 1);       // 0 = atardecer, 1 = pleno día

  dibujarCielo(luz);
  dibujarSol(solX, solY);
  moverYDibujarNubes(luz);
  dibujarColinas(luz);
  dibujarPinos();
  moverYDibujarCopos();
  dibujarTextos();
}

// ---------- Cielo y sol ----------

function dibujarCielo(luz) {
  const arribaDia = color(70, 150, 230);
  const abajoDia = color(190, 225, 250);
  const arribaTarde = color(120, 110, 190);
  const abajoTarde = color(255, 170, 110);
  const arriba = lerpColor(arribaTarde, arribaDia, luz);
  const abajo = lerpColor(abajoTarde, abajoDia, luz);
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(arriba, abajo, y / height));
    line(0, y, width, y);
  }
  noStroke();
}

function dibujarSol(x, y) {
  // Resplandor
  noStroke();
  for (let i = 4; i >= 1; i--) {
    fill(255, 240, 150, 28);
    ellipse(x, y, 70 + i * 30, 70 + i * 30);
  }
  // Rayos giratorios
  push();
  translate(x, y);
  rotate(frameCount * 0.01);
  stroke(255, 215, 70);
  strokeWeight(4);
  for (let i = 0; i < 12; i++) {
    const a = (TWO_PI / 12) * i;
    line(cos(a) * 42, sin(a) * 42, cos(a) * 58, sin(a) * 58);
  }
  pop();
  noStroke();
  fill(255, 220, 60);
  ellipse(x, y, 74, 74);
  fill(255, 240, 130);
  ellipse(x - 8, y - 8, 36, 36);
}

function moverYDibujarNubes(luz) {
  noStroke();
  for (const n of nubes) {
    n.x += n.v + viento * 0.3;
    if (n.x > width + 80) n.x = -80;
    if (n.x < -80) n.x = width + 80;
    // Las nubes se tiñen de naranja al atardecer
    fill(255, lerp(215, 255, luz), lerp(200, 255, luz), 230);
    push();
    translate(n.x, n.y);
    scale(n.escala);
    ellipse(0, 0, 70, 40);
    ellipse(-28, 8, 50, 30);
    ellipse(28, 8, 56, 32);
    ellipse(8, -14, 46, 34);
    pop();
  }
}

// ---------- Paisaje ----------

function dibujarColinas(luz) {
  noStroke();
  const sombra = lerpColor(color(255, 205, 175), color(235, 245, 255), luz);
  const nieve = lerpColor(color(255, 225, 205), color(252, 253, 255), luz);
  // Colina del fondo
  fill(sombra);
  ellipse(90, 440, 520, 300);
  ellipse(340, 450, 500, 270);
  // Suelo cercano
  fill(nieve);
  ellipse(200, 500, 760, 330);
  // Brillos de la nieve
  fill(255, 255, 255, 160);
  for (let i = 0; i < 18; i++) {
    const x = (i * 97) % width;
    const y = 345 + ((i * 53) % 50);
    ellipse(x, y, 5, 2);
  }
}

function pino(x, y, escala) {
  push();
  translate(x, y);
  scale(escala);
  noStroke();
  fill(100, 65, 40);
  rect(-6, -6, 12, 22);
  // Tres niveles de ramas con nieve encima
  for (let i = 0; i < 3; i++) {
    const base = -6 - i * 30;
    const mitad = 42 - i * 9;
    fill(30, 105, 60);
    triangle(-mitad, base, mitad, base, 0, base - 48);
    fill(255);
    triangle(-mitad * 0.55, base - 20, mitad * 0.55, base - 20, 0, base - 48);
  }
  pop();
}

function dibujarPinos() {
  pino(62, 336, 1.0);
  pino(338, 330, 0.9);
  pino(372, 346, 0.7);
  pino(30, 350, 0.65);
}

// ---------- Nieve ----------

function moverYDibujarCopos() {
  // El viento sube mientras se mantiene presionado el mouse y baja al soltar
  const dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  const objetivoViento = mouseIsPressed && dentro ? 3 : 0;
  viento = lerp(viento, objetivoViento, 0.05);

  noStroke();
  fill(255, 255, 255, 235);
  for (const c of copos) {
    c.y += c.vy;
    c.x += sin(frameCount * 0.02 + c.fase) * 0.5 + viento;
    if (c.y > height + 5) {
      c.y = -5;
      c.x = random(width);
    }
    if (c.x > width + 5) c.x = -5;
    if (c.x < -5) c.x = width + 5;
    ellipse(c.x, c.y, c.r * 2, c.r * 2);
  }
}

// ---------- Interfaz ----------

function dibujarTextos() {
  noStroke();
  fill(255, 255, 255, 235);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Mouse: mueve el sol   ·   Clic sostenido: viento', 10, 10);
}

function mouseMoved() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    objetivoSolX = constrain(mouseX, 40, 360);
  }
}

function mouseDragged() {
  mouseMoved();
}
