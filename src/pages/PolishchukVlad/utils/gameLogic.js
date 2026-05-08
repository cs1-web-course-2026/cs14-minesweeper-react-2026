export const GAME_STATUS = {
  PROCESS: 'process',
  WIN:     'win',
  LOSE:    'lose',
}

export const CELL_STATE = {
  OPENED:   'opened',
  CLOSED:   'closed',
  FLAGGED:  'flagged',
  EXPLODED: 'exploded',
  REVEALED: 'revealed',
}

export const CELL_TYPE = {
  MINE:  'mine',
  EMPTY: 'empty',
}

export const DEFAULT_ROWS        = 10
export const DEFAULT_COLS        = 10
export const DEFAULT_MINES_COUNT = 15
export const MAX_HUD_VALUE       = 999
export const HUD_PAD_WIDTH       = 3


function createEmptyField(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  )
}


function getNeighbours(row, col, rows, cols) {
  const neighbours = []

  for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
    for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
      if (directionalRow === 0 && directionalCol === 0) continue

      const neighbourRow = row + directionalRow
      const neighbourCol = col + directionalCol

      if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
        neighbours.push([neighbourRow, neighbourCol])
      }
    }
  }

  return neighbours
}


function countNeighbourMines(grid, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].type === CELL_TYPE.MINE) continue

      grid[row][col].neighborMines = getNeighbours(row, col, rows, cols)
        .filter(([neighbourRow, neighbourCol]) => grid[neighbourRow][neighbourCol].type === CELL_TYPE.MINE)
        .length
    }
  }
}


export function generateField(rows, cols, minesCount) {
  const grid = createEmptyField(rows, cols)
  let placed = 0

  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    if (grid[row][col].type !== CELL_TYPE.MINE) {
      grid[row][col].type = CELL_TYPE.MINE
      placed++
    }
  }

  countNeighbourMines(grid, rows, cols)

  return grid
}


function cloneField(field) {
  return field.map(row => row.map(cell => ({ ...cell })))
}


function openCellRecursive(grid, row, col, rows, cols) {
  const cell = grid[row][col]

  if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return

  cell.state = CELL_STATE.OPENED

  if (cell.type === CELL_TYPE.EMPTY && cell.neighborMines === 0) {
    getNeighbours(row, col, rows, cols).forEach(([neighbourRow, neighbourCol]) =>
      openCellRecursive(grid, neighbourRow, neighbourCol, rows, cols)
    )
  }
}


export function openCell(field, row, col, rows, cols) {
  const grid = cloneField(field)
  const cell = grid[row][col]

  if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
    return { grid: field, status: null }
  }

  if (cell.type === CELL_TYPE.MINE) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].type === CELL_TYPE.MINE && grid[r][c].state !== CELL_STATE.FLAGGED) {
          grid[r][c].state = r === row && c === col
            ? CELL_STATE.EXPLODED
            : CELL_STATE.REVEALED
        }
      }
    }

    return { grid, status: GAME_STATUS.LOSE }
  }

  openCellRecursive(grid, row, col, rows, cols)

  const allClear = grid.every(gridRow =>
    gridRow.every(gridCell =>
      gridCell.type === CELL_TYPE.MINE || gridCell.state === CELL_STATE.OPENED
    )
  )

  return { grid, status: allClear ? GAME_STATUS.WIN : GAME_STATUS.PROCESS }
}


export function toggleFlag(field, row, col) {
  const grid = cloneField(field)
  const cell = grid[row][col]

  if (cell.state === CELL_STATE.OPENED) return field

  cell.state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED

  return grid
}


export function countFlags(field) {
  return field.reduce(
    (sum, row) => sum + row.filter(cell => cell.state === CELL_STATE.FLAGGED).length,
    0
  )
}


export function padNumber(count, width = HUD_PAD_WIDTH) {
  return String(Math.min(count, MAX_HUD_VALUE)).padStart(width, '0')
}
