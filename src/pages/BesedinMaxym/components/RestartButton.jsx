import { GAME_STATUS } from '../game/minesweeper';
import styles from '../Minesweeper.module.css';

const faceByStatus = {
  [GAME_STATUS.PROCESS]: '💀',
  [GAME_STATUS.WIN]: '😎',
  [GAME_STATUS.LOSE]: '😵',
};

export default function RestartButton({ status, onRestart }) {
  return (
    <button className={styles.startButton} onClick={onRestart} type="button" title="Нова гра">
      <span className={styles.face}>{faceByStatus[status] ?? '💀'}</span>
    </button>
  );
}
