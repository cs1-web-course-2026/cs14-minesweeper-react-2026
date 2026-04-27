import { useState, useCallback, useEffect } from 'react';

const CELL_STATE = { CLOSED: 'closed', OPEN: 'open', FLAGGED: 'flagged' };
const GAME_STATUS = { PLAYING: 'playing', WON: 'won', LOST: 'lost' };
const GRID_SIZE = 9;
const MINE_COUNT = 10;

const generateField = () => {
  const b = Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill(null).map(() => ({ 
      hasMine: false, state: CELL_STATE.CLOSED, adjacentMines: 0 
    }))
  );
  
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    if (!b[r][c].hasMine) {
      b[r][c].hasMine = true;
      placed++;
    }
  }
  
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (b[r][c].hasMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && b[nr][nc].hasMine) count++;
        }
      }
      b[r][c].adjacentMines = count;
    }
  }
  return b;
};

export const useGameLogic = () => {
  const [board, setBoard] = useState(generateField);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [elapsed, setElapsed] = useState(0);
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const openCell = useCallback((r, c) => {
    if (status !== GAME_STATUS.PLAYING) return;
    
    setBoard(prev => {
      if (prev[r][c].state !== CELL_STATE.CLOSED) return prev;
      const newBoard = prev.map(row => row.map(cell => ({...cell})));
      
      const reveal = (row, col) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
        const cell = newBoard[row][col];
        if (cell.state !== CELL_STATE.CLOSED) return;

        cell.state = CELL_STATE.OPEN;
        if (cell.hasMine) {
          setStatus(GAME_STATUS.LOST);
          return;
        }
        
        if (cell.adjacentMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              reveal(row + dr, col + dc);
            }
          }
        }
      };

      reveal(r, c);

      const closedNonMines = newBoard.flat().filter(c => !c.hasMine && c.state !== CELL_STATE.OPEN).length;
      if (closedNonMines === 0 && status !== GAME_STATUS.LOST) setStatus(GAME_STATUS.WON);

      return newBoard;
    });
  }, [status]);

  const toggleFlag = useCallback((r, c) => {
    if (status !== GAME_STATUS.PLAYING) return;
    
    const cell = board[r][c];
    if (cell.state === CELL_STATE.OPEN) return;

    if (cell.state === CELL_STATE.FLAGGED) {
      setFlaggedCount(f => f - 1);
      setBoard(prev => {
        const newBoard = prev.map(row => row.map(cell => ({...cell})));
        newBoard[r][c].state = CELL_STATE.CLOSED;
        return newBoard;
      });
    } else {
      if (flaggedCount < MINE_COUNT) {
        setFlaggedCount(f => f + 1);
        setBoard(prev => {
          const newBoard = prev.map(row => row.map(cell => ({...cell})));
          newBoard[r][c].state = CELL_STATE.FLAGGED;
          return newBoard;
        });
      }
    }
  }, [status, flaggedCount, board]);

  const reset = () => {
    setBoard(generateField());
    setStatus(GAME_STATUS.PLAYING);
    setElapsed(0);
    setFlaggedCount(0);
  };

  return { board, status, elapsed, flaggedCount, openCell, toggleFlag, reset, MINE_COUNT };
};