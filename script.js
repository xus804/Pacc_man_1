const canvas = document.getElementById('pacmanCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const tileSize = 24; // Bigger tiles for mobile
let score = 0;

// 1: Wall, 0: Dot, 2: Empty
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize;

const pacman = {
    x: tileSize,
    y: tileSize,
    dir: {x: 0, y: 0},
    nextDir: {x: 0, y: 0},
    speed: 2,
    radius: 10
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Maze
    for(let r=0; r<map.length; r++) {
        for(let c=0; c<map[r].length; c++) {
            if(map[r][c] === 1) {
                ctx.fillStyle = '#1919a6';
                ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
            } else if(map[r][c] === 0) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(c*tileSize + tileSize/2, r*tileSize + tileSize/2, 2, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    // Move Logic
    // Only allow turning if we are centered in a tile
    if (pacman.x % tileSize === 0 && pacman.y % tileSize === 0) {
        const gridX = pacman.x / tileSize;
        const gridY = pacman.y / tileSize;

        // Check if we can turn in requested direction
        if (map[gridY + pacman.nextDir.y]?.[gridX + pacman.nextDir.x] !== 1) {
            pacman.dir = pacman.nextDir;
        }

        // Stop if hitting wall in current direction
        if (map[gridY + pacman.dir.y]?.[gridX + pacman.dir.x] === 1) {
            pacman.dir = {x: 0, y: 0};
        }

        // Eat dot
        if (map[gridY][gridX] === 0) {
            map[gridY][gridX] = 2;
            score += 10;
            scoreEl.innerText = score;
        }
    }

    pacman.x += pacman.dir.x * pacman.speed;
    pacman.y += pacman.dir.y * pacman.speed;

    // Draw Pac-Man
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + tileSize/2, pacman.y + tileSize/2, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + tileSize/2, pacman.y + tileSize/2);
    ctx.fill();

    requestAnimationFrame(draw);
}

// Controls
const control = (x, y) => { pacman.nextDir = {x, y}; };
document.getElementById('up').addEventListener('touchstart', (e) => { e.preventDefault(); control(0, -1); });
document.getElementById('down').addEventListener('touchstart', (e) => { e.preventDefault(); control(0, 1); });
document.getElementById('left').addEventListener('touchstart', (e) => { e.preventDefault(); control(-1, 0); });
document.getElementById('right').addEventListener('touchstart', (e) => { e.preventDefault(); control(1, 0); });

// Keyboard backup
window.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') control(0, -1);
    if(e.key === 'ArrowDown') control(0, 1);
    if(e.key === 'ArrowLeft') control(-1, 0);
    if(e.key === 'ArrowRight') control(1, 0);
});

draw();
