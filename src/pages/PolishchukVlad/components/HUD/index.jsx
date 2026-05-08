import { padNumber, GAME_STATUS, MAX_HUD_VALUE } from '../../utils/gameLogic'
import styles from './HUD.module.css'

const FACE_MAP = {
  [GAME_STATUS.PROCESS]: '🙂',
  [GAME_STATUS.WIN]:     '😎',
  [GAME_STATUS.LOSE]:    '😵',
}

function HUD({ flagsLeft, time, status, onRestart }) {
  return (
    <div className={styles.hud}>
      <div className={styles.hudBlock} aria-label="Лічильник прапорців">
        <span className={styles.hudIcon}>⚑</span>
        <span className={styles.hudValue}>{padNumber(flagsLeft)}</span>
      </div>

      <button className={styles.startBtn} onClick={onRestart} aria-label="Нова гра" title="Нова гра">
        {FACE_MAP[status]}
      </button>

      <div className={styles.hudBlock} aria-label="Таймер">
        <span className={styles.hudValue}>{padNumber(Math.min(time, MAX_HUD_VALUE))}</span>
        <span className={styles.hudIcon}>⏱</span>
      </div>
    </div>
  )
}

export default HUD
