// Muñeco de nieve · p5.js
// Clic: ponerle o quitarle el sombrero · Teclas 1, 2, 3: color de la bufanda
// Acerca el mouse al muñeco y te saludará.

let conSombrero = true;
let bufanda = [220, 50, 60];
let copos = [];

function setup() {
  createCanvas(400, 400).parent('lienzo');
  for (let i = 0; i < 50; i++) {
    copos.push({ x: random(width), y: random(height), r: random(1.5, 3.5), vy: random(0.5, 1.4), fase: random(TWO_PI) });
  }
}

function draw() {
  dibujarFondo();
  moverYDibujarCopos();

  // Sombra bajo el muñeco
  noStroke();
  fill(120, 150, 190, 90);
  ellipse(200, 392, 190, 22);

  dibujarBrazos();
  dibujarCuerpo();
  dibujarCara();
  dibujarBufanda();
  if (conSombrero) dibujarSombrero();
  dibujarTextos();
}

// ---------- Escenario ----------

function dibujarFondo() {
  const arriba = color(140, 190, 230);
  const abajo = color(225, 240, 252);
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(arriba, abajo, y / height));
    line(0, y, width, y);
  }
  noStroke();
  fill(250, 252, 255);
  ellipse(200, 450, 800, 250);
  fill(235, 243, 252);
  ellipse(60, 360, 260, 60);
  ellipse(350, 372, 240, 56);
}

function moverYDibujarCopos() {
  noStroke();
  fill(255, 255, 255, 230);
  for (const c of copos) {
    c.y += c.vy;
    c.x += sin(frameCount * 0.02 + c.fase) * 0.4;
    if (c.y > height + 5) {
      c.y = -5;
      c.x = random(width);
    }
    ellipse(c.x, c.y, c.r * 2, c.r * 2);
  }
}

// ---------- Muñeco ----------

function dibujarCuerpo() {
  stroke(205, 220, 238);
  strokeWeight(2);
  fill(255);
  ellipse(200, 318, 150, 150);  // base
  ellipse(200, 228, 112, 112);  // torso
  ellipse(200, 152, 82, 82);    // cabeza
  // Botones de carbón
  noStroke();
  fill(35);
  for (let i = 0; i < 3; i++) ellipse(200, 208 + i * 22, 11, 11);
}

function dibujarCara() {
  // Ojos de carbón que siguen al mouse
  for (let lado = -1; lado <= 1; lado += 2) {
    const x = 200 + lado * 15;
    const y = 143;
    const ang = atan2(mouseY - y, mouseX - x);
    const d = min(2.5, dist(mouseX, mouseY, x, y) / 40);
    noStroke();
    fill(255);
    ellipse(x, y, 17, 17);
    fill(25);
    ellipse(x + cos(ang) * d, y + sin(ang) * d, 9, 9);
  }

  // Nariz de zanahoria: apunta hacia el lado del mouse
  const punta = constrain((mouseX - 200) / 6, -24, 24);
  noStroke();
  fill(240, 130, 30);
  triangle(194, 153, 206, 153, 200 + punta, 165);

  // Sonrisa de carbones
  fill(35);
  for (let i = 0; i < 5; i++) {
    const a = radians(35 + i * 27.5);
    ellipse(200 + cos(a) * 21, 160 + sin(a) * 15, 5, 5);
  }
}

function dibujarBufanda() {
  noStroke();
  fill(bufanda[0], bufanda[1], bufanda[2]);
  rect(158, 184, 84, 17, 8);
  // Cola de la bufanda
  push();
  translate(222, 196);
  rotate(-0.12);
  rect(0, 0, 18, 52, 4);
  pop();
  // Rayas
  fill(255, 255, 255, 140);
  rect(170, 184, 7, 17);
  rect(190, 184, 7, 17);
  rect(210, 184, 7, 17);
}

function dibujarSombrero() {
  noStroke();
  fill(30);
  ellipse(200, 118, 96, 14);     // ala
  rect(172, 70, 56, 48, 4);      // copa
  fill(bufanda[0], bufanda[1], bufanda[2]);
  rect(172, 98, 56, 11);         // cinta
}

function dibujarBrazos() {
  // El muñeco saluda si el mouse está cerca
  const cerca = dist(mouseX, mouseY, 200, 230) < 140;
  const saludo = cerca ? sin(frameCount * 0.2) * 0.35 : 0;

  stroke(110, 70, 40);
  strokeWeight(5);
  // Brazo izquierdo
  push();
  translate(152, 226);
  rotate(PI + 0.55);
  line(0, 0, 84, 0);
  line(42, 0, 58, -16);
  line(60, 0, 72, 14);
  pop();
  // Brazo derecho (el que saluda)
  push();
  translate(248, 226);
  rotate(-0.55 + saludo);
  line(0, 0, 84, 0);
  line(42, 0, 58, -16);
  line(60, 0, 72, 14);
  pop();
  noStroke();
}

// ---------- Interfaz ----------

function dibujarTextos() {
  noStroke();
  fill(40, 70, 110);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Clic: sombrero   ·   Teclas 1, 2, 3: bufanda', 10, 10);
}

function mousePressed() {
  const dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  if (dentro) conSombrero = !conSombrero;
}

function keyPressed() {
  if (key === '1') bufanda = [220, 50, 60];   // roja
  if (key === '2') bufanda = [60, 110, 220];  // azul
  if (key === '3') bufanda = [60, 170, 90];   // verde
}
