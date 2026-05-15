import { GAME_CONFIG, CELL_TYPE, CELL_STATE } from "./constants";

export function createCell() {
  return {
    type: CELL_TYPE.EMPTY,
    neighborMines: 0,
    state: CELL_STATE.CLOSED,
    isExploded: false
  };
}

export function createEmptyField() {
  return Array.from({ length: GAME_CONFIG.ROWS }, () =>
    Array.from({ length: GAME_CONFIG.COLS }, () => createCell())
  );
}

export function isInsideBoard(row, col) {
  return (
    row >= 0 &&
    row < GAME_CONFIG.ROWS &&
    col >= 0 &&
    col < GAME_CONFIG.COLS
  );
}

export function forEachNeighbour(row, col, callback) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const r = row + dr;
      const c = col + dc;

      if (isInsideBoard(r, c)) {
        callback(r, c);
      }
    }
  }
}

export function placeMines(field, excludedRow = null, excludedCol = null) {
  let placed = 0;

  while (placed < GAME_CONFIG.MINES_COUNT) {
    const row = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const col = Math.floor(Math.random() * GAME_CONFIG.COLS);

    if (row === excludedRow && col === excludedCol) continue;
    if (field[row][col].type === CELL_TYPE.MINE) continue;

    field[row][col].type = CELL_TYPE.MINE;
    placed++;
  }
}

export function countNeighbourMines(field, row, col) {
  let count = 0;

  forEachNeighbour(row, col, (r, c) => {
    if (field[r][c].type === CELL_TYPE.MINE) count++;
  });

  return count;
}

export function fillNeighbourCounts(field) {
  for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
    for (let col = 0; col < GAME_CONFIG.COLS; col++) {
      if (field[row][col].type === CELL_TYPE.MINE) continue;

      field[row][col].neighborMines = countNeighbourMines(field, row, col);
    }
  }
}

export function generateField(excludedRow = null, excludedCol = null) {
  const field = createEmptyField();

  placeMines(field, excludedRow, excludedCol);
  fillNeighbourCounts(field);

  return field;
}

export function copyField(field) {
  return field.map(row => row.map(cell => ({ ...cell })));
}

export function floodOpen(field, row, col) {
  if (!isInsideBoard(row, col)) return;

  const cell = field[row][col];

  if (cell.state !== CELL_STATE.CLOSED) return;
  if (cell.type === CELL_TYPE.MINE) return;

  cell.state = CELL_STATE.OPENED;

  if (cell.neighborMines !== 0) return;

  forEachNeighbour(row, col, (r, c) => floodOpen(field, r, c));
}

export function revealAllMines(field) {
  field.forEach(row =>
    row.forEach(cell => {
      if (cell.type === CELL_TYPE.MINE) {
        cell.state = CELL_STATE.OPENED;
      }
    })
  );
}

export function countOpenedSafeCells(field) {
  let opened = 0;

  field.forEach(row =>
    row.forEach(cell => {
      if (cell.state === CELL_STATE.OPENED && cell.type !== CELL_TYPE.MINE) {
        opened++;
      }
    })
  );

  return opened;
}

export function formatCounter(value) {
  return String(Math.max(0, value)).padStart(3, "0");
}