import styles from '../RepkaMaksym.module.css';

export function Timer({ value }) {
  return (
    <div className={styles.display} aria-label="Таймер">
      <span className={styles.displayLabel}>TIME</span>
      <span className={styles.displayValue}>{value}</span>
    </div>
  );
}