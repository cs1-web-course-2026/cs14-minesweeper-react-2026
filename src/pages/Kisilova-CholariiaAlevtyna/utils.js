export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  WIN: 'win',
  LOSE: 'lose',
};

export const createBoard = (rows, cols, totalMines) => {
  let newGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      state: CELL_STATE.CLOSED,
      neighborCount: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < totalMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newGrid[r][c].isMine) {
      newGrid[r][c].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].isMine) {
        let mines = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
              if (newGrid[r + i][c + j].isMine) mines++;
            }
          }
        }
        newGrid[r][c].neighborCount = mines;
      }
    }
  }
  return newGrid;
};