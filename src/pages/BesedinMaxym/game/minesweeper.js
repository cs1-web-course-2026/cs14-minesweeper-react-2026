export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose',
};

export const GAME_CONFIG = {
  rows: 9,
  cols: 9,
  minesCount: 10,
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const isInside = (state, row, col) => (
  row >= 0 && row < state.rows && col >= 0 && col < state.cols
);

const cloneState = (state) => ({
  ...state,
  grid: state.grid.map((row) => row.map((cell) => ({ ...cell }))),
});

export function generateField(rows = GAME_CONFIG.rows, cols = GAME_CONFIG.cols, minesCount = GAME_CONFIG.minesCount) {
  if (minesCount >= rows * cols) {
    throw new Error('minesCount must be lower than rows * cols');
  }

  const state = {
    rows,
    cols,
    minesCount,
    status: GAME_STATUS.PROCESS,
    grid: Array.from({ length: rows }, () => (
      Array.from({ length: cols }, () => ({
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
        isHit: false,
      }))
    )),
  };

  let placedMines = 0;
  while (placedMines < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (state.grid[randomRow][randomCol].type === CELL_TYPE.MINE) {
      continue;
    }

    state.grid[randomRow][randomCol].type = CELL_TYPE.MINE;
    placedMines += 1;
  }

  return countNeighbourMines(state);
}

export function countNeighbourMines(state) {
  const nextState = cloneState(state);

  for (let row = 0; row < nextState.rows; row += 1) {
    for (let col = 0; col < nextState.cols; col += 1) {
      const cell = nextState.grid[row][col];
      if (cell.type === CELL_TYPE.MINE) {
        continue;
      }

      cell.neighborMines = DIRECTIONS.reduce((count, [dRow, dCol]) => {
        const nextRow = row + dRow;
        const nextCol = col + dCol;
        return isInside(nextState, nextRow, nextCol)
          && nextState.grid[nextRow][nextCol].type === CELL_TYPE.MINE
          ? count + 1
          : count;
      }, 0);
    }
  }

  return nextState;
}

export function openCell(state, row, col) {
  if (!isInside(state, row, col) || state.status !== GAME_STATUS.PROCESS) {
    return state;
  }

  const nextState = cloneState(state);
  const queue = [[row, col]];

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();
    if (!isInside(nextState, currentRow, currentCol)) {
      continue;
    }

    const cell = nextState.grid[currentRow][currentCol];
    if (cell.state !== CELL_STATE.CLOSED) {
      continue;
    }

    cell.state = CELL_STATE.OPENED;

    if (cell.type === CELL_TYPE.MINE) {
      cell.isHit = true;
      nextState.status = GAME_STATUS.LOSE;
      return revealAllMines(nextState);
    }

    if (cell.neighborMines === 0) {
      DIRECTIONS.forEach(([dRow, dCol]) => {
        queue.push([currentRow + dRow, currentCol + dCol]);
      });
    }
  }

  return checkWinCondition(nextState);
}

export function toggleFlag(state, row, col) {
  if (!isInside(state, row, col) || state.status !== GAME_STATUS.PROCESS) {
    return state;
  }

  const nextState = cloneState(state);
  const cell = nextState.grid[row][col];

  if (cell.state === CELL_STATE.CLOSED) {
    cell.state = CELL_STATE.FLAGGED;
  } else if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.CLOSED;
  }

  return nextState;
}

export function checkWinCondition(state) {
  const hasClosedSafeCell = state.grid.some((row) => (
    row.some((cell) => cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED)
  ));

  return hasClosedSafeCell ? state : { ...state, status: GAME_STATUS.WIN };
}

export function revealAllMines(state) {
  const nextState = cloneState(state);

  nextState.grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.type === CELL_TYPE.MINE) {
        cell.state = CELL_STATE.OPENED;
      }
    });
  });

  return nextState;
}

export function countFlags(state) {
  return state.grid.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length;
}
