import { Link } from 'react-router-dom';
import styles from './Game.module.css';

export const implementations = [
  {
    id: 'repka-maksym',
    title: 'Minesweeper',
    author: 'Repka Maksym',
    path: '/repka-maksym',
    description: 'Компонентна React-версія гри Minesweeper з модульними стилями.',
  },
];

export default function GamePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>React lab</p>
        <h1 className={styles.title}>Minesweeper implementations</h1>
        <p className={styles.lead}>
          Перейдіть до власної версії гри або використайте цей список як точку входу до
          доступних реалізацій.
        </p>
      </section>

      <section className={styles.grid} aria-label="Список реалізацій гри">
        {implementations.map((implementation) => (
          <article key={implementation.id} className={styles.card}>
            <div>
              <p className={styles.cardLabel}>{implementation.author}</p>
              <h2 className={styles.cardTitle}>{implementation.title}</h2>
              <p className={styles.cardText}>{implementation.description}</p>
            </div>
            <Link className={styles.cardLink} to={implementation.path}>
              Відкрити гру
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}