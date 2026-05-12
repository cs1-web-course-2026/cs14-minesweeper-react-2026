import React, { useEffect, useMemo, useReducer } from 'react';

import styles from './minesweeper.module.css';

import GameHeader from './ui/GameHeader.jsx';
import Board from './ui/Board.jsx';

import { createNewGame, getHeaderView, openCell, tick, toggleFlag } from './logic.js';

const DEFAULT_CONFIG = { rows: 10, cols: 10, minesCount: 15 };

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return createNewGame(state);
    case 'OPEN_CELL':
      return openCell(state, action.row, action.col);
    case 'TOGGLE_FLAG':
      return toggleFlag(state, action.row, action.col);
    case 'TICK':
      return tick(state);
    default:
      return state;
  }
}

function init(config) {
  return createNewGame(config);
}

export default function PolivanovDanyloGame() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_CONFIG, init);

  const header = useMemo(() => getHeaderView(state), [state]);

  useEffect(() => {
    if (state.status !== 'process') return;

    const id = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(id);
  }, [state.status]);

  function handleRestart() {
    dispatch({ type: 'RESET' });
  }

  function handleOpen(row, col) {
    dispatch({ type: 'OPEN_CELL', row, col });
  }

  function handleToggleFlag(row, col) {
    dispatch({ type: 'TOGGLE_FLAG', row, col });
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <GameHeader
          flagsRemaining={header.flagsRemaining}
          time={state.gameTime}
          status={state.status}
          onRestart={handleRestart}
        />

        <Board field={state.field} rows={state.rows} cols={state.cols} status={state.status} onOpen={handleOpen} onToggleFlag={handleToggleFlag} />
      </div>
    </div>
  );
}
