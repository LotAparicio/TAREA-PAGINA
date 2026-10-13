// Mini demo en vivo de p5.js (página "Fundamentos de p5.js")
// Mueve el mouse sobre el lienzo: deja una estela de círculos de colores.

function setup() {
  createCanvas(360, 220).parent('lienzo');
  noStroke();
  background(23, 50, 77);
}

function draw() {
  // Un fondo casi transparente en cada cuadro deja una estela que se desvanece
  background(23, 50, 77, 30);

  let x, y;
  const dentro = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  if (dentro) {
    x = mouseX;
    y = mouseY;
  } else {
    // Sin mouse encima: el círculo recorre una órbita
    x = width / 2 + cos(frameCount * 0.03) * 110;
    y = height / 2 + sin(frameCount * 0.05) * 60;
  }

  // La velocidad del mouse cambia el tamaño; la posición cambia el color
  const velocidad = dist(mouseX, mouseY, pmouseX, pmouseY);
  const tamano = dentro ? map(velocidad, 0, 40, 18, 60, true) : 30;
  fill(map(x, 0, width, 80, 255), map(y, 0, height, 120, 220), 200, 200);
  circle(x, y, tamano);

  fill(255, 255, 255, 200);
  textSize(12);
  textAlign(LEFT, TOP);
  text('Mueve el mouse aquí', 8, 8);
}
