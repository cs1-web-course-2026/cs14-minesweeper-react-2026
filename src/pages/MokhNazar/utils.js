import { CELL_STATE, CELL_CONTENT } from "./constants"; //

export function createBoard(rows, cols, minesCount) {
  let board = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      state: CELL_STATE.CLOSED,
      content: CELL_CONTENT.EMPTY,
      adjacentMines: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows); //[cite: 2]
    const col = Math.floor(Math.random() * cols); //[cite: 2]
    if (board[row][col].content !== CELL_CONTENT.MINE) {
      board[row][col].content = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let row = 0; row < rows; row++) { //[cite: 2]
    for (let col = 0; col < cols; col++) { //[cite: 2]
      if (board[row][col].content === CELL_CONTENT.MINE) continue;

      let count = 0;
      for (const [directionalRow, directionalCol] of directions) { //[cite: 2]
        const neighbourRow = row + directionalRow; //[cite: 2]
        const neighbourCol = col + directionalCol; //[cite: 2]

        if (
          neighbourRow >= 0 &&
          neighbourRow < rows &&
          neighbourCol >= 0 &&
          neighbourCol < cols &&
          board[neighbourRow][neighbourCol].content === CELL_CONTENT.MINE
        ) {
          count++;
        }
      }
      board[row][col].adjacentMines = count;
    }
  }
  return board;
}

// Додана чиста функція для рекурсивного відкриття клітинок (flood-fill)
export function revealCells(board, startRow, startCol, rows, cols) {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  function floodFill(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    const cell = newBoard[row][col];
    
    if (cell.state !== CELL_STATE.CLOSED || cell.content === CELL_CONTENT.MINE) return;

    cell.state = CELL_STATE.OPEN;

    if (cell.adjacentMines === 0) {
      for (const [directionalRow, directionalCol] of directions) {
        floodFill(row + directionalRow, col + directionalCol);
      }
    }
  }

  floodFill(startRow, startCol);
  return newBoard;
}