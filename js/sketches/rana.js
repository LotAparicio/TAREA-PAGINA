// Rana · p5.js
// Clic dentro del lienzo: la rana lanza la lengua hacia el cursor.
// Barra espaciadora: la rana salta. ¡Atrapa las moscas!

let saltoT = 0;      // 0 = en reposo; entre 0 y 1 = saltando
let lenguaT = 0;     // 0 = lengua guardada; entre 0 y 1 = lengua en movimiento
let objetivoX = 200; // hacia dónde se lanza la lengua
let objetivoY = 150;
let moscas = 0;      // marcador
let mosca = { x: 100, y: 90 };
let atrapada = false; // evita contar dos veces la misma mosca en un lanzamiento

function setup() {
  createCanvas(400, 400).parent('lienzo');
}

function draw() {
  dibujarEstanque();
  moverMosca();

  // Altura del salto: una media onda de seno (sube y baja suave)
  let salto = 0;
  if (saltoT > 0) {
    salto = sin(saltoT * PI) * 90;
    saltoT += 0.03;
    if (saltoT >= 1) saltoT = 0;
  }

  dibujarNenufar();

  push();
  translate(0, -salto);
  dibujarRana(salto);
  pop();

  dibujarMosca();
  dibujarTextos();
}

// ---------- Escenario ----------

function dibujarEstanque() {
  background(52, 140, 160);
  // Ondas de agua que se expanden lentamente
  noFill();
  stroke(255, 255, 255, 45);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    const t = (frameCount * 0.4 + i * 60) % 240;
    ellipse(200, 320, t * 1.8, t * 0.7);
  }
  noStroke();
}

function dibujarNenufar() {
  noStroke();
  fill(40, 130, 60);
  arc(200, 322, 300, 110, 0.35, TWO_PI - 0.35, PIE);
  fill(60, 160, 80);
  ellipse(200, 318, 240, 82);
  // Flor del nenúfar
  fill(255, 190, 215);
  ellipse(318, 296, 22, 14);
  ellipse(332, 300, 22, 14);
  ellipse(310, 306, 22, 14);
  fill(255, 225, 90);
  ellipse(322, 301, 10, 10);
}

// ---------- Mosca ----------

function moverMosca() {
  mosca.x = 40 + noise(frameCount * 0.008) * 320;
  mosca.y = 50 + noise(500 + frameCount * 0.010) * 130;
}

function dibujarMosca() {
  push();
  translate(mosca.x, mosca.y);
  noStroke();
  // Alas que aletean
  fill(255, 255, 255, 170);
  const aleteo = frameCount % 4 < 2 ? 1 : 0.4;
  ellipse(-5, -5, 10, 14 * aleteo);
  ellipse(5, -5, 10, 14 * aleteo);
  // Cuerpo
  fill(30);
  ellipse(0, 0, 9, 12);
  fill(200, 30, 30);
  ellipse(0, -5, 6, 6);
  pop();
}

// ---------- Rana ----------

function dibujarRana(salto) {
  const estirada = salto / 90; // 0 en reposo, 1 en lo más alto

  noStroke();

  // Patas traseras (se estiran en el salto)
  fill(60, 160, 60);
  ellipse(125, 290, 70 + 20 * estirada, 44 - 8 * estirada);
  ellipse(275, 290, 70 + 20 * estirada, 44 - 8 * estirada);
  // Dedos traseros
  fill(70, 175, 70);
  ellipse(95, 300, 26, 12);
  ellipse(305, 300, 26, 12);

  // Cuerpo y vientre
  fill(70, 170, 70);
  ellipse(200, 270, 170, 120);
  fill(190, 230, 140);
  ellipse(200, 285, 110, 80);

  // Patas delanteras
  fill(60, 160, 60);
  ellipse(150, 320, 26, 40);
  ellipse(250, 320, 26, 40);
  fill(70, 175, 70);
  ellipse(143, 338, 12, 8);
  ellipse(157, 340, 12, 8);
  ellipse(243, 340, 12, 8);
  ellipse(257, 338, 12, 8);

  // Cabeza
  fill(80, 180, 80);
  ellipse(200, 230, 150, 90);

  // Manchas del lomo
  fill(40, 120, 50);
  ellipse(165, 255, 14, 10);
  ellipse(235, 258, 18, 11);
  ellipse(205, 248, 10, 8);

  // Ojos que siguen al cursor
  dibujarOjo(162, 200, salto);
  dibujarOjo(238, 200, salto);

  // Fosas nasales
  fill(40, 110, 50);
  ellipse(190, 222, 4, 3);
  ellipse(210, 222, 4, 3);

  // Boca: abierta mientras sale la lengua
  const boca = lenguaT > 0;
  if (boca) {
    fill(150, 40, 60);
    arc(200, 244, 96, 54, 0, PI, CHORD);
  } else {
    noFill();
    stroke(30, 90, 40);
    strokeWeight(3);
    arc(200, 232, 96, 40, 0.15, PI - 0.15);
    noStroke();
  }

  // Lengua
  if (lenguaT > 0) {
    dibujarLengua(salto);
    lenguaT += 0.045;
    if (lenguaT >= 1) {
      lenguaT = 0;
      atrapada = false;
    }
  }
}

function dibujarOjo(x, y, salto) {
  // Pupila: apunta hacia el mouse, sin salirse del ojo
  const dx = mouseX - x;
  const dy = mouseY - (y - salto);
  const ang = atan2(dy, dx);
  const d = min(5, dist(mouseX, mouseY, x, y - salto) / 25);

  fill(80, 180, 80);
  ellipse(x, y, 52, 48);
  fill(255);
  ellipse(x, y, 36, 36);
  fill(20);
  ellipse(x + cos(ang) * d, y + sin(ang) * d, 17, 17);
  fill(255);
  ellipse(x + cos(ang) * d - 3, y + sin(ang) * d - 3, 5, 5);
}

function dibujarLengua(salto) {
  // La lengua sale (0 → 0.5) y regresa (0.5 → 1)
  const p = sin(lenguaT * PI);
  const baseX = 200;
  const baseY = 244;
  // El objetivo está en coordenadas del lienzo; se compensa el salto
  const objY = objetivoY + salto;
  const puntaX = lerp(baseX, objetivoX, p);
  const puntaY = lerp(baseY, objY, p);

  stroke(235, 90, 120);
  strokeWeight(9);
  line(baseX, baseY, puntaX, puntaY);
  noStroke();
  fill(245, 120, 145);
  ellipse(puntaX, puntaY, 16, 16);

  // ¿La punta toca la mosca? (se pasa a coordenadas del lienzo)
  if (!atrapada && lenguaT > 0.2 && lenguaT < 0.8) {
    if (dist(puntaX, puntaY - salto, mosca.x, mosca.y) < 22) {
      atrapada = true;
      moscas++;
      noiseSeed(floor(random(10000))); // la siguiente mosca aparece en otro lugar
    }
  }
}

// ---------- Interfaz ----------

function dibujarTextos() {
  noStroke();
  fill(255, 255, 255, 230);
  textSize(14);
  textAlign(LEFT, TOP);
  text('Clic: lengua   ·   Espacio: salto', 10, 10);
  textAlign(RIGHT, TOP);
  textSize(18);
  text('Moscas: ' + moscas, 390, 8);
}

function mouseDentro() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function mousePressed() {
  if (mouseDentro() && lenguaT === 0) {
    objetivoX = mouseX;
    objetivoY = mouseY;
    lenguaT = 0.001;
  }
}

function keyPressed() {
  if (key === ' ' && saltoT === 0) {
    saltoT = 0.001;
    return false; // evita que la página baje al presionar espacio
  }
}
