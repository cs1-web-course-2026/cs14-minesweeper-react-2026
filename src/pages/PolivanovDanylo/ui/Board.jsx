import React from 'react';

import styles from './board.module.css';
import Cell from './Cell.jsx';

export default function Board({ field, rows, cols, status, onOpen, onToggleFlag }) {
  return (
    <main
      className={styles.board}
      style={{ '--cols': cols, '--rows': rows }}
      data-status={status}
      role="grid"
      aria-label="Minesweeper board"
    >
      {field.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            onOpen={onOpen}
            onToggleFlag={onToggleFlag}
          />
        ))
      )}
    </main>
  );
}
