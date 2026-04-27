import Cell from "./Cell";
import styles from "../styles/Board.module.css";

export default function Board({ field, onCellClick, onRightClick }) {
  return (
    <div className={styles.board}>
      {field.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
         <Cell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          row={rowIndex}
          col={colIndex}
          onClick={() => onCellClick(rowIndex, colIndex)}
          onRightClick={() => onRightClick(rowIndex, colIndex)}
        />
        ))
      )}
    </div>
  );
}