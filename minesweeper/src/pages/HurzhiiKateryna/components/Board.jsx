import Cell from "./Cell";

export default function Board({ board, onCellClick, onCellRightClick }) {
  return (
    <div style={{ display: "inline-block", marginTop: 20 }}>
      {board.map((row, x) => (
        <div key={x} style={{ display: "flex" }}>
          {row.map((cell, y) => (
            <Cell
              key={y}
              cell={cell}
              onClick={() => onCellClick(x, y)}
              onRightClick={() => onCellRightClick(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}