import React, { useMemo } from 'react';

import styles from './cell.module.css';

export default function Cell({ cell, row, col, onOpen, onToggleFlag }) {
  const view = useMemo(() => {
    const isOpened = cell.state === 'opened';
    const isFlagged = cell.state === 'flagged';
    const isMineOpened = isOpened && cell.type === 'mine';

    if (isFlagged) {
      return { text: '🚩', numberClass: null, isMineOpened };
    }

    if (isMineOpened) {
      return { text: '💣', numberClass: null, isMineOpened };
    }

    if (isOpened && cell.type === 'empty') {
      const n = cell.neighborMines;
      return {
        text: n || '',
        numberClass: n ? styles[`number${n}`] : null,
        isMineOpened,
      };
    }

    return { text: '', numberClass: null, isMineOpened };
  }, [cell]);

  const className = [
    styles.cell,
    cell.state === 'closed' ? styles.closed : null,
    cell.state === 'opened' ? styles.opened : null,
    cell.state === 'flagged' ? styles.flagged : null,
    view.isMineOpened ? styles.mine : null,
    view.numberClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpen(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        onToggleFlag(row, col);
      }}
    >
      {view.text}
    </button>
  );
}
