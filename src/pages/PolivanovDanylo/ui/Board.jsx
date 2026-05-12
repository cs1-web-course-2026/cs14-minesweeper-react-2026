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
      {field.map((boardRow, rowIndex) =>
        boardRow.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            onOpen={onOpen}
            onToggleFlag={onToggleFlag}
          />
        ))
      )}
    </main>
  );
}
