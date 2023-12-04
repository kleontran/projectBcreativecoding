let surfer;
let whirlpools = [];
let raindrops = [];
let health;
let gameOver = false;
let gameWon = false;
let startTime;
let gameDuration = 15000;
let showStartScreen = true;
let surferImg;
let hasPlayedGameOverSound = false;
let hasPlayedGameWonSound = false;

function preload() {
  surferImg = loadImage('kai.png'); 
  music = loadSound('video-game-music.mp3');
  thunder = loadSound('thunder-striking.mp3');
  gameover = loadSound('gameover.mp3');
  gamewon = loadSound('gamewon.mp3');
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  surfer = new Surfer();
  health = new HealthBar(10, 10, 200, 20, 100);
  for (let i = 0; i < 10; i++) {
    whirlpools.push(new Whirlpool(random(width), random(height - 100)));
  }
  for (let i = 0; i < 500; i++) {
    raindrops.push(new Raindrop());
  }
  startTime = millis();
}

function draw() {
  if (showStartScreen) {
    displayStartScreen();
  } else {
    if (!gameOver && !gameWon) {
      background(135, 206, 235); 
      for (let whirlpool of whirlpools) {
        whirlpool.display();
        whirlpool.move();
      }
      surfer.display();
      surfer.move();
      health.display();
      for (let whirlpool of whirlpools) {
        if (surfer.collidesWith(whirlpool)) {
          health.decrease(1);
          if (health.currentHealth <= 0) {
            gameOver = true;
          }
        }
      }
      for (let drop of raindrops) {
        drop.fall();
        drop.display();
      }
      thunderStrike();
      if (millis() - startTime >= gameDuration) {
        gameWon = true;
      }
    } else if (gameOver) {
      displayGameOver();
    } else if (gameWon) {
      displayGameWon();
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    surfer.setDirection(-1);
  } else if (keyCode === RIGHT_ARROW) {
    surfer.setDirection(1);
  } else if (keyCode === ENTER) {
    if (gameOver || gameWon) {
      restartGame();
    }
  }
}

function mousePressed() {
  if (showStartScreen) {
    showStartScreen = false;
    startTime = millis();
    music.loop(); 
  }
}


function restartGame() {
  gameOver = false;
  gameWon = false;
  showStartScreen = true;
  health.reset();
  surfer.x = width / 2;
  surfer.setDirection(0);
  whirlpools = [];
  for (let i = 0; i < 20; i++) {
    whirlpools.push(new Whirlpool(random(width), random(height - 50)));
  }
  startTime = millis();
  music.stop(); 
  hasPlayedGameOverSound = false;
  hasPlayedGameWonSound = false;
}


function keyReleased() {
  surfer.setDirection(0);
}

class Surfer {
  constructor() {
    this.x = width / 2;
    this.y = height - 60;
    this.size = 100; 
    this.speed = 5;
    this.direction = 0;
  }


  display() {
    push(); 
    imageMode(CENTER);

    translate(this.x, this.y); 

    
    if (this.direction === -1) {
      scale(-1, 1);
    }

    image(surferImg, 0, 0, this.size, this.size); 

    pop(); 
  }


  move() {
    this.x += this.speed * this.direction;
    this.x = constrain(this.x, 0, width); 
  }

  setDirection(dir) {
    this.direction = dir;
  }

  collidesWith(whirlpool) {
    let d = dist(this.x, this.y, whirlpool.x, whirlpool.y);
    return d < this.size / 2 + whirlpool.size / 2;
  }
}


class Whirlpool {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80; 
    this.speed = 2;
    this.rotation = 0;
    this.detail = 720; 
  }

  display() {
    push(); 
    translate(this.x, this.y); 
    rotate(this.rotation); 
    noFill();
    stroke(0, 0, 255); 
    beginShape();
    for (let i = 0; i < this.detail; i += 10) {
      let r = map(i, 0, this.detail, 0, this.size / 2); 
      let x = r * cos(radians(i));
      let y = r * sin(radians(i));
      vertex(x, y);
    }
    endShape();

    pop(); 
  }

  move() {
    this.y += this.speed;
    this.rotation += 0.05;
    if (this.y > height) {
      this.y = -this.size;
      this.x = random(width);
      this.rotation = 0;
    }
  }
}




class HealthBar {
  constructor(x, y, w, h, maxHealth) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  display() {
    noFill();
      stroke(255);
      rect(this.x, this.y, this.width, this.height); 
      let healthPercentage = this.currentHealth / this.maxHealth * 100;
      
      
      if (healthPercentage > 50) {
        fill(0, 255, 0); 
      } else if (healthPercentage > 20) {
        fill(255, 255, 0); 
      } else {
        fill(255, 0, 0); 
      }
  
      let healthBarWidth = healthPercentage / 100 * this.width;
      noStroke();
      rect(this.x, this.y, healthBarWidth, this.height); 
    }

  decrease(amount) {
    this.currentHealth -= amount;
    this.currentHealth = max(this.currentHealth, 0); 
  }

  reset() {
    this.currentHealth = this.maxHealth;
  }
}
class Raindrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-500, -50); 
    this.length = random(10, 20);
    this.speed = random(5, 10);
    this.rippleSize = 0;
  }

  fall() {
    this.y += this.speed;
    if (this.y > height) {
      this.rippleSize = 0;
      this.reset();
    }
  }

  display() {
    stroke(138, 43, 226); 
    line(this.x, this.y, this.x, this.y + this.length);
  }
}

function displayGameOver() {
  fill(0);
  textAlign(CENTER);
  textSize(48);
  text('GAME OVER: Press Enter to Restart', width / 2, height / 2);
  
  if (!hasPlayedGameOverSound) {
    gameover.play();
    hasPlayedGameOverSound = true;
    music.stop(); 
  }
}


function displayGameWon() {
  fill(0, 255, 0);
  textAlign(CENTER);
  textSize(48);
  text('YOU WON!', width / 2, height / 2);
  
  if (!hasPlayedGameWonSound) {
    gamewon.play();
    hasPlayedGameWonSound = true;
    music.stop(); // Stop the background music
  }
}

function thunderStrike() {
  if (random(1) < 0.01) {
    fill(255, 255, 0);
    noStroke();
    rect(0, 0, width, height);
    if (!thunder.isPlaying()) { 
      thunder.play();
    }
  }
}


function displayStartScreen() {
  background(135, 206, 235);
  textAlign(CENTER);
  textSize(32);
  fill(0);
  textSize(32);
  text('Click to Start:', width / 2, height / 2);
  textSize(28);
  text('Use the left and right arrows to move. Avoid the whirlpools!', width / 2, height * 3 / 4);
}