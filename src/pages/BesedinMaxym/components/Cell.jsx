import { CELL_STATE, CELL_TYPE } from '../game/minesweeper';
import styles from '../Minesweeper.module.css';

function getCellClassName(cell) {
  const classNames = [styles.cell];

  if (cell.state === CELL_STATE.CLOSED) {
    classNames.push(styles.closed);
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    classNames.push(styles.flagged);
  }

  if (cell.state === CELL_STATE.OPENED) {
    classNames.push(styles.opened);

    if (cell.type === CELL_TYPE.MINE) {
      classNames.push(cell.isHit ? styles.mineHit : styles.mine);
    } else if (cell.neighborMines > 0) {
      classNames.push(styles[`number${cell.neighborMines}`]);
    }
  }

  return classNames.join(' ');
}

export default function Cell({ cell, row, col, onOpen, onToggleFlag }) {
  const content = cell.state === CELL_STATE.OPENED
    && cell.type === CELL_TYPE.EMPTY
    && cell.neighborMines > 0
    ? cell.neighborMines
    : '';

  return (
    <button
      aria-label={`Клітинка ${row + 1}:${col + 1}`}
      className={getCellClassName(cell)}
      onClick={() => onOpen(row, col)}
      onContextMenu={(event) => {
        event.preventDefault();
        onToggleFlag(row, col);
      }}
      type="button"
    >
      {content}
    </button>
  );
}
