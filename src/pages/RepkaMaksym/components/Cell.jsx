import styles from '../RepkaMaksym.module.css';

function getCellLabel(cell, row, col, hitMine) {
  const position = `R${row + 1} C${col + 1}`;

  if (cell.state === 'flagged') {
    return `${position}: позначена клітинка`;
  }

  if (cell.state === 'opened') {
    if (cell.type === 'mine') {
      return hitMine && hitMine.row === row && hitMine.col === col
        ? `${position}: підірвана міна`
        : `${position}: міна`;
    }

    if (cell.neighborMines > 0) {
      return `${position}: відкрита клітинка, поруч ${cell.neighborMines} мін`;
    }

    return `${position}: порожня відкрита клітинка`;
  }

  return `${position}: закрита клітинка`;
}

export function Cell({ cell, row, col, gameStatus, hitMine, onOpenCell, onToggleFlag }) {
  const isMine = cell.state === 'opened' && cell.type === 'mine';
  const isMineHit = isMine && hitMine?.row === row && hitMine?.col === col;
  const numberClass = cell.neighborMines > 0 ? styles[`number${cell.neighborMines}`] : '';

  const className = [
    styles.cell,
    cell.state === 'opened' && styles.open,
    cell.state === 'flagged' && styles.flagged,
    isMine && styles.mine,
    isMineHit && styles.mineHit,
    numberClass,
  ]
    .filter(Boolean)
    .join(' ');

  const content =
    cell.state === 'opened' && cell.type !== 'mine' && cell.neighborMines > 0
      ? String(cell.neighborMines)
      : '';

  return (
    <button
      type="button"
      className={className}
      aria-label={getCellLabel(cell, row, col, hitMine)}
      disabled={gameStatus !== 'process' || cell.state === 'opened'}
      onClick={() => onOpenCell(row, col)}
      onContextMenu={(event) => {
        event.preventDefault();
        onToggleFlag(row, col);
      }}
    >
      {content}
    </button>
  );
}