import { NEIGHBOR_MINE_COLORS } from "../constants";
import styles from "./Cell.module.css";

export default function Cell({ cell, onClick, onRightClick }) {
  const getContent = () => {
    if (!cell.revealed) return cell.flagged ? "🚩" : "";
    if (cell.isMine) return "💣";
    return cell.neighborMines ? (
      <span
        style={{ color: NEIGHBOR_MINE_COLORS[cell.neighborMines] }}
        className={styles.number}
      >
        {cell.neighborMines}
      </span>
    ) : "";
  };

  const cellClasses = [
    styles.cell,
    cell.revealed ? styles.revealed : "",
    cell.revealed && cell.isMine ? styles.mine : "",
    cell.flagged && !cell.revealed ? styles.flag : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cellClasses}
      onClick={onClick}
      onContextMenu={(event) => {
        event.preventDefault();
        onRightClick();
      }}
    >
      {getContent()}
    </div>
  );
}