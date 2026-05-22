import React from 'react';
import styles from './index.module.css';

const Cell = React.memo(({ row, col, cell, onOpen, onFlag }) => {
  const content = cell.state === 'open' 
    ? (cell.hasMine ? '💣' : (cell.adjacentMines || '')) 
    : (cell.state === 'flagged' ? '🚩' : '');

  const className = `${styles.cell} ${cell.state === 'open' ? styles.opened : ''} ${
    cell.state === 'flagged' ? styles.flagged : ''
  } ${cell.state === 'open' && cell.adjacentMines ? styles[`number-${cell.adjacentMines}`] : ''}`;

  return (
<button
  type="button"
  className={className}
  aria-label={`Row ${row + 1}, column ${col + 1}, ${cell.state}`}
  onClick={() => onOpen(row, col)}
  onContextMenu={(event) => {
    event.preventDefault();
    onFlag(row, col);
  }}
>
  {content}
</button>
  );
});

export default Cell;
