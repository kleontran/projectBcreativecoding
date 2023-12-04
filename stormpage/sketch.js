let raindrops = [];
function preload() {
  surferImg = loadImage('storm.png'); 
  music = loadSound('kaistorm.mp3');
  rain = loadSound('rain.wav')
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  music.loop();
  music.setVolume(0.5);
}

function draw() {
  background(135, 206, 235);
  image(surferImg, 0, 0, width, height);

  for (let i = raindrops.length - 1; i >= 0; i--) {
    raindrops[i].update();
    raindrops[i].display();
    if (raindrops[i].isOffScreen()) {
      raindrops.splice(i, 1); 
    }
  }
}



function mouseClicked() {
  
  for (let i = 0; i < 500; i++) { 
    let r = new Raindrop(mouseX, mouseY - i * 20); 
    raindrops.push(r);
    rain.play;
  }
}

class Raindrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = random(10, 20);
    this.speedY = random(5, 10); 
    this.speedX = random(1, 3); 
  }
  
  update() {
    
    this.y += this.speedY;
    this.x += this.speedX; 
  }
  
  display() {
    
    stroke(255, 255, 255);
    line(this.x, this.y, this.x + this.speedX, this.y + this.length);
  }
  
  isOffScreen() {
  return (this.y - this.length > height || this.x > width);
  }
}

