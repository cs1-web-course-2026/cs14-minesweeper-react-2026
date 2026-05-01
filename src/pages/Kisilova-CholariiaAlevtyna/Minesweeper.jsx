import React, { useState } from 'react';
import styles from './Minesweeper.module.css';
import Cell from './components/Cell';
import { createBoard, CELL_STATE, GAME_STATUS } from './utils';

const Minesweeper = () => {
  const rows = 10;
  const cols = 10;
  const mines = 15;

  const [board, setBoard] = useState(() => createBoard(rows, cols, mines));
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);

  const handleCellClick = (r, c) => {
    if (status !== GAME_STATUS.PLAYING || board[r][c].state === CELL_STATE.FLAGGED) return;

    const newBoard = [...board.map(row => [...row])];
    
    if (newBoard[r][c].isMine) {
      newBoard[r][c].state = CELL_STATE.OPEN;
      setBoard(newBoard);
      setStatus(GAME_STATUS.LOSE);
      return;
    }

    newBoard[r][c].state = CELL_STATE.OPEN;
    setBoard(newBoard);
  };

  const handleContextMenu = (r, c) => {
    if (status !== GAME_STATUS.PLAYING) return;
    const newBoard = [...board.map(row => [...row])];
    const currentState = newBoard[r][c].state;

    if (currentState === CELL_STATE.CLOSED) {
      newBoard[r][c].state = CELL_STATE.FLAGGED;
    } else if (currentState === CELL_STATE.FLAGGED) {
      newBoard[r][c].state = CELL_STATE.CLOSED;
    }
    setBoard(newBoard);
  };

  return (
    <div className={styles.gameContainer}>
      <h2>Minesweeper</h2>
      <div className={styles.status}>
        {status === GAME_STATUS.WIN && "You Win! 🎉"}
        {status === GAME_STATUS.LOSE && "Game Over! 💣"}
      </div>
      <div className={styles.board}>
        {board.map((row, r) => (
          <div key={r} className={styles.row}>
            {row.map((cell, c) => (
              <Cell 
                key={`${r}-${c}`} 
                cell={cell} 
                onClick={() => handleCellClick(r, c)}
                onContextMenu={() => handleContextMenu(r, c)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => {
        setBoard(createBoard(rows, cols, mines));
        setStatus(GAME_STATUS.PLAYING);
      }}>Restart</button>
    </div>
  );
};

export default Minesweeper;