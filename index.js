const gridContainer = document.querySelector('.grid-container');

const gridSize = 5;

const containerPadding = 16;
const maxAvailableWidth = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.6, 600) - containerPadding;
const gapSize = Math.max(1, Math.min(4, maxAvailableWidth / (gridSize * 8)));
const totalGapWidth = gapSize * (gridSize - 1);
const cellSize = (maxAvailableWidth - totalGapWidth) / gridSize;
const fontSize = Math.max(8, cellSize * 0.3);

// making the grid loop
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.id = `cell-${row}-${col}`;
        cell.className = 'grid-cell';
        cell.textContent = "";
        gridContainer.appendChild(cell);
    }
}
gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
gridContainer.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
gridContainer.style.gap = `${gapSize}px`;

const cells = document.querySelectorAll('.grid-cell');
cells.forEach(cell => {
    cell.style.fontSize = `${fontSize}px`;
});

// choosing the styles for all the values
const valueStyles = {
    1: { backgroundColor: '#eee4da', color: '#776e65' },
    2: { backgroundColor: '#ede0c8', color: '#776e65' },
    4: { backgroundColor: '#f2b179', color: '#f9f6f2' },
    8: { backgroundColor: '#f59563', color: '#f9f6f2' },
    16: { backgroundColor: '#f67c5f', color: '#f9f6f2' },
    32: { backgroundColor: '#f65e3b', color: '#f9f6f2' },
    64: { backgroundColor: '#edcf72', color: '#f9f6f2' },
    128: { backgroundColor: '#edcc61', color: '#f9f6f2' },
    256: { backgroundColor: '#edc850', color: '#f9f6f2' },
    512: { backgroundColor: '#edc53f', color: '#f9f6f2' },
    1024: { backgroundColor: '#edc22e', color: '#f9f6f2' },
    2048: { backgroundColor: '#edc22e', color: '#f9f6f2' },
    4096: { backgroundColor: '#60495a', color: '#f9f6f2' },
    8192: { backgroundColor: '#5a4249', color: '#f9f6f2' },
    16384: { backgroundColor: '#4e3a40', color: '#f9f6f2' },
    32768: { backgroundColor: '#3d2d34', color: '#f9f6f2' },
    other: { backgroundColor: '#3c3a32', color: '#f9f6f2' }
};

function getEmptyCells() {
    const cells = document.querySelectorAll('.grid-cell');
    return Array.from(cells).filter(cell => cell.textContent === "");
}

function applyCellStyle(cell, value) {
    const style = valueStyles[value] || valueStyles.other;
    if (style) {
        cell.style.backgroundColor = style.backgroundColor;
        cell.style.color = style.color;
    }
}

function spawnRandomBlock() {
    const emptyCells = getEmptyCells();
    
    if (emptyCells.length === 0) {
        // if theres no empty cells
        return; 
    }
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.5 ? 2 : 4;
    randomCell.textContent = randomValue;
    
    applyCellStyle(randomCell, randomValue);
}

function spawnInitialBlocks() {
    const numberOfBlocks = Math.random() < 0.5 ? 1 : 2;
    
    for (let i = 0; i < numberOfBlocks; i++) {
        spawnRandomBlock();
    }
}

spawnInitialBlocks();

// test function to summon tiles
function fillAllTilesWithValues() {
    const allCells = document.querySelectorAll('.grid-cell');
    
    allCells.forEach((cell, index) => {
        const value = Math.pow(2, index);
        cell.textContent = value;
        applyCellStyle(cell, value);
    });
}

// fillAllTilesWithValues(); // for testing, you can un comment this if you want

// get the board current state
function getBoardState() {
    const cells = document.querySelectorAll('.grid-cell');
    const boardState = [];
    cells.forEach(cell => {
        const value = parseInt(cell.textContent) || 0;
        const rowCol = cell.id.split('-').slice(1).map(Number);
        if (!boardState[rowCol[0]]) {
            boardState[rowCol[0]] = [];
        }
        boardState[rowCol[0]][rowCol[1]] = value;
    });
    return boardState;
}

// handles the input
function handleInput(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault();
        console.log(`Input received: ${key}`);
    }
}

// the phone touching inmplementation
let startX, startY;

document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
    if (!startX || !startY) return;
    
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    
    let diffX = startX - endX;
    let diffY = startY - endY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            handleInput({key: 'ArrowLeft', preventDefault: () => {}});
        } else {
            handleInput({key: 'ArrowRight', preventDefault: () => {}});
        }
    } else {
        if (diffY > 0) {
            handleInput({key: 'ArrowUp', preventDefault: () => {}});
        } else {
            handleInput({key: 'ArrowDown', preventDefault: () => {}});
        }
    }
    startX = startY = null;
});

// check the input
document.addEventListener('keydown', handleInput);