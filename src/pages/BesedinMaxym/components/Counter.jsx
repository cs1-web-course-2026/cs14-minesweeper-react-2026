import styles from '../Minesweeper.module.css';

export default function Counter({ icon, value, title }) {
  const digits = String(Math.max(0, Math.min(value, 999))).padStart(3, '0').split('');

  return (
    <div className={styles.counter} title={title}>
      <span className={styles.counterIcon}>{icon}</span>
      <div className={styles.counterDigits}>
        {digits.map((digit, index) => (
          <span className={styles.digit} key={`${title}-${index}`}>{digit}</span>
        ))}
      </div>
    </div>
  );
}
