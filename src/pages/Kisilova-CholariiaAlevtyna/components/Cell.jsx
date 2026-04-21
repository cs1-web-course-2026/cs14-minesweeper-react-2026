import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Cell({ cell, onClick, onContextMenu, isExploded }) {
  const cellClass = `
    ${styles.cell} 
    ${styles[cell.state]} 
    ${cell.isMine && cell.state === 'open' ? styles.mine : ''} 
    ${isExploded ? styles.exploded : ''}
  `;

  return (
    <div
      className={cellClass}
      data-number={cell.neighborCount}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {cell.state === 'open' && !cell.isMine && cell.neighborCount > 0 ? cell.neighborCount : ''}
      {cell.state === 'flagged' && '🚩'}
      {cell.state === 'open' && cell.isMine && '💣'}
    </div>
  );
}