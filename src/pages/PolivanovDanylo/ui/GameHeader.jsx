import React, { useMemo } from 'react';

import styles from './gameHeader.module.css';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function pad3(value) {
  return String(value).padStart(3, '0');
}

export default function GameHeader({ flagsRemaining, time, status, onRestart }) {
  const { emoji, label } = useMemo(() => {
    const isWin = status === 'win';
    const isLose = status === 'lose';
    if (isWin) return { emoji: '😎', label: 'Перемога. Нова гра' };
    if (isLose) return { emoji: '💥', label: 'Поразка. Нова гра' };
    return { emoji: '🙂', label: 'Старт / Рестарт' };
  }, [status]);

  return (
    <header className={styles.header}>
      <div className={styles.counter}>
        🚩 <span>{pad2(flagsRemaining)}</span>
      </div>

      <button
        type="button"
        className={styles.restartBtn}
        onClick={onRestart}
        title={label}
        aria-label={label}
      >
        {emoji}
      </button>

      <div className={styles.timer}>
        ⏱ <span>{pad3(time)}</span>
      </div>
    </header>
  );
}
