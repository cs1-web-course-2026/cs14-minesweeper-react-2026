import Cell from '../Cell'
import styles from './Board.module.css'

function Board({ field, onCellClick, onCellFlag }) {
  return (
    <main className={styles.board} role="grid" aria-label="Ігрове поле">
      {field.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onCellClick={onCellClick}
              onCellFlag={onCellFlag}
            />
          ))}
        </div>
      ))}
    </main>
  )
}

export default Board
