import styles from './Game.module.css'

const STATUS_CLASS = {
  'Complete': styles.statusComplete,
  'In Progress': styles.statusInProgress,
  'Planning': styles.statusPlanning,
}

const DIFFICULTY_CLASS = {
  'Beginner': styles.difficultyBeginner,
  'Intermediate': styles.difficultyIntermediate,
  'Advanced': styles.difficultyAdvanced,
}

const CARD_STATUS_CLASS = {
  'Complete': styles.cardStatusComplete,
  'In Progress': styles.cardStatusInProgress,
  'Planning': styles.cardStatusPlanning,
}

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
    title: "Modern Glass Minesweeper",
    description: "A sleek, modern layout, with glassmorphism design and responsive layout, with timer, flagging, and win/lose detection.",
    author: "Alevtyna Kisilova-Cholariia",
    link: "/kisilova-cholariia-alevtyna",
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
  }
]

const getBadgeClass = (baseClass, typeClass) => [baseClass, typeClass].filter(Boolean).join(' ');

export default function Game() {
  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
        <div className={styles.instructions}>
          <p><strong>To add implementations:</strong> Edit the implementations array in the code</p>
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
              <a 
                href={impl.link} 
                className={styles.linkBtn}
                target={impl.link.startsWith('/') ? "_self" : "_blank"}
                rel={impl.link.startsWith('/') ? "" : "noopener noreferrer"}
              >
                View Implementation →
              </a>
            </div>
          </div>
        ))}
      </div>

      {implementations.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No implementations yet</h2>
          <p>Add implementations by editing the code</p>
        </div>
      )}
    </div>
  )
}