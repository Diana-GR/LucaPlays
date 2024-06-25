const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width > height ? height * 0.95 : width * 0.95;
canvas.height = canvas.width;

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width > height ? height * 0.95 : width * 0.95;
    canvas.height = canvas.width;
});

const gridSize = 25; // Tamaño de los pixeles de cada cuadro del laberinto
const tileCount = Math.floor(canvas.width / gridSize);

let pacMan = {
    x: 1,
    y: 1,
    dx: 0,
    dy: 0,
    size: gridSize / 2
};

let currentLevel = 1;
let mazeLevels = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
    ]
];

let currentMaze = mazeLevels[currentLevel - 1];

let lastRow = currentMaze.length - 1;
let lastCol = currentMaze[lastRow].length - 1;

let end = {
    x: lastCol - 1, // Coordenada X inicial específica del laberinto
    y: lastRow,     // Coordenada Y inicial específica del laberinto
    dx: 0,
    dy: 0,
    size: gridSize / 2
};
// Definir los SVGs en formato string
const pacManSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"/></svg>
`;

const endSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M153.7 144.8c6.9 16.3 20.6 31.2 38.3 31.2H384c17.7 0 31.4-14.9 38.3-31.2C434.4 116.1 462.9 96 496 96c44.2 0 80 35.8 80 80c0 30.4-17 56.9-42 70.4c-3.6 1.9-6 5.5-6 9.6s2.4 7.7 6 9.6c25 13.5 42 40 42 70.4c0 44.2-35.8 80-80 80c-33.1 0-61.6-20.1-73.7-48.8C415.4 350.9 401.7 336 384 336H192c-17.7 0-31.4 14.9-38.3 31.2C141.6 395.9 113.1 416 80 416c-44.2 0-80-35.8-80-80c0-30.4 17-56.9 42-70.4c3.6-1.9 6-5.5 6-9.6s-2.4-7.7-6-9.6C17 232.9 0 206.4 0 176c0-44.2 35.8-80 80-80c33.1 0 61.6 20.1 73.7 48.8z"/></svg>
`;

// Crear elementos HTML a partir de los SVGs
const pacManImage = new Image();
pacManImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pacManSVG)}`;

const endImage = new Image();
endImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(endSVG)}`;
function drawMaze() {
    for (let row = 0; row < currentMaze.length; row++) {
        for (let col = 0; col < currentMaze[row].length; col++) {
            if (currentMaze[row][col] === 1) {
                context.fillStyle = '#173217';
                context.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
}

function drawPacMan() {
    context.drawImage(pacManImage, pacMan.x * gridSize, pacMan.y * gridSize, gridSize, gridSize);
}

function drawEnd() {
    context.drawImage(endImage, end.x * gridSize, end.y * gridSize, gridSize, gridSize);
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
    if (pacMan.x === lastCol - 1 && pacMan.y === lastRow) {
        changeLevel();
    }
}

function changeLevel() {
    currentLevel++;
    if (currentLevel <= mazeLevels.length) {
        currentMaze = mazeLevels[currentLevel - 1];
        // Recalcular las últimas coordenadas del laberinto actual
        lastRow = currentMaze.length - 1;
        lastCol = currentMaze[lastRow].length - 1;
        switch (currentLevel) {
            case 1:
                pacManImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pacManSVG)}`;
                endImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(endSVG)}`;
                break;
            case 2:
                pacManImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pacManSVG)}`; // Cambiar a la imagen de Pac-Man del nivel 2
                endImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(endSVG)}`; // Cambiar a la imagen de fin del nivel 2
                break;
        }
        // Reiniciar las coordenadas de end.x y end.y para pacManImage
        pacMan.x = 1;
        pacMan.y = 1;
        end.x = lastCol - 1;
        end.y = lastRow;
    } else {
        // Mostrar mensaje de victoria
        alert('¡Felicidades! Has completado todos los niveles.');
        // Reiniciar el juego
        currentLevel = 1;
        currentMaze = mazeLevels[currentLevel - 1];
        pacManImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pacManSVG)}`;
        endImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(endSVG)}`;
        pacMan.x = 1;
        pacMan.y = 1;
        end.x = lastCol - 1;
        end.y = lastRow;
    }
}

function changeLevel2() {
    currentLevel++;
    if (currentLevel <= mazeLevels.length) {
        currentMaze = mazeLevels[currentLevel - 1];
    } else {
        // Reiniciar automáticamente el juego después de completar todos los niveles
        setTimeout(() => {
            currentLevel = 1;
            currentMaze = mazeLevels[currentLevel - 1];
        }, 5000);
    }
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacMan();
    drawEnd();
    requestAnimationFrame(update);
}

update();

// Event listener para capturar las teclas presionadas
document.addEventListener('keydown', movePacMan);

