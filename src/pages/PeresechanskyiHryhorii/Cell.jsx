import React from 'react';
import styles from './index.module.css';

const Cell = React.memo(({ r, c, cell, onOpen, onFlag }) => {
  const content = cell.state === 'open' 
    ? (cell.hasMine ? '💣' : (cell.adjacentMines || '')) 
    : (cell.state === 'flagged' ? '🚩' : '');

  const className = `${styles.cell} ${cell.state === 'open' ? styles.opened : ''} ${
    cell.state === 'flagged' ? styles.flagged : ''
  } ${cell.state === 'open' && cell.adjacentMines ? styles[`number-${cell.adjacentMines}`] : ''}`;

  return (
    <div 
      className={className}
      onClick={() => onOpen(r, c)}
      onContextMenu={(e) => { e.preventDefault(); onFlag(r, c); }}
    >
      {content}
    </div>
  );
});

export default Cell;