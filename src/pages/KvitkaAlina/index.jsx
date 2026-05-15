import { useState, useEffect } from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";
import GameStatus from "./components/GameStatus";
import RestartButton from "./components/RestartButton";
import styles from "./styles/Game.module.css";
import {
  GAME_CONFIG,
  GAME_STATUS,
  CELL_TYPE,
  CELL_STATE,
  FACE
} from "./constants";
import {
  generateField,
  copyField,
  floodOpen,
  revealAllMines,
  countOpenedSafeCells,
  formatCounter
} from "./utils";

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