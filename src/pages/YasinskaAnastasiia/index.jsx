import { useState, useEffect } from "react";
import styles from "./Game.module.css";

const ROWS = 10;
const COLS = 10;
const MINES = 15;

function createField() {
  const field = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];

    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isOpen: false,
        isFlag: false,
        neighbors: 0,
      });
    }

    field.push(row);
  }

  let placed = 0;

  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);

    if (!field[r][c].isMine) {
      field[r][c].isMine = true;
      placed++;
    }
  }

  const dirs = [-1, 0, 1];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let count = 0;

      dirs.forEach((dr) => {
        dirs.forEach((dc) => {
          if (dr === 0 && dc === 0) return;

          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS &&
            field[nr][nc].isMine
          ) {
            count++;
          }
        });
      });

      field[r][c].neighbors = count;
    }
  }

  return field;
}

function RestartButton({ onRestart }) {
  return (
    <button onClick={onRestart} className={styles.button}>
      Нова гра
    </button>
  );
}

function GameStatus({ gameStatus }) {
  return (
    <p className={styles.status} role="status" aria-live="polite">
      {gameStatus === "lost"
        ? "💣 You lost!"
        : gameStatus === "won"
        ? "🎉 You won!"
        : "Game in progress..."}
    </p>
  );
}

function Cell({ cell, onOpen, onFlag }) {
  return (
    <button
      type="button"
      className={`${styles.cell} ${cell.isOpen ? styles.open : ""}`}
      onClick={onOpen}
      onContextMenu={onFlag}
    >
      {cell.isFlag
        ? "🚩"
        : cell.isOpen
        ? cell.isMine
          ? "💣"
          : cell.neighbors || ""
        : ""}
    </button>
  );
}

function Board({ field, onOpenCell, onToggleFlag }) {
  return (
    <div className={styles.board}>
      {field.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            onOpen={() => onOpenCell(r, c)}
            onFlag={(event) => onToggleFlag(event, r, c)}
          />
        ))
      )}
    </div>
  );
}

export default function YasinskaAnastasiiaGame() {
  const [field, setField] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [time, setTime] = useState(0);

  useEffect(() => {
    setField(createField());
  }, []);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  function openCell(r, c) {
    if (gameStatus !== "playing") return;

    const newField = field.map((row) =>
      row.map((cell) => ({ ...cell }))
    );

    const cell = newField[r][c];

    if (cell.isOpen || cell.isFlag) return;

    cell.isOpen = true;

    if (cell.isMine) {
      setGameStatus("lost");
    }
if (cell.isMine) {
  setGameStatus("lost");
} else {
  const hasWon = newField.every((row) =>
    row.every((cell) => cell.isMine || cell.isOpen)
  );

  if (hasWon) {
    setGameStatus("won");
  }
}

setField(newField);
  }

  function toggleFlag(e, r, c) {
    e.preventDefault();

    if (gameStatus !== "playing") return;

    const newField = field.map((row) =>
      row.map((cell) => ({ ...cell }))
    );

    const cell = newField[r][c];

    if (!cell.isOpen) {
      cell.isFlag = !cell.isFlag;
    }

    setField(newField);
  }

  function restart() {
    setField(createField());
    setGameStatus("playing");
    setTime(0);
  }

  return (
    <div className={styles.game}>
      <h1>Minesweeper</h1>
      <p className={styles.timer}>⏱ {time}</p>

      <RestartButton onRestart={restart} />

      <GameStatus gameStatus={gameStatus} />

      <Board
        field={field}
        onOpenCell={openCell}
        onToggleFlag={toggleFlag}
      />
    </div>
  );
}