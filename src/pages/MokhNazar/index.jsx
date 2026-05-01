import { useState, useCallback, useEffect } from "react";
import { CELL_STATE, GAME_STATUS, CELL_CONTENT } from "./constants";
import { createBoard, revealCells } from "./utils";
import styles from "./Game.module.css";


const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 8;
const DEFAULT_MINES = 10;

export default function MokhNazarGame() {
  const [board, setBoard] = useState(() => createBoard(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES));
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.IDLE);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (gameStatus === GAME_STATUS.PLAYING) {
      timerId = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [gameStatus]);

  const handleRestart = useCallback(() => {
    setBoard(createBoard(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES));
    setGameStatus(GAME_STATUS.IDLE);
    setFlagsPlaced(0);
    setElapsedTime(0);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST) return;
    if (gameStatus === GAME_STATUS.IDLE) setGameStatus(GAME_STATUS.PLAYING);

    const cell = board[row][col];
    if (cell.state !== CELL_STATE.CLOSED) return;

    if (cell.content === CELL_CONTENT.MINE) {
      setBoard((prevBoard) =>
        prevBoard.map((boardRow, rIdx) =>
          boardRow.map((c, cIdx) =>
            rIdx === row && cIdx === col ? { ...c, state: CELL_STATE.OPEN } : c
          )
        )
      );
      setGameStatus(GAME_STATUS.LOST);
      return;
    }

    const newBoard = revealCells(board, row, col, DEFAULT_ROWS, DEFAULT_COLS);
    setBoard(newBoard);

    const allSafeCellsOpen = newBoard.every((boardRow) =>
      boardRow.every((c) =>
        c.content === CELL_CONTENT.MINE || c.state === CELL_STATE.OPEN
      )
    );

    if (allSafeCellsOpen) {
      setGameStatus(GAME_STATUS.WON);
    }
  }, [board, gameStatus]);

  const handleCellRightClick = useCallback((event, row, col) => { // Обернуто в useCallback[cite: 1, 2]
    event.preventDefault();
    if (gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST) return;

    const cell = board[row][col];
    if (cell.state === CELL_STATE.OPEN) return;

    if (cell.state === CELL_STATE.CLOSED) {
      setFlagsPlaced((prev) => prev + 1);
    } else if (cell.state === CELL_STATE.FLAGGED) {
      setFlagsPlaced((prev) => prev - 1);
    }

    setBoard((prevBoard) =>
      prevBoard.map((boardRow, rIdx) =>
        boardRow.map((c, cIdx) =>
          rIdx === row && cIdx === col
            ? { ...c, state: c.state === CELL_STATE.CLOSED ? CELL_STATE.FLAGGED : CELL_STATE.CLOSED }
            : c
        )
      )
    );
  }, [board, gameStatus]);

  return (
    <main className={styles.gameContainer}>
      <header className={styles.statusBar}>
        <span>Час: {elapsedTime}с</span>
        <button type="button" onClick={handleRestart} aria-label="Restart game">🔄 Рестарт</button>
        <span>Залишилось мін: {DEFAULT_MINES - flagsPlaced}</span>
      </header>
      
      {gameStatus === GAME_STATUS.LOST && <p role="status" aria-live="polite">Ви програли!</p>}
      {gameStatus === GAME_STATUS.WON && <p role="status" aria-live="polite">Ви виграли!</p>}

      <div className={styles.board} role="grid">
        {board.map((row, rIdx) => (
          <div key={rIdx} className={styles.row}>
            {row.map((cell, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                type="button"
                className={`${styles.cell} ${styles[cell.state]}`}
                onClick={() => handleCellClick(rIdx, cIdx)}
                onContextMenu={(e) => handleCellRightClick(e, rIdx, cIdx)}
                aria-label={`Клітинка ${rIdx}, ${cIdx}`}
              >
                {cell.state === CELL_STATE.OPEN && cell.content === CELL_CONTENT.MINE ? '💣' : ''}
                {cell.state === CELL_STATE.OPEN && cell.content === CELL_CONTENT.EMPTY && cell.adjacentMines > 0 ? cell.adjacentMines : ''}
                {cell.state === CELL_STATE.FLAGGED ? '🚩' : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}