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
const game = {
    player: {
        x: 100,
        y: 0,
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
    particles: [],
    keys: {},
    lastTime: 0,
    gameOver: false
};

// Initialize Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = config.width;
canvas.height = config.height;

// Mobile Controls
document.querySelector('.btn-left').addEventListener('touchstart', () => game.keys['ArrowLeft'] = true);
document.querySelector('.btn-left').addEventListener('touchend', () => game.keys['ArrowLeft'] = false);
document.querySelector('.btn-right').addEventListener('touchstart', () => game.keys['ArrowRight'] = true);
document.querySelector('.btn-right').addEventListener('touchend', () => game.keys['ArrowRight'] = false);
document.querySelector('.btn-jump').addEventListener('touchstart', jump);

// Keyboard Controls
window.addEventListener('keydown', (e) => game.keys[e.key] = true);
window.addEventListener('keyup', (e) => game.keys[e.key] = false);

// Game Functions
function jump() {
    if (!game.player.isJumping) {
        game.player.velY = -config.jumpPower;
        game.player.isJumping = true;
    }
}

function spawnCoin() {
    game.coins.push({
        x: config.width,
        y: randomInt(100, config.height - 200),
        radius: 15,
        color: '#FFD700',
        speed: randomInt(3, 6)
    });
}

function spawnEnemy() {
    game.enemies.push({
        x: config.width,
        y: config.height - 150,
        width: 50,
        height: 80,
        color: '#FF4500',
        speed: randomInt(4, 7)
    });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Game Loop
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - game.lastTime;
    game.lastTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, config.height - config.groundHeight, config.width, config.groundHeight);
    
    // Player movement
    if (game.keys['ArrowLeft']) {
        game.player.x = Math.max(0, game.player.x - config.playerSpeed);
    }
    if (game.keys['ArrowRight']) {
        game.player.x = Math.min(config.width - game.player.width, game.player.x + config.playerSpeed);
    }
    
    // Apply gravity
    game.player.velY += config.gravity;
    game.player.y += game.player.velY;
    
    // Ground collision
    if (game.player.y >= config.height - config.groundHeight - game.player.height) {
        game.player.y = config.height - config.groundHeight - game.player.height;
        game.player.isJumping = false;
    }
    
    // Spawn objects
    if (Math.random() < 0.01) spawnCoin();
    if (Math.random() < 0.005) spawnEnemy();
    
    // Update and draw coins
    game.coins.forEach((coin, index) => {
        coin.x -= coin.speed;
        
        // Check collision
        if (Math.abs(game.player.x + game.player.width/2 - coin.x) < 30 && 
            Math.abs(game.player.y + game.player.height/2 - coin.y) < 30) {
            game.player.score += 10;
            game.coins.splice(index, 1);
        }
        
        // Draw coin
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = coin.color;
        ctx.fill();
    });
    
    // Update and draw enemies
    game.enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        
        // Check collision
        if (!game.player.invincible && 
            game.player.x < enemy.x + enemy.width &&
            game.player.x + game.player.width > enemy.x &&
            game.player.y < enemy.y + enemy.height &&
            game.player.y + game.player.height > enemy.y) {
            game.player.health -= 10;
            if (game.player.health <= 0) {
                gameOver();
            }
        }
        
        // Draw enemy
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw player
    ctx.fillStyle = game.player.color;
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    
    // Update UI
    document.getElementById('score').textContent = game.player.score;
    document.getElementById('health').style.width = `${game.player.health}%`;
    
    if (!game.gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    game.gameOver = true;
    alert(`Game Over! Your score: ${game.player.score}`);
}

// Start game
game.player.y = config.height - config.groundHeight - game.player.height;
spawnCoin();
spawnEnemy();
requestAnimationFrame(gameLoop);
