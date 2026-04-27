import React from 'react';
import styles from './index.module.css';

const StatusBar = ({ mineCount, elapsed, onReset }) => {
  return (
    <div className={styles.statusBar}>
      {/* Лічильник мін */}
      <div className={styles.counter}>
        {String(mineCount).padStart(3, '0')}
      </div>
      
      {/* Кнопка перезапуску з анімацією */}
      <button 
        className={styles['reset-button']} 
        onClick={onReset}
        aria-label="Restart Game"
      >
        🔄
      </button>

      {/* Таймер */}
      <div className={styles.counter}>
        {String(elapsed).padStart(3, '0')}
      </div>
    </div>
  );
};

export default StatusBar;