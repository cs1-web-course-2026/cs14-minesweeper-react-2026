import styles from '../RepkaMaksym.module.css';

export function GameStatus({ status, message }) {
  return (
    <section className={styles.status} aria-live="polite">
      <span className={styles.statusBadge} data-status={status}>
        {status === 'win' ? 'WIN' : status === 'lose' ? 'LOSE' : 'PLAY'}
      </span>
      <p className={styles.statusText}>{message}</p>
    </section>
  );
}