# **Complete MB-Style Game with Graphics & Effects**

Here's the full JavaScript code (`game.js`) with embedded graphics (using canvas drawing) and sound effects (using free online URLs) that you can host on GitHub:

```javascript
// Game Configuration
const config = {
    width: 800,
    height: 500,
    backgroundColor: '#87CEEB',
    groundHeight: 50,
    gravity: 0.8,
    playerSpeed: 5,
    jumpPower: 15
};

// Game Elements
const gameElements = {
    player: {
        x: 100,
        y: config.height - 150,
        width: 60,
        height: 100,
        color: '#1E90FF',
        velY: 0,
        isJumping: false,
        score: 0,
        health: 100
    },
    coins: [],
    enemies: [],
    particles: []
};

// Sound Effects (using free online URLs)
const sounds = {
    jump: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-jumping-2049.mp3'),
    coin: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-271.mp3'),
    hit: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-explosion-2759.mp3'),
    bgMusic: new Audio('https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-668.mp3')
};

// Initialize Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = config.width;
canvas.height = config.height;

// Mobile Controls
document.querySelector('.btn-left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.querySelector('.btn-left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.querySelector('.btn-right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.querySelector('.btn-right').addEventListener('touchend', () => keys['ArrowRight'] = false);
document.querySelector('.btn-jump').addEventListener('touchstart', () => {
    keys[' '] = true;
    jump();
});

// Keyboard Controls
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Game Functions
function spawnCoin() {
    gameElements.coins.push({
        x: randomInt(config.width, config.width + 500),
        y: randomInt(100, config.height - 200),
        radius: 15,
        color: '#FFD700',
        speed: randomInt(3, 6)
    });
}

function spawnEnemy() {
    gameElements.enemies.push({
        x: randomInt(config.width, config.width + 800),
        y: config.height - 150,
        width: 50,
        height: 80,
        color: '#FF4500',
        speed: randomInt(4, 7)
    });
}

function jump() {
    if (!gameElements.player.isJumping) {
        gameElements.player.velY = -config.jumpPower;
        gameElements.player.isJumping = true;
        sounds.jump.play();
    }
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        gameElements.particles.push({
            x: x,
            y: y,
            size: randomInt(2, 5),
            color: color,
            velX: randomInt(-3, 3),
            velY: randomInt(-5, 0),
            life: 30
        });
    }
}

// Helper Functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Drawing Functions
function drawPlayer() {
    // Body
    ctx.fillStyle = gameElements.player.color;
    ctx.fillRect(gameElements.player.x, gameElements.player.y, gameElements.player.width, gameElements.player.height);
    
    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(gameElements.player.x + 15, gameElements.player.y + 20, 10, 10);
    ctx.fillRect(gameElements.player.x + 35, gameElements.player.y + 20, 10, 10);
    
    // Mouth
    ctx.fillStyle = 'black';
    ctx.fillRect(gameElements.player.x + 25, gameElements.player.y + 40, 20, 5);
}

function drawEnemy(x, y, width, height) {
    // Body
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(x, y, width, height);
    
    // Angry Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 10, y + 20, 8, 8);
    ctx.fillRect(x + 30, y + 20, 8, 8);
    
    // Spikes
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y - 15);
    ctx.lineTo(x + 20, y);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
}

function drawCoin(x, y, radius) {
    // Coin
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // Shine
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, radius/3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
}

function drawParticles() {
    gameElements.particles.forEach((p, i) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        
        p.x += p.velX;
        p.y += p.velY;
        p.life--;
        
        if (p.life <= 0) {
            gameElements.particles.splice(i, 1);
        }
    });
}

// Game Loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, config.height - config.groundHeight, config.width, config.groundHeight);
    
    // Player movement
    if (keys['ArrowLeft'] && gameElements.player.x > 0) {
        gameElements.player.x -= config.playerSpeed;
    }
    if (keys['ArrowRight'] && gameElements.player.x < config.width - gameElements.player.width) {
        gameElements.player.x += config.playerSpeed;
    }
    if (keys[' ']) {
        jump();
    }
    
    // Apply gravity
    gameElements.player.velY += config.gravity;
    gameElements.player.y += gameElements.player.velY;
    
    // Ground collision
    if (gameElements.player.y >= config.height - 150) {
        gameElements.player.y = config.height - 150;
        gameElements.player.isJumping = false;
    }
    
    // Update coins
    gameElements.coins.forEach((coin, i) => {
        coin.x -= coin.speed;
        
        // Coin collection
        if (distance(
            gameElements.player.x + gameElements.player.width/2, 
            gameElements.player.y + gameElements.player.height/2,
            coin.x, coin.y
        ) < 30) {
            gameElements.player.score += 10;
            sounds.coin.play();
            createParticles(coin.x, coin.y, '#FFD700', 10);
            coin.x = randomInt(config.width, config.width + 500);
            coin.y = randomInt(100, config.height - 200);
        }
        
        // Respawn if off screen
        if (coin.x < -20) {
            coin.x = randomInt(config.width, config.width + 500);
            coin.y = randomInt(100, config.height - 200);
        }
    });
    
    // Update enemies
    gameElements.enemies.forEach((enemy, i) => {
        enemy.x -= enemy.speed;
        
        // Enemy collision
        if (gameElements.player.x < enemy.x + enemy.width &&
            gameElements.player.x + gameElements.player.width > enemy.x &&
            gameElements.player.y < enemy.y + enemy.height &&
            gameElements.player.y + gameElements.player.height > enemy.y) {
            
            gameElements.player.health -= 10;
            sounds.hit.play();
            createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#FF0000', 15);
            enemy.x = randomInt(config.width, config.width + 800);
            
            if (gameElements.player.health <= 0) {
                gameOver();
            }
        }
        
        // Respawn if off screen
        if (enemy.x < -50) {
            enemy.x = randomInt(config.width, config.width + 800);
        }
    });
    
    // Draw all elements
    drawPlayer();
    gameElements.coins.forEach(coin => drawCoin(coin.x, coin.y, coin.radius));
    gameElements.enemies.forEach(enemy => drawEnemy(enemy.x, enemy.y, enemy.width, enemy.height));
    drawParticles();
    
    // Update UI
    document.getElementById('score').textContent = gameElements.player.score;
    document.getElementById('health').style.width = `${gameElements.player.health}%`;
    
    // Spawn new objects
    if (Math.random() < 0.01) spawnCoin();
    if (Math.random() < 0.005) spawnEnemy();
    
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    alert(`Game Over! Your score: ${gameElements.player.score}`);
    document.location.reload();
}

// Start Game
for (let i = 0; i < 3; i++) spawnCoin();
for (let i = 0; i < 2; i++) spawnEnemy();
sounds.bgMusic.volume = 0.3;
sounds.bgMusic.play();
gameLoop();
``
