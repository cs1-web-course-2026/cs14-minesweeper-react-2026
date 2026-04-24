import styles from "../styles/Cell.module.css";

function getNumberClass(value) {
  if (!value) return "";
  return styles[`number${value}`];
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
      {cell.state === "flagged"
        ? "🚩"
        : cell.state === "opened"
        ? cell.type === "mine"
          ? cell.isExploded
            ? "💥"
            : "💣"
          : cell.neighborMines || ""
        : ""}
    </button>
  );
}