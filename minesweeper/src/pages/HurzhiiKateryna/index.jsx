import { useState, useCallback } from "react";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import RestartButton from "./components/RestartButton";
import Timer from "./components/Timer";

const ROWS = 10;
const COLS = 10;
const MINES = 15;

const GAME_STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function createCell() {
  return {
    isMine: false,
    revealed: false,
    flagged: false,
    neighborMines: 0,
  };
}

function createBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => createCell())
  );

  let placed = 0;
  while (placed < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      placed++;
    }
  }

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col].isMine) continue;

      let mineCount = 0;
      for (const [dRow, dCol] of DIRECTIONS) {
        const nRow = row + dRow;
        const nCol = col + dCol;

        if (
          nRow >= 0 && nRow < ROWS &&
          nCol >= 0 && nCol < COLS &&
          board[nRow][nCol].isMine
        ) {
          mineCount++;
        }
      }
      board[row][col].neighborMines = mineCount;
    }
  }

  return board;
}

function revealEmptyCells(board, row, col) {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  
  const stack = [[row, col]];
  
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    
    if (
      r < 0 || r >= ROWS ||
      c < 0 || c >= COLS ||
      newBoard[r][c].revealed ||
      newBoard[r][c].flagged
    ) {
      continue;
    }

    newBoard[r][c].revealed = true;

    if (newBoard[r][c].neighborMines === 0) {
      for (const [dRow, dCol] of DIRECTIONS) {
        stack.push([r + dRow, c + dCol]);
      }
    }
  }
  
  return newBoard;
}

export default function HurzhiiKateryna() {
  const [board, setBoard] = useState(createBoard());
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [resetKey, setResetKey] = useState(0);

  const handleCellClick = useCallback((row, col) => {
    if (status !== GAME_STATUS.PLAYING) return;
    if (board[row][col].revealed || board[row][col].flagged) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    const cell = newBoard[row][col];

    if (cell.isMine) {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].revealed = true;
          }
        }
      }
      cell.revealed = true;
      setBoard(newBoard);
      setStatus(GAME_STATUS.LOST);
      return;
    }
    
    if (cell.neighborMines === 0) {
      const updatedBoard = revealEmptyCells(newBoard, row, col);
      setBoard(updatedBoard);
    } else {
      cell.revealed = true;
      setBoard(newBoard);
    }

    let openedCount = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c].revealed) openedCount++;
      }
    }

    const safeCells = ROWS * COLS - MINES;
    if (openedCount === safeCells) {
      setStatus(GAME_STATUS.WON);
    }
  }, [board, status]);

  const handleRightClick = useCallback((row, col) => {
    if (status !== GAME_STATUS.PLAYING) return;
    if (board[row][col].revealed) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].flagged = !newBoard[row][col].flagged;
    setBoard(newBoard);
  }, [board, status]);

  const restartGame = useCallback(() => {
    setBoard(createBoard());
    setStatus(GAME_STATUS.PLAYING);
    setResetKey(k => k + 1);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>💣 Minesweeper</h1>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "15px",
        background: "#f0f0f0",
        padding: "10px 20px",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "0 auto 15px"
      }}>
        <Timer gameOver={status !== GAME_STATUS.PLAYING} resetKey={resetKey} />
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          🚩 {board.flat().filter(c => c.flagged).length}/{MINES}
        </div>
      </div>
      <GameStatus status={status} />
      <Board 
        board={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={handleRightClick} 
      />
      <div style={{ marginTop: "15px" }}>
        <RestartButton onRestart={restartGame} />
      </div>
    </div>
  );
}