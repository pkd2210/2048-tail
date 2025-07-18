const gridContainer = document.querySelector('.grid-container');

const spawnChance = 0.9; // this if the chance that a 2 will spawn instted of a 4 (0.9 = 90% for spawning a 2 tile, and a 10% to spawn a four)
const deafaulyColSize = 3;
const defaultRowSize = 3;

let tilesAdded = false;
let points = parseInt(document.cookie.split("points=")[1]?.split(";")[0]) || 0; // should remain 0 cause this is the points of the game (i gurss you can change it if you want)

let biggetTile = parseInt(document.cookie.split("biggetTile=")[1]?.split(";")[0]) || 0;

let colSize = parseInt(document.cookie.split("colSize=")[1]?.split(";")[0]) || deafaulyColSize;
let rowSize = parseInt(document.cookie.split("rowSize=")[1]?.split(";")[0]) || defaultRowSize;

const padding = 16; // add padding, so that small screens will fit the grid better
const maxAvailableWidth = Math.min(window.innerWidth * 0.9, 600) - padding;
const maxAvailableHeight = Math.min(window.innerHeight * 0.6, 600) - padding;

const gapSize = Math.max(1, Math.min(4, Math.min(maxAvailableWidth / (colSize * 8), maxAvailableHeight / (rowSize * 8))));
const totalGapWidth = gapSize * (colSize - 1);
const totalGapHeight = gapSize * (rowSize - 1);

const cellSize = Math.min(
    (maxAvailableWidth - totalGapWidth) / colSize,
    (maxAvailableHeight - totalGapHeight) / rowSize
);

const fontSize = Math.max(8, cellSize * 0.3);

// making the grid loop
for (let row = 0; row < rowSize; row++) {
    for (let col = 0; col < colSize; col++) {
        const cell = document.createElement('div');
        cell.id = `cell-${row}-${col}`;
        cell.className = 'grid-cell';
        cell.textContent = "";
        gridContainer.appendChild(cell);
    }
}
gridContainer.style.gridTemplateColumns = `repeat(${colSize}, ${cellSize}px)`;
gridContainer.style.gridTemplateRows = `repeat(${rowSize}, ${cellSize}px)`;
gridContainer.style.gap = `${gapSize}px`;

const cells = document.querySelectorAll('.grid-cell');
cells.forEach(cell => {
    cell.style.fontSize = `${fontSize}px`;
});

// choosing the styles for all the values
const valueStyles = {
    0: { backgroundColor: '#cdc1b4', color: '#776e65' },
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

function restartGame() {
    document.cookie = `boardStat=; path=/; max-age=0`;
    document.cookie = `colSize=; path=/; max-age=0`;
    document.cookie = `rowSize=; path=/; max-age=0`;
    document.cookie = `points=; path=/; max-age=0`;
    document.cookie = `biggetTile=; path=/; max-age=0`;
    location.reload();
}
function saveGame() {
    const finalState = getBoardState();
    document.cookie = `boardStat=${JSON.stringify(finalState)}; path=/; max-age=1000000000`;
    document.cookie = `colSize=${colSize}; path=/; max-age=1000000000`
    document.cookie = `rowSize=${rowSize}; path=/; max-age=1000000000`
}
function gotUniqueNumber() {
    let boardState = getBoardState();
    let newBoardState;
    if (rowSize <= colSize) {
        rowSize++;
        newBoardState = [Array(colSize).fill(0), ...boardState];
        document.cookie = `boardStat=${JSON.stringify(newBoardState)}; path=/; max-age=1000000000`;
        document.cookie = `rowSize=${rowSize}; path=/; max-age=1000000000`;
        document.cookie = `colSize=${colSize}; path=/; max-age=1000000000`;
    } else {
        colSize++;
        newBoardState = boardState.map(row => [0, ...row]);
        document.cookie = `boardStat=${JSON.stringify(newBoardState)}; path=/; max-age=1000000000`;
        document.cookie = `colSize=${colSize}; path=/; max-age=1000000000`;
        document.cookie = `rowSize=${rowSize}; path=/; max-age=1000000000`;
    }
    location.reload();
}
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
    updateBiggestTile();
    const emptyCells = getEmptyCells();
    
    if (emptyCells.length === 0) {
        return; 
    }
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < spawnChance ? 2 : 4;
    randomCell.textContent = randomValue;
    
    applyCellStyle(randomCell, randomValue);
}


function spawnInitialBlocks() {
    const numberOfBlocks = Math.random() < spawnChance ? 1 : 2;
    
    for (let i = 0; i < numberOfBlocks; i++) {
        spawnRandomBlock();
    }
}

if (document.cookie.includes("boardStat")) {
    const cookieValue = document.cookie.split("boardStat=")[1].split(";")[0];
    const boardState = JSON.parse(cookieValue);
    cells.forEach((cell, index) => {
        const row = Math.floor(index / colSize);
        const col = index % colSize;
        const value = boardState[row] && boardState[row][col] !== undefined ? boardState[row][col] : 0;
        cell.textContent = value === 0 ? "" : value;
        applyCellStyle(cell, value);
    });
}
else {
    spawnInitialBlocks();
}

// test function to summon tiles
function fillAllTilesWithValues() {
    const allCells = document.querySelectorAll('.grid-cell');
    
    allCells.forEach((cell, index) => {
        const value = Math.pow(2, index);
        cell.textContent = value;
        applyCellStyle(cell, value);
    });
}

 //fillAllTilesWithValues(); // for testing, you can un comment this if you want

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

function updateRowColText() {
    document.getElementById('rowColText').textContent = `Rows: ${rowSize}, Columns: ${colSize}`;
}

function updatePoints() {
    document.getElementById('points').textContent = 'Points: ' + points;
    document.cookie = `points=${points}; path=/; max-age=1000000000`;
    document.getElementById('biggetTile').textContent = 'Biggest Tile: ' + biggetTile;
    document.cookie = `biggetTile=${biggetTile}; path=/; max-age=1000000000`;
    updateHighscore();
}


function updateHighscore() {
    const highScore = parseInt(document.cookie.split("highScore=")[1]?.split(";")[0]) || 0;
    if (points >= highScore) {
        document.cookie = `highScore=${points}; path=/; max-age=1000000000`;
        document.getElementById('highscore').textContent = 'High Score: ' + points;
    } else {
        document.getElementById('highscore').textContent = 'High Score: ' + highScore;
    }
}

function merge(array) {
    let newPoints = 0;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === array[i + 1]) {
            array[i] *= 2;
            array[i + 1] = 0;
            newPoints += array[i];
        }
    }
    points += newPoints;
    updatePoints();
    updateRowColText();

    return array.filter(val => val !== 0);
}

function updateBiggestTile() {
    const allCells = document.querySelectorAll('.grid-cell');
    const tempBiggetTile = Math.max(...Array.from(allCells).map(cell => parseInt(cell.textContent) || 0));
    if (tempBiggetTile > biggetTile) {
        biggetTile = tempBiggetTile;
        document.cookie = `biggetTile=${biggetTile}; path=/; max-age=1000000000`;
        const biggetTileElem = document.getElementById('biggetTile');
        if (biggetTileElem) {
            biggetTileElem.textContent = 'Biggest Tile: ' + biggetTile;
        }
        if (tilesAdded == false) { // changed it that it will only spawn a nre tile every 2 unique number (was too op)
            tilesAdded = true;
        } else {
            tilesAdded = false;
            gotUniqueNumber();
        }
    } else {
        const biggetTileElem = document.getElementById('biggetTile');
        if (biggetTileElem) {
            biggetTileElem.textContent = 'Biggest Tile: ' + biggetTile;
        }
    }
}

function moveUp() {
    const boardState = getBoardState();
    const newState = JSON.parse(JSON.stringify(boardState));
    let moved = false;
    
    for (let col = 0; col < colSize; col++) {
        let column = [];
        for (let row = 0; row < rowSize; row++) {
            if (boardState[row][col] !== 0) {
                column.push(boardState[row][col]);
            }
        }
        
        column = merge(column);
        
        for (let row = 0; row < rowSize; row++) {
            const newValue = column[row] || 0;
            newState[row][col] = newValue;
            if (newValue !== boardState[row][col]) {
                moved = true;
            }
        }
    }
    
    if (moved) {
        cells.forEach((cell, index) => {
            const row = Math.floor(index / colSize);
            const col = index % colSize;
            const value = newState[row][col];
            cell.textContent = value || "";
            applyCellStyle(cell, value);
        });        
        spawnRandomBlock();
        saveGame();
    }
}

function moveDown() {
    const boardState = getBoardState();
    const newState = JSON.parse(JSON.stringify(boardState));
    let moved = false;
    
    for (let col = 0; col < colSize; col++) {
        let column = [];
        for (let row = rowSize - 1; row >= 0; row--) {
            if (boardState[row][col] !== 0) {
                column.push(boardState[row][col]);
            }
        }
        
        column = merge(column);

        for (let row = 0; row < rowSize; row++) {
            const newValue = column[row] || 0;
            newState[rowSize - 1 - row][col] = newValue;
            if (newValue !== boardState[rowSize - 1 - row][col]) {
                moved = true;
            }
        }
    }
    
    if (moved) {
        cells.forEach((cell, index) => {
            const row = Math.floor(index / colSize);
            const col = index % colSize;
            const value = newState[row][col];
            cell.textContent = value || "";
            applyCellStyle(cell, value);
        });
        spawnRandomBlock();
        saveGame();
    }
}
// move the tiles to each side, (its calculate the new board and then place it)
function moveLeft() {
    const boardState = getBoardState();
    const newState = JSON.parse(JSON.stringify(boardState));
    let moved = false;
    
    for (let row = 0; row < rowSize; row++) {
        let rows = [];
        for (let col = 0; col < colSize; col++) {
            if (boardState[row][col] !== 0) {
                rows.push(boardState[row][col]);
            }
        }
        
        rows = merge(rows);

        for (let col = 0; col < colSize; col++) {
            const newValue = rows[col] || 0;
            newState[row][col] = newValue;
            if (newValue !== boardState[row][col]) {
                moved = true;
            }
        }
    }
    
    if (moved) {
        cells.forEach((cell, index) => {
            const row = Math.floor(index / colSize);
            const col = index % colSize;
            const value = newState[row][col];
            cell.textContent = value || "";
            applyCellStyle(cell, value);
        });
        spawnRandomBlock();
        saveGame();
    }
}

function moveRight() {
    const boardState = getBoardState();
    const newState = JSON.parse(JSON.stringify(boardState));
    let moved = false;
    
    for (let row = 0; row < rowSize; row++) {
        let rows = [];
        for (let col = colSize - 1; col >= 0; col--) {
            if (boardState[row][col] !== 0) {
                rows.push(boardState[row][col]);
            }
        }
        
        rows = merge(rows);

        for (let col = 0; col < colSize; col++) {
            const newValue = rows[col] || 0;
            newState[row][colSize - 1 - col] = newValue;
            if (newValue !== boardState[row][colSize - 1 - col]) {
                moved = true;
            }
        }
    }
    
    if (moved) {
        cells.forEach((cell, index) => {
            const row = Math.floor(index / colSize);
            const col = index % colSize;
            const value = newState[row][col];
            cell.textContent = value || "";
            applyCellStyle(cell, value);
        });
        spawnRandomBlock();
        saveGame();
    }
}

function handleInput(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault();
        console.log(`Input received: ${key}`);
        if (key === 'ArrowUp') {
            moveUp();
        }
        if (key === 'ArrowDown') {
            moveDown();
        }
        if (key === 'ArrowLeft') {
            moveLeft();
        }
        if (key === 'ArrowRight') {
            moveRight();
        }
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
window.addEventListener('touchmove', function(e) { // disable the pull to refresh shit in phone browsers
    if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('keydown', handleInput);
updatePoints();
