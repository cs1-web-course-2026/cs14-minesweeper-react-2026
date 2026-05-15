import { useMemo } from 'react';

import styles from './cell.module.css';

import { CellState, CellType } from '../logic.js';

export default function Cell({ cell, row, col, onOpen, onToggleFlag }) {
  const view = useMemo(() => {
    const isOpened = cell.state === CellState.OPENED;
    const isFlagged = cell.state === CellState.FLAGGED;
    const isMineOpened = isOpened && cell.type === CellType.MINE;

    if (isFlagged) {
      return { text: '🚩', numberClass: null, isMineOpened };
    }

    if (isMineOpened) {
      return { text: '💣', numberClass: null, isMineOpened };
    }

    if (isOpened && cell.type === CellType.EMPTY) {
      const neighbourCount = cell.neighborMines;
      return {
        text: neighbourCount || '',
        numberClass: neighbourCount ? styles[`number${neighbourCount}`] : null,
        isMineOpened,
      };
    }

    return { text: '', numberClass: null, isMineOpened };
  }, [cell]);

  const className = [
    styles.cell,
    cell.state === CellState.CLOSED ? styles.closed : null,
    cell.state === CellState.OPENED ? styles.opened : null,
    cell.state === CellState.FLAGGED ? styles.flagged : null,
    view.isMineOpened ? styles.mine : null,
    view.numberClass,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = `Row ${row + 1}, column ${col + 1}, ${cell.state}${view.text ? `, ${view.text}` : ''}`;

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => onOpen(row, col)}
      onContextMenu={(event) => {
        event.preventDefault();
        onToggleFlag(row, col);
      }}
    >
      {view.text}
    </button>
  );
}
