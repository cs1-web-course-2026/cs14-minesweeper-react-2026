import React from 'react';
import { useGameLogic } from './gameLogic';
import StatusBar from './StatusBar';
import GameField from './GameField';
import GameOverOverlay from './GameOverOverlay';
import styles from './index.module.css';

const PeresechanskyiGame = () => {
  const { board, status, elapsed, flaggedCount, openCell, toggleFlag, reset, MINE_COUNT } = useGameLogic();

  return (
    <div className={styles.minesweeper}>
      <StatusBar 
        mineCount={Math.max(0, MINE_COUNT - flaggedCount)} 
        elapsed={elapsed} 
        onReset={reset} 
      />
      
      <div style={{ position: 'relative' }}>
        <GameField 
          board={board} 
          onOpen={openCell} 
          onFlag={toggleFlag} 
        />
        <GameOverOverlay status={status} />
      </div>
    </div>
  );
};

export default PeresechanskyiGame;