import { useEffect, useState } from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";
import GameStatus from "./components/GameStatus";
import RestartButton from "./components/RestartButton";

const ROWS = 10;
const COLS = 10;
const MINES = 15;

function createCell() {
  return {
    isMine: false,
    revealed: false,
    flagged: false,
    neighborMines: 0,
  };
}

function generateBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => createCell())
  );

  let mines = 0;
  while (mines < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);

    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      mines++;
    }
  }

  // Calculate neighbor mines for each cell
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      if (board[x][y].isMine) continue;
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < ROWS && ny >= 0 && ny < COLS) {
            if (board[nx][ny].isMine) count++;
          }
        }
      }
      board[x][y].neighborMines = count;
    }
  }

  return board;
}

export default function Minesweeper() {
  const [board, setBoard] = useState(generateBoard());
  const [status, setStatus] = useState("playing");
  const [time, setTime] = useState(0);
  const [, setFlags] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const openCell = (x, y) => {
    if (status !== "playing") return;

    const newBoard = board.map(row =>
      row.map(cell => ({ ...cell }))
    );

    const revealCell = (row, col) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      const cell = newBoard[row][col];
      if (cell.revealed || cell.flagged) return;
      
      cell.revealed = true;
      
      if (cell.isMine) {
        setStatus("lost");
        return;
      }

      // If empty cell (0 neighbors), auto-reveal all adjacent cells
      if (cell.neighborMines === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            revealCell(row + dx, col + dy);
          }
        }
      }
    };

    revealCell(x, y);
    setBoard(newBoard);
  };

  const toggleFlag = (x, y) => {
    if (status !== "playing") return;

    const newBoard = board.map(row =>
      row.map(cell => ({ ...cell }))
    );

    const cell = newBoard[x][y];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;

    setFlags(f => cell.flagged ? f + 1 : f - 1);

    setBoard(newBoard);
  };

  const restart = () => {
    setBoard(generateBoard());
    setStatus("playing");
    setTime(0);
    setFlags(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Minesweeper</h1>

      <Timer time={time} />
      <GameStatus status={status} />

      <Board
        board={board}
        onCellClick={openCell}
        onCellRightClick={toggleFlag}
      />

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <RestartButton onRestart={restart} />
      </div>

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 16, color: '#888' }}>
        <div>Left mouse button – open cell</div>
        <div>Right mouse button – place flag</div>
        <div>Restart button – start a new game</div>
      </div>
    </div>
  );
}