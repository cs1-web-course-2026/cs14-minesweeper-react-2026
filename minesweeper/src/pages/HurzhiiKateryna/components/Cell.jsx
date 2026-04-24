export default function Cell({ cell, onClick, onRightClick }) {
  const getContent = () => {
    if (!cell.revealed) return cell.flagged ? "🚩" : "";
    if (cell.isMine) return "💣";
    return cell.neighborMines || "";
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