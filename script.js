const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width > height ? height * 0.8 : width * 0.8;
canvas.height = canvas.width;

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width > height ? height * 0.8 : width * 0.8;
    canvas.height = canvas.width;
});

const gridSize = 20;
const tileCount = Math.floor(canvas.width / gridSize);

let pacMan = {
    x: 1,  // Coordenada X inicial específica del laberinto
    y: 1,  // Coordenada Y inicial específica del laberinto
    dx: 0,
    dy: 0,
    size: gridSize / 2
};

let currentLevel = 1;
let mazeLevels = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

let currentMaze = mazeLevels[currentLevel - 1];

function drawMaze() {
    for (let row = 0; row < currentMaze.length; row++) {
        for (let col = 0; col < currentMaze[row].length; col++) {
            if (currentMaze[row][col] === 1) {
                context.fillStyle = 'blue';
                context.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
}

function drawPacMan() {
    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(pacMan.x * gridSize + gridSize / 2, pacMan.y * gridSize + gridSize / 2, pacMan.size, 0.2 * Math.PI, 1.8 * Math.PI);
    context.lineTo(pacMan.x * gridSize + gridSize / 2, pacMan.y * gridSize + gridSize / 2);
    context.fill();
}

function movePacMan(event) {
    switch(event.key) {
        case 'ArrowUp':
            pacMan.dx = 0;
            pacMan.dy = -1;
            break;
        case 'ArrowDown':
            pacMan.dx = 0;
            pacMan.dy = 1;
            break;
        case 'ArrowLeft':
            pacMan.dx = -1;
            pacMan.dy = 0;
            break;
        case 'ArrowRight':
            pacMan.dx = 1;
            pacMan.dy = 0;
            break;
    }
    updatePacManPosition();
}

function updatePacManPosition() {
    const nextX = pacMan.x + pacMan.dx;
    const nextY = pacMan.y + pacMan.dy;

    // Comprueba si la siguiente posición es una pared
    if (currentMaze[nextY][nextX] !== 1) {
        pacMan.x = nextX;
        pacMan.y = nextY;
    }

    // Detecta el cambio de nivel (llegando a una posición específica)
    if (pacMan.x === 10 && pacMan.y === 1) { // Ejemplo: posición específica para cambio de nivel
        changeLevel();
    }
}
function changeLevel() {
    currentLevel++;
    if (currentLevel <= mazeLevels.length) {
        currentMaze = mazeLevels[currentLevel - 1];
        // Aquí podrías hacer otros ajustes relacionados con el cambio de nivel
    } else {
        // Mostrar mensaje de victoria
        alert('¡Felicidades! Has completado todos los niveles.');
        // Reiniciar el juego
        currentLevel = 1;
        currentMaze = mazeLevels[currentLevel - 1];
        // Otros ajustes iniciales del juego si es necesario
    }
}
/////////////////// REINICIA EL JUEGO DESPUES DE UNOS SEGUNDOS
function changeLevel2() {
    currentLevel++;
    if (currentLevel <= mazeLevels.length) {
        currentMaze = mazeLevels[currentLevel - 1];
        // Aquí podrías hacer otros ajustes relacionados con el cambio de nivel
    } else {
        // Reiniciar automáticamente el juego después de completar todos los niveles
        setTimeout(() => {
            currentLevel = 1;
            currentMaze = mazeLevels[currentLevel - 1];
            // Otros ajustes iniciales del juego si es necesario
        }, 3000); // Espera 3 segundos antes de reiniciar (ajustable según necesidades)
    }
}


function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacMan();
    requestAnimationFrame(update);
}

update();

// Event listener para capturar las teclas presionadas
document.addEventListener('keydown', movePacMan);
