// Initialize Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set Canvas Dimensions
canvas.width = 800;
canvas.height = 600;

// Load Images
const backgroundImg = new Image();
backgroundImg.src = 'background.png';

const playerImg = new Image();
playerImg.src = 'player.png';

const enemyImg = new Image();
enemyImg.src = 'enemy.png';

const bulletImg = new Image();
bulletImg.src = 'bullet.png';

const iconImg = new Image();
iconImg.src = 'spaceship.png';

// Load Sounds
const backgroundMusic = new Audio('background_music.mp3');
const bulletSound = new Audio('laser.wav');
const explosionSound = new Audio('explosion.wav');
const gameOverSound = new Audio('gameover.wav');

// Variables
let playerX = 370;
let playerY = 480;
let playerXChange = 0;

let enemies = [];
let numOfEnemies = 6;

let bulletX = 0;
let bulletY = playerY;
let bulletYChange = 10;
let bulletState = "ready";

let scoreValue = 0;

let isGameOver = false;

// Fonts
ctx.font = '32px Arial';

// Event Listeners for Key Presses
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Start Background Music
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play();

// Initialize Enemies
for (let i = 0; i < numOfEnemies; i++) {
  enemies.push({
    img: enemyImg,
    x: Math.floor(Math.random() * 735),
    y: Math.floor(Math.random() * 100) + 50,
    xChange: 2,
    yChange: 40,
  });
}

// Functions

function keyDownHandler(event) {
  if (event.key === 'ArrowLeft') {
    playerXChange = -5;
  } else if (event.key === 'ArrowRight') {
    playerXChange = 5;
  } else if (event.key === ' ' || event.key === 'Spacebar') {
    if (bulletState === "ready") {
      bulletX = playerX;
      fireBullet();
    }
  }
}

function keyUpHandler(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    playerXChange = 0;
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, playerX, playerY, 64, 64);
}

function drawEnemy(enemy) {
  ctx.drawImage(enemy.img, enemy.x, enemy.y, 64, 64);
}

function fireBullet() {
  bulletState = "fire";
  bulletSound.play();
}

function drawBullet() {
  ctx.drawImage(bulletImg, bulletX + 16, bulletY + 10, 32, 32);
}

function isCollision(enemyX, enemyY, bulletX, bulletY) {
  let distance = Math.sqrt((enemyX - bulletX) ** 2 + (enemyY - bulletY) ** 2);
  return distance < 27;
}

function showScore() {
  ctx.fillStyle = '#ffffff';
  ctx.fillText("Score: " + scoreValue, 10, 30);
}

function gameOverText() {
  ctx.font = '64px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText("GAME OVER", canvas.width / 2 - 160, canvas.height / 2);
}

function update() {
  if (isGameOver) return;

  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // Update Player Position
  playerX += playerXChange;
  if (playerX <= 0) playerX = 0;
  if (playerX >= 736) playerX = 736;
  drawPlayer();

  // Update Enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];

    // Game Over Condition
    if (enemy.y > 440) {
      isGameOver = true;
      backgroundMusic.pause();
      gameOverSound.play();
      for (let j = 0; j < enemies.length; j++) {
        enemies[j].y = 2000;
      }
      gameOverText();
      return;
    }

    enemy.x += enemy.xChange;
    if (enemy.x <= 0) {
      enemy.xChange = 2;
      enemy.y += enemy.yChange;
    } else if (enemy.x >= 736) {
      enemy.xChange = -2;
      enemy.y += enemy.yChange;
    }

    // Check for Collision
    if (bulletState === "fire" && isCollision(enemy.x, enemy.y, bulletX, bulletY)) {
      explosionSound.play();
      bulletY = playerY;
      bulletState = "ready";
      scoreValue += 1;
      enemy.x = Math.floor(Math.random() * 735);
      enemy.y = Math.floor(Math.random() * 100) + 50;
    }

    drawEnemy(enemy);
  }

  // Update Bullet Position
  if (bulletState === "fire") {
    drawBullet();
    bulletY -= bulletYChange;
    if (bulletY <= 0) {
      bulletY = playerY;
      bulletState = "ready";
    }
  }

  // Show Score
  showScore();

  requestAnimationFrame(update);
}

// Start Game Loop
update();
