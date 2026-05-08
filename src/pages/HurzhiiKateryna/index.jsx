import { useEffect, useState } from "react";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import RestartButton from "./components/RestartButton";
import {
  MINES,
  GAME_STATUS,
} from "./constants";
import {
  generateBoard,
  revealCellRecursive,
  checkWinCondition,
  revealAllMines,
  countFlagsPlaced,
} from "./minesweeperLogic";
import styles from "./HurzhiiKateryna.module.css";

export default function Minesweeper() {
  const [board, setBoard] = useState(generateBoard());
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [time, setTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING || !timerStarted) return;

    const timer = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timerStarted]);

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PLAYING) return;

    if (!timerStarted) {
      setTimerStarted(true);
    }

    const newBoard = board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));

    revealCellRecursive(newBoard, row, col);

    // Check if clicked on mine
    if (newBoard[row][col].isMine) {
      const finalBoard = revealAllMines(newBoard);
      setBoard(finalBoard);
      setStatus(GAME_STATUS.LOST);
      return;
    }

    setBoard(newBoard);

    // Check win condition
    if (checkWinCondition(newBoard)) {
      setStatus(GAME_STATUS.WON);
    }
  };

  const toggleFlag = (x, y) => {
    if (status !== GAME_STATUS.PLAYING) return;

    if (!timerStarted) {
      setTimerStarted(true);
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    const cell = newBoard[x][y];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;

    setBoard(newBoard);
  };

  const restart = () => {
    setBoard(generateBoard());
    setStatus(GAME_STATUS.PLAYING);
    setTime(0);
    setTimerStarted(false);
  };

  const flagsPlaced = countFlagsPlaced(board);
  const remainingMines = MINES - flagsPlaced;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minesweeper</h1>

      <div className={styles.statusSection}>
        <div className={styles.statusItem}>
          ⏱ Час: <span>{time}s</span>
        </div>
        <div className={styles.mineCounter}>
          💣 {remainingMines} mine(s) remaining
        </div>
      </div>

      <GameStatus status={status} />

      <div className={styles.boardContainer}>
        <Board
          board={board}
          onCellClick={openCell}
          onCellRightClick={toggleFlag}
        />
      </div>

      <div className={styles.controlsContainer}>
        <RestartButton onRestart={restart} />
      </div>

      <div className={styles.instructionsContainer}>
        <div className={styles.instructionItem}>
          Left mouse button – open cell
        </div>
        <div className={styles.instructionItem}>
          Right mouse button – place flag
        </div>
        <div className={styles.instructionItem}>
          Restart button – start a new game
        </div>
      </div>
    </div>
  );
}