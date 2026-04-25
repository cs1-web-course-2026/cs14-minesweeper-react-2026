import { CELL_STATE, CELL_CONTENT, GAME_STATUS } from "./constants";

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
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].content !== CELL_CONTENT.MINE) {
      board[r][c].content = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].content === CELL_CONTENT.MINE) continue;
      let count = 0;
      for (let [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].content === CELL_CONTENT.MINE) {
          count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
  return board;
}