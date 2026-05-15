import { ROWS, COLS, MINES } from "./constants";

export function createCell() {
  return {
    isMine: false,
    revealed: false,
    flagged: false,
    neighborMines: 0,
  };
}

export function generateBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => createCell())
  );

  let mines = 0;
  while (mines < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      mines++;
    }
  }

  // Calculate neighbor mines for each cell
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col].isMine) continue;
      let count = 0;
      for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
        for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
          if (directionalRow === 0 && directionalCol === 0) continue;
          const neighbourRow = row + directionalRow;
          const neighbourCol = col + directionalCol;
          if (
            neighbourRow >= 0 &&
            neighbourRow < ROWS &&
            neighbourCol >= 0 &&
            neighbourCol < COLS
          ) {
            if (board[neighbourRow][neighbourCol].isMine) count++;
          }
        }
      }
      board[row][col].neighborMines = count;
    }
  }

  return board;
}

export function revealCellRecursive(newBoard, row, col) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
  const cell = newBoard[row][col];
  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;

  if (cell.isMine) {
    return;
  }

  // If empty cell (0 neighbors), auto-reveal all adjacent cells
  if (cell.neighborMines === 0) {
    for (
      let directionalRow = -1;
      directionalRow <= 1;
      directionalRow++
    ) {
      for (
        let directionalCol = -1;
        directionalCol <= 1;
        directionalCol++
      ) {
        if (directionalRow === 0 && directionalCol === 0) continue;
        revealCellRecursive(newBoard, row + directionalRow, col + directionalCol);
      }
    }
  }
}

export function checkWinCondition(board) {
  return board.every((row) =>
    row.every((cell) => {
      if (cell.isMine) return true; // Mines don't need to be revealed
      return cell.revealed; // All non-mine cells must be revealed
    })
  );
}

export function revealAllMines(board) {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  newBoard.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.revealed = true;
      }
    });
  });
  return newBoard;
}

export function countFlagsPlaced(board) {
  let count = 0;
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.flagged) count++;
    });
  });
  return count;
}
