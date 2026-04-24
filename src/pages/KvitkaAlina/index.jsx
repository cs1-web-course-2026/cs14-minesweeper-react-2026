import { useState, useEffect } from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";
import GameStatus from "./components/GameStatus";
import RestartButton from "./components/RestartButton";
import styles from "./styles/Game.module.css";

const GAME_CONFIG = {
  ROWS: 10,
  COLS: 10,
  MINES_COUNT: 10
};

const GAME_STATUS = {
  PROCESS: "process",
  WIN: "win",
  LOSE: "lose"
};

const CELL_TYPE = {
  EMPTY: "empty",
  MINE: "mine"
};

const CELL_STATE = {
  CLOSED: "closed",
  OPENED: "opened",
  FLAGGED: "flagged"
};

const FACE = {
  NORMAL: "🙂",
  WIN: "😎",
  LOSE: "😵"
};

function createCell() {
  return {
    type: CELL_TYPE.EMPTY,
    neighborMines: 0,
    state: CELL_STATE.CLOSED,
    isExploded: false
  };
}

function createEmptyField() {
  return Array.from({ length: GAME_CONFIG.ROWS }, () =>
    Array.from({ length: GAME_CONFIG.COLS }, () => createCell())
  );
}

function isInsideBoard(row, col) {
  return (
    row >= 0 &&
    row < GAME_CONFIG.ROWS &&
    col >= 0 &&
    col < GAME_CONFIG.COLS
  );
}

function forEachNeighbour(row, col, callback) {
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

function placeMines(field, excludedRow = null, excludedCol = null) {
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

function countNeighbourMines(field, row, col) {
  let count = 0;

  forEachNeighbour(row, col, (r, c) => {
    if (field[r][c].type === CELL_TYPE.MINE) count++;
  });

  return count;
}

function fillNeighbourCounts(field) {
  for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
    for (let col = 0; col < GAME_CONFIG.COLS; col++) {
      if (field[row][col].type === CELL_TYPE.MINE) continue;

      field[row][col].neighborMines = countNeighbourMines(field, row, col);
    }
  }
}

function generateField(excludedRow = null, excludedCol = null) {
  const field = createEmptyField();

  placeMines(field, excludedRow, excludedCol);
  fillNeighbourCounts(field);

  return field;
}

function copyField(field) {
  return field.map(row => row.map(cell => ({ ...cell })));
}

function floodOpen(field, row, col) {
  if (!isInsideBoard(row, col)) return;

  const cell = field[row][col];

  if (cell.state !== CELL_STATE.CLOSED) return;
  if (cell.type === CELL_TYPE.MINE) return;

  cell.state = CELL_STATE.OPENED;

  if (cell.neighborMines !== 0) return;

  forEachNeighbour(row, col, (r, c) => floodOpen(field, r, c));
}

function revealAllMines(field) {
  field.forEach(row =>
    row.forEach(cell => {
      if (cell.type === CELL_TYPE.MINE) {
        cell.state = CELL_STATE.OPENED;
      }
    })
  );
}

function countOpenedSafeCells(field) {
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

function formatCounter(value) {
  return String(Math.max(0, value)).padStart(3, "0");
}

function KvitkaAlinaGame() {
  const [field, setField] = useState(() => generateField());
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [time, setTime] = useState(0);
  const [isFirstMove, setIsFirstMove] = useState(true);

  useEffect(() => {
    if (status !== GAME_STATUS.PROCESS || isFirstMove) return;

    const timer = setInterval(() => {
      setTime(value => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, isFirstMove]);

  function getFace() {
    if (status === GAME_STATUS.WIN) return FACE.WIN;
    if (status === GAME_STATUS.LOSE) return FACE.LOSE;
    return FACE.NORMAL;
  }

  function openCell(row, col) {
    if (status !== GAME_STATUS.PROCESS) return;

    let newField = copyField(field);

    if (isFirstMove) {
      newField = generateField(row, col);
      setIsFirstMove(false);
    }

    const cell = newField[row][col];

    if (cell.state !== CELL_STATE.CLOSED) return;

    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.OPENED;
      cell.isExploded = true;
      revealAllMines(newField);
      setField(newField);
      setStatus(GAME_STATUS.LOSE);
      return;
    }

    floodOpen(newField, row, col);

    const totalSafeCells =
      GAME_CONFIG.ROWS * GAME_CONFIG.COLS - GAME_CONFIG.MINES_COUNT;

    if (countOpenedSafeCells(newField) === totalSafeCells) {
      setStatus(GAME_STATUS.WIN);
    }

    setField(newField);
  }

  function toggleFlag(row, col) {
    if (status !== GAME_STATUS.PROCESS) return;

    const newField = copyField(field);
    const cell = newField[row][col];

    if (cell.state === CELL_STATE.OPENED) return;

    if (cell.state === CELL_STATE.CLOSED) {
      if (flagsPlaced >= GAME_CONFIG.MINES_COUNT) return;

      cell.state = CELL_STATE.FLAGGED;
      setFlagsPlaced(value => value + 1);
    } else {
      cell.state = CELL_STATE.CLOSED;
      setFlagsPlaced(value => value - 1);
    }

    setField(newField);
  }

  function restart() {
    setField(generateField());
    setFlagsPlaced(0);
    setStatus(GAME_STATUS.PROCESS);
    setTime(0);
    setIsFirstMove(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Minesweeper</h1>

        <div className={styles.panel}>
          <div className={styles.counter}>
            <span>⏱</span>
            <span className={styles.value}>{formatCounter(time)}</span>
          </div>

          <RestartButton onRestart={restart} face={getFace()} />

          <div className={styles.counter}>
            <span>🚩</span>
            <span className={styles.value}>
              {formatCounter(GAME_CONFIG.MINES_COUNT - flagsPlaced)}
            </span>
          </div>
        </div>

        <Board
          field={field}
          onCellClick={openCell}
          onRightClick={toggleFlag}
        />

        <p className={styles.status}>
          Status: <span className={styles.statusStrong}>{status}</span>
        </p>
      </div>
    </div>
  );
}

export default KvitkaAlinaGame;