import React, { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css';

export default function Minesweeper() {
  const [grid, setGrid] = useState([]);
  const [flagsCount, setFlagsCount] = useState(15);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [explodedCell, setExplodedCell] = useState(null);
  const [showModal, setShowModal] = useState(null); // 'win' або 'lose'

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
    let newGrid = [];
    setGameOver(false);
    setIsGameStarted(false);
    setExplodedCell(null);
    setShowModal(null);
    setFlagsCount(totalMines);
    setTimer(0);

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ isMine: false, state: 'closed', neighborCount: 0 });
      }
      newGrid.push(row);
    }

    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let mines = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                if (newGrid[r + i][c + j].isMine) mines++;
              }
            }
          }
          newGrid[r][c].neighborCount = mines;
        }
      }
    }
    setGrid(newGrid);
  };

  useEffect(() => { initGame(); }, []);

  const openEmptyCells = (newGrid, r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || newGrid[r][c].state !== 'closed') return;
    newGrid[r][c].state = 'open';
    if (newGrid[r][c].neighborCount === 0 && !newGrid[r][c].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) openEmptyCells(newGrid, r + i, c + j);
      }
    }
  };

  const handleCellClick = (r, c) => {
    if (gameOver || grid[r][c].state !== 'closed') return;
    if (!isGameStarted) setIsGameStarted(true);

    let newGrid = JSON.parse(JSON.stringify(grid));

    if (newGrid[r][c].isMine) {
      setGameOver(true);
      setExplodedCell({ r, c });
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.state = 'open'; }));
      setTimeout(() => setShowModal('lose'), 500); // Показуємо модалку через пів секунди
    } else {
      openEmptyCells(newGrid, r, c);
      const totalSafeCells = rows * cols - totalMines;
      let openedSafeCells = 0;
      newGrid.forEach(row => row.forEach(cell => { if (cell.state === 'open' && !cell.isMine) openedSafeCells++; }));
      if (openedSafeCells === totalSafeCells) {
        setGameOver(true);
        setTimeout(() => setShowModal('win'), 500);
      }
    }
    setGrid(newGrid);
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameOver || grid[r][c].state === 'open') return;
    let newGrid = [...grid];
    if (newGrid[r][c].state === 'closed' && flagsCount > 0) {
      newGrid[r][c].state = 'flagged';
      setFlagsCount(prev => prev - 1);
    } else if (newGrid[r][c].state === 'flagged') {
      newGrid[r][c].state = 'closed';
      setFlagsCount(prev => prev + 1);
    }
    setGrid(newGrid);
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
          {grid.map((row, r) => row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`${styles.cell} ${styles[cell.state]} ${cell.isMine && cell.state === 'open' ? styles.mine : ''} ${explodedCell?.r === r && explodedCell?.c === c ? styles.exploded : ''}`}
              data-number={cell.neighborCount}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
            >
              {cell.state === 'open' && !cell.isMine && cell.neighborCount > 0 ? cell.neighborCount : ''}
              {cell.state === 'flagged' && '🚩'}
              {cell.state === 'open' && cell.isMine && '💣'}
            </div>
          )))}
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{showModal === 'win' ? '🎉 Перемога!' : '🤯 Упс...'}</h2>
            <p>{showModal === 'win' ? 'Ти справжній профі!' : 'Спробуй знову, ти зможеш!'}</p>
            <button className={styles.btnStart} onClick={initGame}>ЗІГРАТИ ЩЕ</button>
          </div>
        </div>
      )}
    </div>
  );
}