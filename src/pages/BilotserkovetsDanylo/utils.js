import { CELL_STATE, CELL_TYPE, COLS, MINES_COUNT, ROWS } from "./constants";

export function createCell() {
  return {
    type: CELL_TYPE.EMPTY,
    state: CELL_STATE.CLOSED,
    neighborMines: 0,
    isHit: false,
  };
}

export function isInsideField(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

export function getNeighbours(row, col) {
  const neighbours = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const neighbourRow = row + rowOffset;
      const neighbourCol = col + colOffset;

      if (isInsideField(neighbourRow, neighbourCol)) {
        neighbours.push([neighbourRow, neighbourCol]);
      }
    }
  }

  return neighbours;
}

export function generateField() {
  const field = [];

  for (let row = 0; row < ROWS; row += 1) {
    const fieldRow = [];

    for (let col = 0; col < COLS; col += 1) {
      fieldRow.push(createCell());
    }

    field.push(fieldRow);
  }

  let placedMines = 0;

  while (placedMines < MINES_COUNT) {
    const randomRow = Math.floor(Math.random() * ROWS);
    const randomCol = Math.floor(Math.random() * COLS);

    if (field[randomRow][randomCol].type !== CELL_TYPE.MINE) {
      field[randomRow][randomCol].type = CELL_TYPE.MINE;
      placedMines += 1;
    }
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (field[row][col].type === CELL_TYPE.MINE) {
        continue;
      }

      let minesAround = 0;
      const neighbours = getNeighbours(row, col);

      for (const [neighbourRow, neighbourCol] of neighbours) {
        if (field[neighbourRow][neighbourCol].type === CELL_TYPE.MINE) {
          minesAround += 1;
        }
      }

      field[row][col].neighborMines = minesAround;
    }
  }

  return field;
}

export function cloneField(field) {
  return field.map((row) => row.map((cell) => ({ ...cell })));
}

export function openEmptyCells(field, row, col) {
  if (!isInsideField(row, col)) {
    return 0;
  }

  const cell = field[row][col];

  if (cell.state !== CELL_STATE.CLOSED || cell.type === CELL_TYPE.MINE) {
    return 0;
  }

  cell.state = CELL_STATE.OPENED;
  let openedCount = 1;

  if (cell.neighborMines === 0) {
    const neighbours = getNeighbours(row, col);

    for (const [neighbourRow, neighbourCol] of neighbours) {
      openedCount += openEmptyCells(field, neighbourRow, neighbourCol);
    }
  }

  return openedCount;
}

export function openAllMines(field) {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (field[row][col].type === CELL_TYPE.MINE) {
        field[row][col].state = CELL_STATE.OPENED;
      }
    }
  }
}

export function countFlags(field) {
  return field.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED)
    .length;
}
