import styles from "../styles/Cell.module.css";

function getNumberClass(value) {
  if (!value) return "";
  return styles[`number${value}`];
}

function getCellContent(cell) {
  if (cell.state === "flagged") return "🚩";

  if (cell.state !== "opened") return "";

  if (cell.type === "mine") {
    return cell.isExploded ? "💥" : "💣";
  }

  return cell.neighborMines || "";
}

export default function Cell({ cell, onClick, onRightClick }) {
  const classNames = [
    styles.cell,
    cell.state === "opened" ? styles.opened : styles.closed,
    cell.state === "flagged" ? styles.flagged : "",
    cell.isExploded ? styles.exploded : "",
    getNumberClass(cell.neighborMines)
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      onContextMenu={(event) => {
        event.preventDefault();
        onRightClick();
      }}
      className={classNames}
      aria-label="Minesweeper cell"
    >
      {getCellContent(cell)}
    </button>
  );
}