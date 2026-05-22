import styles from '../RepkaMaksym.module.css';

export function RestartButton({ label, onClick }) {
  return (
    <button type="button" className={styles.restartButton} onClick={onClick} aria-label="Почати нову гру">
      {label}
    </button>
  );
}