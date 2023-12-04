let surferImg, cerfImg, ballImg, music, click, ball;
let cerfX, cerfY, ballX, ballY;
let cerfAngle = 0; 
let ballAngle = 0;
let ballVelocityX; 
let ballIsMoving = false; 
let cerfVerticalSpeed = 0.02;
let cerfVerticalAngle = 0;
let cerfHorizontalSpeed = 2;
let buffer = 50;
let cerfDirection = -1;

function preload() {
  surferImg = loadImage('end.png'); 
  cerfImg = loadImage('cerfvolant.png');
  ballImg = loadImage('ball.png');
  music = loadSound('end.mp3');
  click = loadSound('clickwind.wav');
  ball = loadSound('clickball.wav');
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  music.loop();
  click.loop();
  cerfX = width * 10.5 / 12;
  cerfY = height / 6;
  ballX = width * 10.5 / 12;
  ballY = height * 5.4 / 6;

  ballVelocityX = 0;
}

function draw() {
  background(135, 206, 235);
  image(surferImg, 0, 0, width, height);
  drawKite();
  updateKiteVertical();
  updateKiteHorizontal();
 
  if (ballIsMoving) {
    let prevX = ballX;

    ballX += ballVelocityX;

    let distanceMoved = abs(ballX - prevX);
    if (ballVelocityX > 0) {
      ballAngle += distanceMoved / (850 / 5 * PI) * 8;
    } else {
      ballAngle -= distanceMoved / (850 / 5 * PI) * 8;
    } 
    ballVelocityX *= 0.98;

    if (abs(ballVelocityX) < 0.1) {
      ballIsMoving = false;
      ballVelocityX = 0;
    }

    if (ballX < 0 || ballX > width) {
      ballVelocityX *= -1;
    }
  }

  push();
  translate(ballX, ballY);
  rotate(ballAngle);
  imageMode(CENTER);
  image(ballImg, 0, 0, 850 / 5, 695 / 5);
  pop();
}

function mousePressed() {
  if (dist(mouseX, mouseY, ballX, ballY) < 100) { 
    ball.play();
    ballIsMoving = true;
    ballVelocityX = (ballX - mouseX) * 0.1;
  }
}
function mouseDragged() {
  if (dist(mouseX, mouseY, cerfX, cerfY) < 100) {
    cerfX = mouseX;
    cerfY = mouseY;
  }
}
function drawKite() {
  push();
  translate(cerfX, cerfY);
  scale(cerfDirection, 1);
  imageMode(CENTER);
  image(cerfImg, 0, 0, 200, 200);
  pop();
}

function updateKiteVertical() {
  cerfY = height / 6 + 50 * sin(cerfVerticalAngle);
  cerfVerticalAngle += cerfVerticalSpeed;
}

function updateKiteHorizontal() {
  cerfX += cerfHorizontalSpeed;

  if (cerfX < buffer || cerfX > width - buffer) {
      cerfHorizontalSpeed = -cerfHorizontalSpeed;
      cerfDirection *= -1; 
  }
}

