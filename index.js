const gridContainer = document.querySelector('.grid-container');

const gridSize = 25;

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