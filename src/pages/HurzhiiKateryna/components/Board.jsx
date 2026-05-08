import Cell from "./Cell";
import styles from "./Board.module.css";

export default function Board({ board, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.boardRow}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onRightClick={() => onCellRightClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}