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

  return board;
}

export default function Minesweeper() {
  const [board, setBoard] = useState(generateBoard());
  const [status, setStatus] = useState("playing");
  const [time, setTime] = useState(0);
  const [flags, setFlags] = useState(0);

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

    const cell = newBoard[x][y];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.isMine) {
      setStatus("lost");
    }

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
      <RestartButton onRestart={restart} />

      <Board
        board={board}
        onCellClick={openCell}
        onCellRightClick={toggleFlag}
      />
    </div>
  );
}