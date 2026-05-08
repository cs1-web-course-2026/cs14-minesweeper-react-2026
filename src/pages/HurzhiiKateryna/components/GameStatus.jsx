import { GAME_STATUS } from "../constants";
import styles from "./GameStatus.module.css";

export default function GameStatus({ status }) {
  let statusText = "";
  let statusClass = "";

  if (status === GAME_STATUS.PLAYING) {
    statusText = "🎮 Game in Progress";
    statusClass = styles.playing;
  } else if (status === GAME_STATUS.WON) {
    statusText = "🎉 Victory!";
    statusClass = styles.won;
  } else if (status === GAME_STATUS.LOST) {
    statusText = "💣 Defeat!";
    statusClass = styles.lost;
  }

  return (
    <h2 role="status" aria-live="polite" className={`${styles.status} ${statusClass}`}>
      {statusText}
    </h2>
  );
}