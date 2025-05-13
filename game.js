const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const player = {
  x: 50,
  y: 400,
  width: 30,
  height: 30,
  color: 'cyan',
  velocityY: 0,
  gravity: 0.5,
  jumpPower: -10,
  isJumping: false
};

const groundY = canvas.height - 50;
let isLeftPressed = false;
let isRightPressed = false;

document.querySelector('.btn-left').addEventListener('mousedown', () => isLeftPressed = true);
document.querySelector('.btn-left').addEventListener('mouseup', () => isLeftPressed = false);
document.querySelector('.btn-right').addEventListener('mousedown', () => isRightPressed = true);
document.querySelector('.btn-right').addEventListener('mouseup', () => isRightPressed = false);
document.querySelector('.btn-jump').addEventListener('click', () => {
  if (!player.isJumping) {
    player.velocityY = player.jumpPower;
    player.isJumping = true;
  }
});

function update() {
  player.y += player.velocityY;
  player.velocityY += player.gravity;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  if (isLeftPressed) player.x -= 3;
  if (isRightPressed) player.x += 3;

  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = '#0f0';
  ctx.fillRect(0, groundY, canvas.width, 50);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
