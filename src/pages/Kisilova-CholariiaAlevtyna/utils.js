export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
  MINE: 'mine'
};

export const GAME_STATUS = {
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose'
};

export const createBoard = (rows, cols, mines) => {
  let board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        isMine: false,
        neighborCount: 0,
        state: CELL_STATE.CLOSED, 
      });
    }
    board.push(row);
  }

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
            if (board[r + i][c + j].isMine) count++;
          }
        }
      }
      board[r][c].neighborCount = count;
    }
  }
  return board;
};