import { CELL_STATE, CELL_TYPE } from '../../utils/gameLogic'
import styles from './Cell.module.css'

function getClassName(cell) {
  if (cell.state === CELL_STATE.OPENED) {
    if (cell.type === CELL_TYPE.MINE) return `${styles.cell} ${styles.mine} ${styles.revealed}`
    if (cell.neighborMines === 0) return `${styles.cell} ${styles.open} ${styles.empty}`
    return `${styles.cell} ${styles.open} ${styles[`n${cell.neighborMines}`]}`
  }

  if (cell.state === CELL_STATE.EXPLODED) return `${styles.cell} ${styles.mine} ${styles.exploded}`
  if (cell.state === CELL_STATE.REVEALED) return `${styles.cell} ${styles.mine} ${styles.revealed}`

  if (cell.state === CELL_STATE.FLAGGED) {
    const mineUnder = cell.type === CELL_TYPE.MINE ? ` ${styles.mineUnder}` : ''
    return `${styles.cell} ${styles.closed} ${styles.flagged}${mineUnder}`
  }

  return `${styles.cell} ${styles.closed}`
}

function getCellContent(cell) {
  if (cell.state === CELL_STATE.FLAGGED) return '⚑'
  if (cell.state === CELL_STATE.EXPLODED || cell.state === CELL_STATE.REVEALED) return '💣'
  if (cell.state === CELL_STATE.OPENED && cell.type !== CELL_TYPE.MINE && cell.neighborMines > 0) {
    return String(cell.neighborMines)
  }
  return ''
}

function getAriaLabel(cell) {
  if (cell.state === CELL_STATE.FLAGGED)  return 'Прапорець'
  if (cell.state === CELL_STATE.EXPLODED) return 'Підірвана міна'
  if (cell.state === CELL_STATE.REVEALED) return 'Міна'
  if (cell.state === CELL_STATE.OPENED) {
    return cell.neighborMines > 0 ? String(cell.neighborMines) : 'Порожня клітинка'
  }
  return 'Закрита клітинка'
}

function Cell({ cell, row, col, onCellClick, onCellFlag }) {
  const handleClick = () => onCellClick(row, col)

  const handleContextMenu = (event) => {
    event.preventDefault()
    onCellFlag(row, col)
  }

  return (
    <button
      className={getClassName(cell)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={getAriaLabel(cell)}
    >
      {getCellContent(cell)}
    </button>
  )
}

export default Cell
