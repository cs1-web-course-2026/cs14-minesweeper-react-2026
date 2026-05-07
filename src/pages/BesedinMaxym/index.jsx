import { useEffect, useMemo, useState } from 'react';
import Board from './components/Board';
import Counter from './components/Counter';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import {
  GAME_CONFIG,
  GAME_STATUS,
  countFlags,
  generateField,
  openCell,
  toggleFlag,
} from './game/minesweeper';
import styles from './Minesweeper.module.css';

export default function BesedinMaxymMinesweeper() {
  const [gameState, setGameState] = useState(() => generateField());
  const [seconds, setSeconds] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const remainingFlags = useMemo(() => (
    gameState.minesCount - countFlags(gameState)
  ), [gameState]);

  useEffect(() => {
    if (!isTimerStarted || gameState.status !== GAME_STATUS.PROCESS) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSeconds((currentSeconds) => Math.min(currentSeconds + 1, 999));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [gameState.status, isTimerStarted]);

  const handleRestart = () => {
    setGameState(generateField(GAME_CONFIG.rows, GAME_CONFIG.cols, GAME_CONFIG.minesCount));
    setSeconds(0);
    setIsTimerStarted(false);
  };

  const handleOpenCell = (row, col) => {
    if (gameState.status !== GAME_STATUS.PROCESS) {
      return;
    }

    setIsTimerStarted(true);
    setGameState((currentState) => openCell(currentState, row, col));
  };

  const handleToggleFlag = (row, col) => {
    setGameState((currentState) => toggleFlag(currentState, row, col));
  };

  return (
    <main className={styles.page}>
      <section className={styles.gameContainer}>
        <div className={`${styles.corner} ${styles.cornerTl}`} />
        <div className={`${styles.corner} ${styles.cornerTr}`} />
        <div className={`${styles.corner} ${styles.cornerBl}`} />
        <div className={`${styles.corner} ${styles.cornerBr}`} />

        <h1 className={styles.gameTitle}>☠ Minesweeper ☠</h1>
        <p className={styles.gameSubtitle}>— Memento Mori —</p>

        <div className={styles.gameHeader}>
          <Counter icon="⚑" title="Прапорці" value={remainingFlags} />
          <RestartButton onRestart={handleRestart} status={gameState.status} />
          <Counter icon="⏳" title="Таймер" value={seconds} />
        </div>

        <Board
          grid={gameState.grid}
          onOpen={handleOpenCell}
          onToggleFlag={handleToggleFlag}
        />

        <GameStatus status={gameState.status} />
      </section>
    </main>
  );
}
