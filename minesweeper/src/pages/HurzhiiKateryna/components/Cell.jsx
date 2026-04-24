const NUMBER_COLORS = {
  1: '#3498db',
  2: '#27ae60',
  3: '#e74c3c',
  4: '#9b59b6',
  5: '#f39c12',
  6: '#1abc9c',
  7: '#34495e',
  8: '#7f8c8d',
};

export default function Cell({ cell, onClick, onRightClick }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
      style={{
        width: 35,
        height: 35,
        border: "1px solid #333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: cell.revealed ? "#ddd" : "#aaa",
        cursor: "pointer",
        fontSize: "16px",
        userSelect: "none",
      }}
    >
      {!cell.revealed && cell.flagged && "🚩"}

      {cell.revealed && cell.isMine && "💣"}

      {cell.revealed &&
        !cell.isMine &&
        cell.neighborMines > 0 && (
          <span style={{ color: NUMBER_COLORS[cell.neighborMines] }}>
            {cell.neighborMines}
          </span>
      )}
    </div>
  );
}