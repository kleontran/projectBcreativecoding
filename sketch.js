

let surferImg, sunImg, music;
let sunX, sunY; 
let sunAngle = 0; 
let dragging = false; 

function preload() {
  surferImg = loadImage('start.png');
  sunImg = loadImage('sun.png'); 
  music = loadSound('music.mp3');
  click = loadSound('clicksun.wav');
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  music.loop();
  sunX = width * 10.5/ 12;
  sunY = height /4;
}

function draw() {
  background(135, 206, 235);
  image(surferImg, 0, 0, width, height);
  push();
  translate(sunX, sunY);
  rotate(sunAngle);
  imageMode(CENTER);
  image(sunImg, 0, 0, 200, 200); 
  pop();
}

function mousePressed() {
  
  if (dist(mouseX, mouseY, sunX, sunY) < 25) { 
    sunAngle += QUARTER_PI; 
    if (!click.isPlaying()) {
      click.play();
    }
  }
}

function mouseDragged() {
  if (dist(mouseX, mouseY, sunX, sunY) < 25) {
    sunX = mouseX;
    sunY = mouseY;
  }
}
