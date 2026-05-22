export const DEFAULT_ROWS = 8;
export const DEFAULT_COLS = 8;
export const DEFAULT_MINES = 10;

const DIRECTIONS = [-1, 0, 1];

function createCell() {
  return {
    type: 'empty',
    state: 'closed',
    neighborMines: 0,
  };
}

export function cloneField(field) {
  return field.map((row) => row.map((cell) => ({ ...cell })));
}

export function initializeField(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => createCell()));
}

export function generateField(rows, cols, minesCount) {
  const field = initializeField(rows, cols);
  let placedMines = 0;

  while (placedMines < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (field[randomRow][randomCol].type !== 'mine') {
      field[randomRow][randomCol].type = 'mine';
      placedMines += 1;
    }
  }

  calculateAllNeighbourMines(field);
  return field;
}

export function countNeighbourMines(row, col, field) {
  let count = 0;

  for (const deltaRow of DIRECTIONS) {
    for (const deltaCol of DIRECTIONS) {
      if (deltaRow === 0 && deltaCol === 0) {
        continue;
      }

      const nextRow = row + deltaRow;
      const nextCol = col + deltaCol;

      if (
        nextRow >= 0 &&
        nextRow < field.length &&
        nextCol >= 0 &&
        nextCol < field[0].length &&
        field[nextRow][nextCol].type === 'mine'
      ) {
        count += 1;
      }
    }
  }

  return count;
}

export function calculateAllNeighbourMines(field) {
  for (let row = 0; row < field.length; row += 1) {
    for (let col = 0; col < field[row].length; col += 1) {
      if (field[row][col].type === 'empty') {
        field[row][col].neighborMines = countNeighbourMines(row, col, field);
      }
    }
  }
}

export function createInitialState(rows = DEFAULT_ROWS, cols = DEFAULT_COLS, minesCount = DEFAULT_MINES) {
  return {
    rows,
    cols,
    minesCount,
    field: generateField(rows, cols, minesCount),
    status: 'process',
    time: 0,
    flags: 0,
    hitMine: null,
  };
}

function revealAllMines(field) {
  for (const row of field) {
    for (const cell of row) {
      if (cell.type === 'mine' && cell.state !== 'flagged') {
        cell.state = 'opened';
      }
    }
  }
}

function openNeighbours(row, col, field) {
  const stack = [[row, col]];
  const visited = new Set();

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop();
    const key = `${currentRow},${currentCol}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    for (const deltaRow of DIRECTIONS) {
      for (const deltaCol of DIRECTIONS) {
        const nextRow = currentRow + deltaRow;
        const nextCol = currentCol + deltaCol;

        if (
          nextRow < 0 ||
          nextRow >= field.length ||
          nextCol < 0 ||
          nextCol >= field[0].length
        ) {
          continue;
        }

        const cell = field[nextRow][nextCol];

        if (cell.state !== 'closed' || cell.type === 'mine') {
          continue;
        }

        cell.state = 'opened';

        if (cell.neighborMines === 0) {
          stack.push([nextRow, nextCol]);
        }
      }
    }
  }
}

function hasWon(field) {
  return field.every((row) => row.every((cell) => cell.type === 'mine' || cell.state === 'opened'));
}

export function openCell(field, row, col) {
  const nextField = cloneField(field);
  const cell = nextField[row]?.[col];

  if (!cell || cell.state !== 'closed') {
    return {
      field: nextField,
      status: 'process',
      hitMine: null,
    };
  }

  if (cell.type === 'mine') {
    cell.state = 'opened';
    revealAllMines(nextField);

    return {
      field: nextField,
      status: 'lose',
      hitMine: { row, col },
    };
  }

  cell.state = 'opened';

  if (cell.neighborMines === 0) {
    openNeighbours(row, col, nextField);
  }

  if (hasWon(nextField)) {
    revealAllMines(nextField);

    return {
      field: nextField,
      status: 'win',
      hitMine: null,
    };
  }

  return {
    field: nextField,
    status: 'process',
    hitMine: null,
  };
}

export function toggleFlag(field, row, col) {
  const nextField = cloneField(field);
  const cell = nextField[row]?.[col];

  if (!cell || cell.state === 'opened') {
    return {
      field: nextField,
      flagsDelta: 0,
    };
  }

  if (cell.state === 'closed') {
    cell.state = 'flagged';
    return {
      field: nextField,
      flagsDelta: 1,
    };
  }

  cell.state = 'closed';
  return {
    field: nextField,
    flagsDelta: -1,
  };
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}