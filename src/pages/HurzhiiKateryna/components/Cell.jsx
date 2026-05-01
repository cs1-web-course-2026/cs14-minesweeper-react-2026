export default function Cell({ cell, onClick, onRightClick }) {
  const getContent = () => {
    if (!cell.revealed) return cell.flagged ? "🚩" : "";
    if (cell.isMine) return "💣";
    // Colorful numbers
    const colors = [null, '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#fbc02d', '#0288d1', '#c2185b', '#616161'];
    return cell.neighborMines ? (
      <span style={{ color: colors[cell.neighborMines] }}>{cell.neighborMines}</span>
    ) : "";
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
      style={{
        width: 30,
        height: 30,
        border: "1px solid #999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: cell.revealed ? "#ddd" : "#aaa",
        cursor: "pointer",
        fontWeight: "bold",
        userSelect: "none",
      }}
    >
      {getContent()}
    </div>
  );
}