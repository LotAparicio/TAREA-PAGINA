// Dientes de conejo · p5.js
// Clic dentro del lienzo: el conejo muerde la zanahoria.

const LARGO_ZANAHORIA = 90;
let largoZanahoria = LARGO_ZANAHORIA;
let mordida = 0;      // 1 → 0: animación de una mordida
let migajas = [];     // partículas de zanahoria

function setup() {
  createCanvas(400, 400).parent('lienzo');
}

function draw() {
  background(255, 238, 205);
  dibujarFondo();

  const abre = sin(mordida * PI);           // 0 cerrada, 1 abierta
  const temblor = sin(mordida * PI * 4) * 3; // vibración de los dientes
  if (mordida > 0) mordida = max(0, mordida - 0.04);

  dibujarOrejas(abre);
  dibujarCabeza();
  dibujarOjos();
  dibujarBigotes();
  dibujarBoca(abre);
  dibujarZanahoria();
  dibujarDientes(temblor, abre);
  dibujarNariz();
  actualizarMigajas();
  dibujarTextos();
}

// ---------- Escenario ----------

function dibujarFondo() {
  noStroke();
  // Pasto
  fill(150, 205, 120);
  rect(0, 345, width, 55);
  fill(120, 185, 95);
  for (let x = 6; x < width; x += 18) {
    triangle(x, 350, x + 5, 336, x + 10, 350);
  }
}

// ---------- Conejo ----------

function dibujarOrejas(abre) {
  const mover = sin(frameCount * 0.05) * 0.03 + abre * 0.06;
  noStroke();
  for (let lado = -1; lado <= 1; lado += 2) {
    push();
    translate(200 + lado * 48, 150);
    rotate(lado * (0.16 + mover));
    fill(235, 235, 240);
    ellipse(0, -62, 56, 150);
    fill(255, 180, 195);
    ellipse(0, -58, 28, 112);
    pop();
  }
}

function dibujarCabeza() {
  noStroke();
  fill(235, 235, 240);
  ellipse(200, 230, 200, 170);
  // Mejillas abultadas
  fill(245, 245, 248);
  ellipse(165, 270, 100, 80);
  ellipse(235, 270, 100, 80);
  // Rubor
  fill(255, 190, 200, 120);
  ellipse(118, 248, 34, 20);
  ellipse(282, 248, 34, 20);
}

function dibujarOjos() {
  for (let lado = -1; lado <= 1; lado += 2) {
    const x = 200 + lado * 42;
    const y = 212;
    const ang = atan2(mouseY - y, mouseX - x);
    const d = min(4, dist(mouseX, mouseY, x, y) / 30);
    noStroke();
    fill(30);
    ellipse(x + cos(ang) * d, y + sin(ang) * d, 24, 28);
    fill(255);
    ellipse(x + cos(ang) * d - 4, y + sin(ang) * d - 5, 8, 8);
  }
}

function dibujarBigotes() {
  stroke(110);
  strokeWeight(1.5);
  const v = sin(frameCount * 0.08) * 2;
  for (let lado = -1; lado <= 1; lado += 2) {
    line(200 + lado * 40, 262, 200 + lado * 105, 250 + v);
    line(200 + lado * 40, 270, 200 + lado * 110, 270);
    line(200 + lado * 40, 278, 200 + lado * 105, 290 - v);
  }
  noStroke();
}

function dibujarNariz() {
  noStroke();
  fill(240, 120, 150);
  triangle(188, 254, 212, 254, 200, 268);
  stroke(120);
  strokeWeight(2);
  line(200, 268, 200, 278);
  noStroke();
}

function dibujarBoca(abre) {
  // Hendidura de la boca
  noFill();
  stroke(120);
  strokeWeight(2);
  arc(188, 278, 24, 18, 0.2, PI - 0.2);
  arc(212, 278, 24, 18, 0.2, PI - 0.2);
  noStroke();
  // Interior de la boca al morder
  if (abre > 0.05) {
    fill(150, 50, 70);
    ellipse(200, 292, 40, 10 + 26 * abre);
  }
}

function dibujarDientes(temblor, abre) {
  // Dos dientes grandes que bajan un poco al abrir la boca
  const y = 276 + abre * 8 + temblor * 0.5;
  stroke(160);
  strokeWeight(1.5);
  fill(255);
  rect(186, y, 14, 32, 3);
  rect(200, y, 14, 32, 3);
  noStroke();
}

function dibujarZanahoria() {
  if (largoZanahoria <= 0) return;
  // La zanahoria sube desde la parte baja: la punta queda junto a los dientes
  const base = 392;
  const punta = base - largoZanahoria;
  const ancho = map(largoZanahoria, 0, LARGO_ZANAHORIA, 6, 36);
  noStroke();
  fill(240, 140, 40);
  triangle(200 - ancho / 2, base, 200 + ancho / 2, base, 200, punta + 14);
  // Rayitas
  stroke(210, 110, 30);
  strokeWeight(2);
  if (largoZanahoria > 40) {
    line(194, base - 18, 204, base - 22);
    line(198, base - 42, 206, base - 46);
  }
  noStroke();
  // Hojas
  fill(70, 160, 70);
  ellipse(188, base, 18, 34);
  ellipse(200, base + 2, 18, 40);
  ellipse(212, base, 18, 34);
}

// ---------- Migajas ----------

function crearMigajas() {
  for (let i = 0; i < 10; i++) {
    migajas.push({
      x: 200 + random(-12, 12),
      y: 318,
      vx: random(-2.5, 2.5),
      vy: random(-3.5, -1),
      vida: 40
    });
  }
}

function actualizarMigajas() {
  noStroke();
  for (let i = migajas.length - 1; i >= 0; i--) {
    const m = migajas[i];
    m.x += m.vx;
    m.y += m.vy;
    m.vy += 0.25; // gravedad
    m.vida--;
    fill(240, 140, 40, map(m.vida, 0, 40, 0, 255));
    ellipse(m.x, m.y, 6, 6);
    if (m.vida <= 0) migajas.splice(i, 1);
  }
}

// ---------- Interfaz ----------

function dibujarTextos() {
  noStroke();
  fill(90, 70, 40);
  textAlign(CENTER, TOP);
  textSize(14);
  if (largoZanahoria <= 0) {
    textSize(16);
    text('¡Se acabó la zanahoria! Haz clic para otra', 200, 10);
  } else {
    text('Haz clic para morder la zanahoria', 200, 10);
  }
}

function mousePressed() {
  const dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  if (!dentro || mordida > 0.2) return;

  if (largoZanahoria <= 0) {
    largoZanahoria = LARGO_ZANAHORIA; // nueva zanahoria
  } else {
    largoZanahoria = max(0, largoZanahoria - 18);
    mordida = 1;
    crearMigajas();
  }
}
