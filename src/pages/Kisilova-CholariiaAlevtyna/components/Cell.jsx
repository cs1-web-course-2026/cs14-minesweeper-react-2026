import React from 'react';
import styles from '../Minesweeper.module.css';
import { CELL_STATE } from '../utils';

const Cell = ({ cell, onClick, onContextMenu }) => {
  const getCellContent = () => {
    if (cell.state === CELL_STATE.FLAGGED) return '🚩';
    if (cell.state === CELL_STATE.CLOSED) return '';
    if (cell.isMine) return '💣';
    return cell.neighborCount > 0 ? cell.neighborCount : '';
  };

  const cellClass = `${styles.cell} ${cell.state === CELL_STATE.OPEN ? styles.open : ''} ${
    cell.isMine && cell.state === CELL_STATE.OPEN ? styles.mine : ''
  }`;

  return (
    <button
      type="button"
      className={cellClass}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu();
      }}
      aria-label={cell.isMine ? "Mine" : `Cell with ${cell.neighborCount} neighbors`}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;