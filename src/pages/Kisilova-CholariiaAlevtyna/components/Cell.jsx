import React from 'react';
import styles from '../Minesweeper.module.css';
import { CELL_STATE } from '../utils';

const Cell = ({ cell, onClick, onContextMenu, isExploded }) => {
  const cellClass = `
    ${styles.cell} 
    ${styles[cell.state]} 
    ${cell.isMine && cell.state === CELL_STATE.OPEN ? styles.mine : ''} 
    ${isExploded ? styles.exploded : ''}
  `;

  return (
    <button
      type="button"
      className={cellClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-number={cell.neighborCount}
      aria-label={`Minesweeper cell ${cell.state}`}
    >
      {cell.state === CELL_STATE.OPEN && !cell.isMine && cell.neighborCount > 0 ? cell.neighborCount : ''}
      {cell.state === CELL_STATE.FLAGGED && '🚩'}
      {cell.state === CELL_STATE.OPEN && cell.isMine && '💣'}
    </button>
  );
}; 

export default Cell;