import { GAME_STATUS } from '../game/minesweeper';
import styles from '../Minesweeper.module.css';

const messages = {
  [GAME_STATUS.WIN]: '🎉 ВИ ПЕРЕМОГЛИ! 🎉',
  [GAME_STATUS.LOSE]: '💣 ГРА ПРОГРАНА 💣',
};

export default function GameStatus({ status }) {
  if (status === GAME_STATUS.PROCESS) {
    return null;
  }

  return (
    <div className={styles.gameOverModal} role="status" aria-live="polite">
      <div className={styles.modalContent}>
        <p className={status === GAME_STATUS.WIN ? styles.winMessage : styles.loseMessage}>
          {messages[status]}
        </p>
      </div>
    </div>
  );
}
