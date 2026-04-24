import styles from "../styles/RestartButton.module.css";

export default function RestartButton({ onRestart, face }) {
  return (
    <button className={styles.button} onClick={onRestart} type="button">
      {face}
    </button>
  );
}