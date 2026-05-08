import Cell from './Cell';
import styles from '../Minesweeper.module.css';

export default function Board({ grid, onOpen, onToggleFlag }) {
  return (
    <div className={styles.fieldGrid} role="grid" aria-label="Minesweeper board">
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <Cell
            cell={cell}
            col={colIndex}
            key={`${rowIndex}-${colIndex}`}
            onOpen={onOpen}
            onToggleFlag={onToggleFlag}
            row={rowIndex}
          />
        ))
      ))}
    </div>
  );
}
