import React from 'react';
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
function Game() {
  // Add your implementations here by editing this array
  const implementations = [
    {
      id: 1,
      title: "Mock Minesweeper Game",
      description: "A fully functional minesweeper implementation with timer, flagging, and win/lose detection. This serves as an example for students.",
      author: "Example Implementation",
      link: "/mock-game",
      difficulty: "Beginner",
      status: "Complete"
    },
    {
      id: 2,
      title: "Basic Minesweeper",
      description: "A simple implementation with basic game mechanics",
      author: "Author Name",
      link: "#",
      difficulty: "Beginner",
      status: "Complete"
    },
    {
      id: 3,
      title: "Advanced Minesweeper",
      description: "Features timer, high scores, and custom difficulty",
      author: "Author name",
      link: "#",
      difficulty: "Intermediate",
      status: "In Progress"
    },
    {
      id: 4,
      title: "Minesweeper with Themes",
      description: "Multiple visual themes and sound effects",
      author: "Author name",
      link: "#",
      difficulty: "Advanced",
      status: "Planning"
    },
    {
      id: 5,
      title: "Mokh Nazar's Minesweeper",
      description: "A unique take on minesweeper with custom mechanics and design",
      author: "Mokh Nazar",
      link: "/mokh-nazar",
      difficulty: "Advanced",
      status: "Complete"
    },
    {
      id: 6,
      title: "Minesweeper",
      description: "A fully functional minesweeper implementation with timer, flagging, and win/lose detection.",
      author: "Hurzhii Kateryna",
      link: "/hurzhii-kateryna",
      difficulty: "Beginner",
      status: "Complete"
    }
  ]

const isInternalLink = (link) => link.startsWith('/');

export default function Game() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minesweeper Implementations</h1>
        <p className={styles.subtitle}>Explore different versions of the classic game</p>
      </header>

      <div className={styles.grid}>
        {implementations.map((impl) => (
          <div key={impl.id} className={getBadgeClass(styles.card, CARD_STATUS_CLASS[impl.status])}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{impl.title}</h2>
              <span className={getBadgeClass(styles.badge, STATUS_CLASS[impl.status])}>
                {impl.status}
              </span>
            </div>
            
            <p className={styles.description}>{impl.description}</p>
            
            <div className={styles.meta}>
              <span className={getBadgeClass(styles.difficulty, DIFFICULTY_CLASS[impl.difficulty])}>
                {impl.difficulty}
              </span>
              <span className={styles.author}>by {impl.author}</span>
            </div>

            {isInternalLink(impl.link) ? (
              <Link to={impl.link} className={styles.button}>Play Now</Link>
            ) : (
              <a href={impl.link} target="_blank" rel="noopener noreferrer" className={styles.button}>
                View on GitHub
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}