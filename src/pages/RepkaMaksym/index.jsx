import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { createInitialState, formatTime, openCell, toggleFlag } from './gameLogic';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { RestartButton } from './components/RestartButton';
import { Timer } from './components/Timer';
import styles from './RepkaMaksym.module.css';

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return createInitialState(state.rows, state.cols, state.minesCount);
    case 'tick':
      return state.status === 'process' ? { ...state, time: state.time + 1 } : state;
    case 'open': {
      if (state.status !== 'process') {
        return state;
      }

      const result = openCell(state.field, action.row, action.col);
      return {
        ...state,
        field: result.field,
        status: result.status,
        hitMine: result.hitMine,
      };
    }
    case 'flag': {
      if (state.status !== 'process') {
        return state;
      }

      const result = toggleFlag(state.field, action.row, action.col);
      return {
        ...state,
        field: result.field,
        flags: state.flags + result.flagsDelta,
      };
    }
    default:
      return state;
  }
}

export default function RepkaMaksymGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState());

  useEffect(() => {
    if (state.status !== 'process') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.status]);

  const remainingFlags = Math.max(0, state.minesCount - state.flags);
  const statusCopy =
    state.status === 'win'
      ? 'Ви очистили поле. Натисніть Restart, щоб зіграти ще раз.'
      : state.status === 'lose'
        ? 'Підрив на міні. Спробуйте ще раз.'
        : 'Клікайте лівою кнопкою, а прапорець ставте правою.';

  const restartLabel = state.status === 'win' ? 'WIN' : state.status === 'lose' ? 'LOSE' : 'NEW';

  return (
    <main className={styles.page}>
      <section className={styles.game} aria-label="Інтерфейс Minesweeper">
        <header className={styles.header}>
          <Timer value={formatTime(state.time)} />
          <RestartButton label={restartLabel} onClick={() => dispatch({ type: 'reset' })} />
          <div className={styles.display} aria-label="Кількість прапорців">
            <span className={styles.displayLabel}>FLAGS</span>
            <span className={styles.displayValue}>{String(remainingFlags).padStart(3, '0')}</span>
          </div>
        </header>

        <GameStatus status={state.status} message={statusCopy} />

        <Board
          field={state.field}
          status={state.status}
          hitMine={state.hitMine}
          onOpenCell={(row, col) => dispatch({ type: 'open', row, col })}
          onToggleFlag={(row, col) => dispatch({ type: 'flag', row, col })}
        />

        <footer className={styles.footer}>
          <Link className={styles.backLink} to="/">
            Назад до списку реалізацій
          </Link>
        </footer>
      </section>
    </main>
  );
}