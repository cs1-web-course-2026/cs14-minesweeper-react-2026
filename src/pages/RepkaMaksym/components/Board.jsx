import { Cell } from './Cell';
import styles from '../RepkaMaksym.module.css';

export function Board({ field, status, hitMine, onOpenCell, onToggleFlag }) {
  return (
    <section
      className={styles.board}
      aria-label="Ігрове поле"
      style={{ gridTemplateColumns: `repeat(${field[0]?.length ?? 0}, minmax(0, 1fr))` }}
    >
      {field.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            gameStatus={status}
            hitMine={hitMine}
            onOpenCell={onOpenCell}
            onToggleFlag={onToggleFlag}
          />
        )),
      )}
    </section>
  );
}