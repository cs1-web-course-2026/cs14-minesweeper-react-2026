import React, { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css';
import Cell from './components/Cell';
import { CELL_STATE, GAME_STATUS, createBoard } from './utils';

export default function Minesweeper() {
  const [grid, setGrid] = useState([]);
  const [flagsCount, setFlagsCount] = useState(15);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [explodedCell, setExplodedCell] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const rows = 10;
  const cols = 10;
  const totalMines = 15;

  useEffect(() => {
    let interval;
    if (isGameStarted && !gameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, gameOver]);

  const initGame = () => {
    setGameOver(false);
    setIsGameStarted(false);
    setExplodedCell(null);
    setShowModal(null);
    setFlagsCount(totalMines);
    setTimer(0);
    setGrid(createBoard(rows, cols, totalMines));
  };

  useEffect(() => { initGame(); }, []);

  const openEmptyCells = (newGrid, r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || newGrid[r][c].state !== CELL_STATE.CLOSED) return;
    newGrid[r][c].state = CELL_STATE.OPEN;
    if (newGrid[r][c].neighborCount === 0 && !newGrid[r][c].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) openEmptyCells(newGrid, r + i, c + j);
      }
    }
  };

  const handleCellClick = (r, c) => {
    if (gameOver || grid[r][c].state !== CELL_STATE.CLOSED) return;
    if (!isGameStarted) setIsGameStarted(true);

    let newGrid = JSON.parse(JSON.stringify(grid));

    if (newGrid[r][c].isMine) {
      setGameOver(true);
      setExplodedCell({ r, c });
      newGrid.forEach(row => row.forEach(cell => { 
        if (cell.isMine) cell.state = CELL_STATE.OPEN; 
      }));
      setTimeout(() => setShowModal(GAME_STATUS.LOSE), 500);
    } else {
      openEmptyCells(newGrid, r, c);
      const totalSafeCells = rows * cols - totalMines;
      let openedSafeCells = 0;
      newGrid.forEach(row => row.forEach(cell => { 
        if (cell.state === CELL_STATE.OPEN && !cell.isMine) openedSafeCells++; 
      }));
      if (openedSafeCells === totalSafeCells) {
        setGameOver(true);
        setTimeout(() => setShowModal(GAME_STATUS.WIN), 500);
      }
    }
    setGrid(newGrid);
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameOver || grid[r][c].state === CELL_STATE.OPEN) return;

    setGrid(prevGrid => prevGrid.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        if (rowIndex !== r || colIndex !== c) return cell;
        if (cell.state === CELL_STATE.CLOSED && flagsCount > 0) {
          setFlagsCount(prev => prev - 1);
          return { ...cell, state: CELL_STATE.FLAGGED };
        }
        if (cell.state === CELL_STATE.FLAGGED) {
          setFlagsCount(prev => prev + 1);
          return { ...cell, state: CELL_STATE.CLOSED };
        }
        return cell;
      })
    ));
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.game}>
        <div className={styles.gameHeader}>
          <div className={styles.status}>
            <div className={styles.timer}>⏱ {timer}</div>
            <div className={styles.flags}>🚩 {flagsCount}</div>
          </div>
          <button className={styles.btnStart} onClick={initGame}>NEW GAME</button>
        </div>
        <div className={styles.board}>
          {grid.map((row, r) => 
            row.map((cell, c) => (
              <Cell 
                key={`${r}-${c}`}
                cell={cell}
                isExploded={explodedCell?.r === r && explodedCell?.c === c}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{showModal === GAME_STATUS.WIN ? '🎉 Перемога!' : '🤯 Упс...'}</h2>
            <p>{showModal === GAME_STATUS.WIN ? 'Ти справжній профі!' : 'Спробуй знову, ти зможеш!'}</p>
            <button className={styles.btnStart} onClick={initGame}>ЗІГРАТИ ЩЕ</button>
          </div>
        </div>
      )}
    </div>
  );
}