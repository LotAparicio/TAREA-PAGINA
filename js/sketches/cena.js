// ¿Qué hay de cena? · p5.js
// Clic dentro del lienzo: el plato "baraja" las opciones y se queda con una al azar.

const PLATILLOS = ['Pizza', 'Hamburguesa', 'Tacos', 'Sopa de fideos'];
let actual = 0;
let barajando = false;
let cuenta = 0; // fotogramas que lleva barajando

function setup() {
  createCanvas(400, 400).parent('lienzo');
  textAlign(CENTER, CENTER);
}

function draw() {
  dibujarMantel();
  dibujarCubiertos();
  dibujarPlato();

  // Contenido del plato
  if (barajando) {
    cuenta++;
    if (cuenta % 7 === 0) actual = (actual + 1) % PLATILLOS.length;
    if (cuenta >= 63) {
      barajando = false;
      let nuevo = floor(random(PLATILLOS.length));
      if (nuevo === actual) nuevo = (nuevo + 1) % PLATILLOS.length;
      actual = nuevo;
    }
  }
  if (actual === 0) pizza(200, 215);
  if (actual === 1) hamburguesa(200, 215);
  if (actual === 2) tacos(200, 215);
  if (actual === 3) sopa(200, 215);

  dibujarTextos();
}

// ---------- Mesa ----------

function dibujarMantel() {
  background(250, 245, 235);
  noStroke();
  fill(215, 70, 70);
  // Cuadros rojos tipo mantel
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      if ((x / 40 + y / 40) % 2 === 0) rect(x, y, 40, 40);
    }
  }
  fill(255, 255, 255, 60);
  rect(0, 0, width, height);
}

function dibujarPlato() {
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(206, 223, 270, 270); // sombra
  fill(255);
  ellipse(200, 215, 270, 270);
  fill(235, 238, 245);
  ellipse(200, 215, 220, 220);
  fill(255);
  ellipse(200, 215, 208, 208);
}

function dibujarCubiertos() {
  noStroke();
  // Tenedor (izquierda)
  fill(190, 195, 205);
  rect(40, 160, 6, 60, 2);
  rect(50, 160, 6, 60, 2);
  rect(60, 160, 6, 60, 2);
  rect(40, 205, 26, 14, 4);
  rect(48, 215, 10, 120, 5);
  // Cuchillo (derecha)
  fill(205, 210, 220);
  rect(340, 160, 18, 100, 8, 8, 2, 2);
  fill(190, 195, 205);
  rect(343, 255, 12, 80, 5);
}

// ---------- Platillos ----------

function pizza(x, y) {
  noStroke();
  fill(225, 170, 90);
  ellipse(x, y, 190, 190);       // orilla
  fill(205, 60, 40);
  ellipse(x, y, 164, 164);       // salsa
  fill(250, 210, 90);
  ellipse(x, y, 150, 150);       // queso
  // Pepperoni
  fill(175, 40, 40);
  const pos = [[-40, -30], [35, -40], [-5, 5], [-50, 35], [40, 30], [0, -62], [5, 55]];
  for (const p of pos) ellipse(x + p[0], y + p[1], 28, 28);
  fill(205, 80, 70);
  for (const p of pos) ellipse(x + p[0] - 4, y + p[1] - 4, 8, 8);
  // Cortes
  stroke(205, 150, 70);
  strokeWeight(2);
  line(x - 75, y, x + 75, y);
  line(x, y - 75, x, y + 75);
  line(x - 53, y - 53, x + 53, y + 53);
  line(x + 53, y - 53, x - 53, y + 53);
  noStroke();
}

function hamburguesa(x, y) {
  noStroke();
  // Pan de abajo
  fill(220, 150, 70);
  rect(x - 80, y + 38, 160, 28, 4, 4, 18, 18);
  // Carne
  fill(110, 60, 35);
  rect(x - 86, y + 14, 172, 28, 14);
  // Queso
  fill(250, 200, 50);
  triangle(x - 84, y + 8, x + 84, y + 8, x, y + 38);
  // Lechuga
  fill(90, 180, 70);
  for (let i = -4; i <= 4; i++) ellipse(x + i * 20, y + 6, 26, 16);
  // Jitomate
  fill(220, 60, 50);
  rect(x - 76, y - 6, 152, 12, 6);
  // Pan de arriba
  fill(225, 150, 65);
  arc(x, y - 4, 170, 130, PI, TWO_PI, CHORD);
  fill(250, 235, 200);
  const semillas = [[-40, -42], [-10, -56], [26, -46], [-62, -20], [58, -22], [8, -26], [-28, -18]];
  for (const s of semillas) ellipse(x + s[0], y + s[1], 9, 5);
}

function tacos(x, y) {
  noStroke();
  for (let i = 0; i < 2; i++) {
    const cx = x - 45 + i * 90;
    const cy = y + 32;
    // Sombra bajo el taco
    fill(0, 0, 0, 25);
    ellipse(cx, cy + 3, 96, 10);
    // Relleno que sobresale por arriba
    fill(150, 70, 45);
    for (let k = -3; k <= 3; k++) ellipse(cx + k * 11, cy - 44 + abs(k) * 2, 15, 12);
    fill(255, 255, 240);
    ellipse(cx - 14, cy - 47, 8, 8);
    ellipse(cx + 18, cy - 45, 8, 8);
    fill(70, 160, 60);
    ellipse(cx - 4, cy - 51, 8, 6);
    ellipse(cx + 8, cy - 50, 8, 6);
    ellipse(cx + 28, cy - 41, 7, 6);
    // Tortilla (media luna con el doblez marcado)
    fill(240, 215, 140);
    stroke(205, 175, 100);
    strokeWeight(2);
    arc(cx, cy, 96, 96, PI, TWO_PI, CHORD);
    noStroke();
    fill(250, 232, 170);
    arc(cx - 6, cy - 4, 60, 60, PI + 0.4, TWO_PI - 0.9, CHORD);
  }
  // Limón
  fill(140, 200, 60);
  arc(x, y + 72, 52, 52, 0, PI, CHORD);
  fill(200, 235, 110);
  arc(x, y + 72, 40, 40, 0, PI, CHORD);
}

function sopa(x, y) {
  noStroke();
  // Tazón visto desde arriba
  fill(60, 110, 190);
  ellipse(x, y, 176, 176);
  fill(235, 150, 60);
  ellipse(x, y, 150, 150);       // caldo
  // Fideos
  noFill();
  stroke(250, 225, 150);
  strokeWeight(5);
  for (let i = 0; i < 6; i++) {
    const r = 22 + i * 9;
    arc(x, y, r * 2, r * 1.3, i * 1.1, i * 1.1 + 2.6);
  }
  noStroke();
  // Zanahoria y chícharos
  fill(240, 110, 30);
  ellipse(x - 30, y - 24, 12, 12);
  ellipse(x + 34, y + 20, 12, 12);
  ellipse(x - 8, y + 36, 12, 12);
  fill(90, 170, 70);
  ellipse(x + 24, y - 34, 8, 8);
  ellipse(x - 40, y + 14, 8, 8);
  ellipse(x + 8, y - 6, 8, 8);
  // Vapor animado
  noFill();
  stroke(255, 255, 255, 190);
  strokeWeight(4);
  for (let i = -1; i <= 1; i++) {
    const base = x + i * 34;
    const sube = (frameCount * 0.6 + i * 20) % 50;
    beginShape();
    for (let t = 0; t <= 40; t += 8) {
      vertex(base + sin((t + frameCount * 2) * 0.12) * 7, y - 40 - sube - t);
    }
    endShape();
  }
  noStroke();
}

// ---------- Interfaz ----------

function dibujarTextos() {
  // Cartel superior
  noStroke();
  fill(255, 255, 255, 235);
  rect(60, 14, 280, 44, 22);
  fill(70, 40, 30);
  textSize(24);
  text('¿Qué hay de cena?', 200, 36);

  // Resultado
  fill(255, 255, 255, 235);
  rect(60, 352, 280, 38, 19);
  fill(70, 40, 30);
  textSize(18);
  if (barajando) {
    text('Pensando… ' + PLATILLOS[actual], 200, 371);
  } else {
    text('¡Hoy hay: ' + PLATILLOS[actual] + '!', 200, 371);
  }
}

function mousePressed() {
  const dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  if (dentro && !barajando) {
    barajando = true;
    cuenta = 0;
  }
}
