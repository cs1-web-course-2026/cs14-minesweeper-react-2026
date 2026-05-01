import { Link } from 'react-router-dom';
import styles from './Game.module.css';
import { implementations } from './data';

const STATUS_CLASS = {
  'Complete': styles.statusComplete,
  'In Progress': styles.statusInProgress,
  'Planning': styles.statusPlanning,
};

const DIFFICULTY_CLASS = {
  'Beginner': styles.difficultyBeginner,
  'Intermediate': styles.difficultyIntermediate,
  'Advanced': styles.difficultyAdvanced,
};

const CARD_STATUS_CLASS = {
  'Complete': styles.cardStatusComplete,
  'In Progress': styles.cardStatusInProgress,
  'Planning': styles.cardStatusPlanning,
};

const getBadgeClass = (baseClass, typeClass) => [baseClass, typeClass].filter(Boolean).join(' ');

export default function Game() {
  const isInternalLink = (link) => link.startsWith('/');

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
        <div className={styles.instructions}>
          <p><strong>To add implementations:</strong> Edit the data.js file</p>
        </div>
      </div>

      <div className={styles.implementationsList}>
        {implementations.map((impl) => (
          <div
            key={impl.id}
            className={getBadgeClass(styles.implementationCard, CARD_STATUS_CLASS[impl.status])}
          >
            <div className={styles.cardHeader}>
              <h3>{impl.title}</h3>
              <div className={styles.badges}>
                <span className={getBadgeClass(styles.badge, STATUS_CLASS[impl.status])}>
                  {impl.status}
                </span>
                <span className={getBadgeClass(styles.badge, DIFFICULTY_CLASS[impl.difficulty])}>
                  {impl.difficulty}
                </span>
              </div>
            </div>
            <p className={styles.author}>by {impl.author}</p>
            <p className={styles.description}>{impl.description}</p>
            <div className={styles.cardActions}>
              {isInternalLink(impl.link) ? (
                <Link to={impl.link} className={styles.linkBtn}>
                  View Implementation →
                </Link>
              ) : (
                <a
                  href={impl.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtn}
                >
                  View Implementation →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {implementations.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No implementations yet</h2>
          <p>Add implementations by editing the data file</p>
        </div>
      )}
    </div>
  );
}