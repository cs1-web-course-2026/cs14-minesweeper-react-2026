import { useEffect, useState } from 'react'
import styles from './Minesweeper.module.css'
import {
  CELL_STATE,
  CELL_TYPE,
  COLS,
  GAME_STATUS,
  MINES_COUNT,
  ROWS,
} from './constants'
import {
  cloneField,
  countFlags,
  generateField,
  openAllMines,
  openEmptyCells,
} from './utils'

function getCellLabel(cell, rowIndex, colIndex) {
  const position = `Row ${rowIndex + 1}, column ${colIndex + 1}`

  if (cell.state === CELL_STATE.CLOSED) {
    return `${position}, closed cell`
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return `${position}, flagged cell`
  }

  if (cell.type === CELL_TYPE.MINE && cell.isHit) {
    return `${position}, opened mine`
  }

  if (cell.type === CELL_TYPE.MINE) {
    return `${position}, mine`
  }

  if (cell.neighborMines > 0) {
    return `${position}, opened cell with ${cell.neighborMines} neighbouring mines`
  }

  return `${position}, empty opened cell`
}

function Cell({ cell, rowIndex, colIndex, onOpen, onFlag }) {
  const classNames = [styles.cell]

  if (cell.state === CELL_STATE.CLOSED) {
    classNames.push(styles.closed)
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    classNames.push(styles.closed, styles.flag)
  }

  if (cell.state === CELL_STATE.OPENED) {
    classNames.push(styles.open)

    if (cell.type === CELL_TYPE.MINE) {
      classNames.push(styles.mine)
    }

    if (cell.isHit) {
      classNames.push(styles.hit)
    }

    if (cell.neighborMines > 0) {
      classNames.push(styles[`n${cell.neighborMines}`])
    }
  }

  let content = ''

  if (
    cell.state === CELL_STATE.OPENED &&
    cell.type === CELL_TYPE.EMPTY &&
    cell.neighborMines > 0
  ) {
    content = cell.neighborMines
  }

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={onOpen}
      onContextMenu={onFlag}
      aria-label={getCellLabel(cell, rowIndex, colIndex)}
    >
      {content}
    </button>
  )
}

function Board({ field, onOpenCell, onToggleFlag }) {
  return (
    <section
      className={styles.board}
      style={{ gridTemplateColumns: `repeat(${COLS}, 28px)` }}
      aria-label="Minesweeper board"
    >
      {field.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            rowIndex={rowIndex}
            colIndex={colIndex}
            onOpen={() => onOpenCell(rowIndex, colIndex)}
            onFlag={(event) => {
              event.preventDefault()
              onToggleFlag(rowIndex, colIndex)
            }}
          />
        )),
      )}
    </section>
  )
}

function Header({ flagsLeft, seconds, status, onRestart }) {
  let emoji = '🙂'

  if (status === GAME_STATUS.WIN) {
    emoji = '😎'
  }

  if (status === GAME_STATUS.LOSE) {
    emoji = '😵'
  }

  return (
    <header className={styles.header}>
      <div className={styles.counter} aria-label="Flags left">
        {String(flagsLeft).padStart(3, '0')}
      </div>

      <button
        type="button"
        className={styles.smile}
        onClick={onRestart}
        aria-label="Restart game"
      >
        {emoji}
      </button>

      <div className={styles.counter} aria-label="Timer">
        {String(seconds).padStart(3, '0')}
      </div>
    </header>
  )
}

function GameStatus({ status }) {
  if (status === GAME_STATUS.WIN) {
    return (
      <p className={styles.status} role="status" aria-live="polite">
        Вітаю! Ви перемогли.
      </p>
    )
  }

  if (status === GAME_STATUS.LOSE) {
    return (
      <p className={styles.status} role="status" aria-live="polite">
        Гру завершено. Ви натиснули на міну.
      </p>
    )
  }

  return (
    <p className={styles.status} role="status" aria-live="polite">
      Гра триває.
    </p>
  )
}

function BilotserkovetsDanyloGame() {
  const [field, setField] = useState(() => generateField())
  const [status, setStatus] = useState(GAME_STATUS.PROCESS)
  const [seconds, setSeconds] = useState(0)
  const [openedCellsCount, setOpenedCellsCount] = useState(0)
  const [isTimerStarted, setIsTimerStarted] = useState(false)

  const flagsCount = countFlags(field)
  const flagsLeft = MINES_COUNT - flagsCount

  useEffect(() => {
    if (!isTimerStarted || status !== GAME_STATUS.PROCESS) {
      return undefined
    }

    const timerId = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [isTimerStarted, status])

  function restartGame() {
    setField(generateField())
    setStatus(GAME_STATUS.PROCESS)
    setSeconds(0)
    setOpenedCellsCount(0)
    setIsTimerStarted(false)
  }

  function handleOpenCell(row, col) {
    if (status !== GAME_STATUS.PROCESS) {
      return
    }

    const newField = cloneField(field)
    const cell = newField[row][col]

    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
      return
    }

    setIsTimerStarted(true)

    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.OPENED
      cell.isHit = true

      openAllMines(newField)

      setField(newField)
      setStatus(GAME_STATUS.LOSE)
      return
    }

    const openedNow = openEmptyCells(newField, row, col)
    const newOpenedCellsCount = openedCellsCount + openedNow
    const safeCellsCount = ROWS * COLS - MINES_COUNT

    setField(newField)
    setOpenedCellsCount(newOpenedCellsCount)

    if (newOpenedCellsCount === safeCellsCount) {
      setStatus(GAME_STATUS.WIN)
    }
  }

  function handleToggleFlag(row, col) {
    if (status !== GAME_STATUS.PROCESS) {
      return
    }

    const newField = cloneField(field)
    const cell = newField[row][col]

    if (cell.state === CELL_STATE.OPENED) {
      return
    }

    if (cell.state === CELL_STATE.CLOSED) {
      if (flagsCount >= MINES_COUNT) {
        return
      }

      cell.state = CELL_STATE.FLAGGED
    } else if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED
    }

    setField(newField)
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bilotserkovets Danylo Minesweeper</h1>

      <section className={styles.game}>
        <Header
          flagsLeft={flagsLeft}
          seconds={seconds}
          status={status}
          onRestart={restartGame}
        />

        <Board
          field={field}
          onOpenCell={handleOpenCell}
          onToggleFlag={handleToggleFlag}
        />

        <GameStatus status={status} />
      </section>
    </main>
  )
}

export default BilotserkovetsDanyloGame