const CellType = { EMPTY: 'empty', MINE: 'mine' };
const CellState = { CLOSED: 'closed', OPENED: 'opened', FLAGGED: 'flagged' };
const GameStatus = { PROCESS: 'process', WIN: 'win', LOSE: 'lose' };

const neighbourDirections = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function createCell() {
  return { type: CellType.EMPTY, state: CellState.CLOSED, neighborMines: 0 };
}

function isInsideField(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function cloneField(field) {
  return field.map((row) => row.map((cell) => ({ ...cell })));
}

function countNeighbourMines(field, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type !== CellType.EMPTY) continue;
      let count = 0;
      for (const [directionalRow, directionalCol] of neighbourDirections) {
        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;
        if (isInsideField(neighbourRow, neighbourCol, rows, cols) && field[neighbourRow][neighbourCol].type === CellType.MINE) {
          count++;
        }
      }
      field[row][col].neighborMines = count;
    }
  }
}

function generateField(rows, cols, minesCount) {
  const field = Array.from({ length: rows }, () => Array.from({ length: cols }, () => createCell()));

  let placedMines = 0;
  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (field[row][col].type === CellType.EMPTY) {
      field[row][col].type = CellType.MINE;
      placedMines++;
    }
  }

  countNeighbourMines(field, rows, cols);
  return field;
}

function getFlagCount(field) {
  return field.flat().filter((c) => c.state === CellState.FLAGGED).length;
}

function revealAllMines(field) {
  for (const row of field) {
    for (const cell of row) {
      if (cell.type === CellType.MINE) cell.state = CellState.OPENED;
    }
  }
}

function openRecursive(field, startRow, startCol, rows, cols) {
  const stack = [[startRow, startCol]];

  while (stack.length) {
    const [row, col] = stack.pop();
    if (!isInsideField(row, col, rows, cols)) continue;

    const cell = field[row][col];
    if (cell.state !== CellState.CLOSED) continue;
    if (cell.type === CellType.MINE) continue;

    cell.state = CellState.OPENED;

    if (cell.neighborMines === 0) {
      for (const [directionalRow, directionalCol] of neighbourDirections) {
        stack.push([row + directionalRow, col + directionalCol]);
      }
    }
  }
}

function checkWinCondition(field, rows, cols, minesCount) {
  const totalCells = rows * cols;
  const openedCount = field.flat().filter((c) => c.state === CellState.OPENED).length;
  return openedCount === totalCells - minesCount;
}

export function createNewGame({ rows, cols, minesCount }) {
  return {
    rows,
    cols,
    minesCount,
    status: GameStatus.PROCESS,
    gameTime: 0,
    field: generateField(rows, cols, minesCount),
  };
}

export function toggleFlag(state, row, col) {
  if (state.status !== GameStatus.PROCESS) return state;

  const field = cloneField(state.field);
  const cell = field[row][col];
  if (!cell || cell.state === CellState.OPENED) return state;

  if (cell.state === CellState.CLOSED) {
    if (getFlagCount(field) < state.minesCount) {
      cell.state = CellState.FLAGGED;
    }
  } else {
    cell.state = CellState.CLOSED;
  }

  return { ...state, field };
}

export function openCell(state, row, col) {
  if (state.status !== GameStatus.PROCESS) return state;

  const field = cloneField(state.field);
  const cell = field[row][col];
  if (!cell || cell.state !== CellState.CLOSED) return state;

  if (cell.type === CellType.MINE) {
    cell.state = CellState.OPENED;
    revealAllMines(field);
    return { ...state, field, status: GameStatus.LOSE };
  }

  openRecursive(field, row, col, state.rows, state.cols);

  const isWin = checkWinCondition(field, state.rows, state.cols, state.minesCount);
  return { ...state, field, status: isWin ? GameStatus.WIN : state.status };
}

export function tick(state) {
  if (state.status !== GameStatus.PROCESS) return state;
  return { ...state, gameTime: state.gameTime + 1 };
}

export function getHeaderView(state) {
  const flags = getFlagCount(state.field);
  return {
    flagsRemaining: state.minesCount - flags,
    isWin: state.status === GameStatus.WIN,
    isLose: state.status === GameStatus.LOSE,
  };
}

export { CellType, CellState, GameStatus };
