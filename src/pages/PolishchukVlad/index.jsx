import { useState, useEffect, useCallback } from 'react'
import {
  generateField,
  openCell,
  toggleFlag,
  countFlags,
  GAME_STATUS,
  DEFAULT_ROWS,
  DEFAULT_COLS,
  DEFAULT_MINES_COUNT,
} from './utils/gameLogic'
import HUD from './components/HUD'
import Board from './components/Board'
import styles from './MinesweeperGame.module.css'

const TIMER_TICK_MS = 1000

function MinesweeperGame() {
  const [field, setField] = useState(() =>
    generateField(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES_COUNT)
  )
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PROCESS)
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PROCESS) return
    const timerId = setInterval(() => setGameTime(time => time + 1), TIMER_TICK_MS)
    return () => clearInterval(timerId)
  }, [gameStatus])

  const handleRestart = useCallback(() => {
    setField(generateField(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES_COUNT))
    setGameStatus(GAME_STATUS.PROCESS)
    setGameTime(0)
  }, [])

  const handleCellClick = useCallback((row, col) => {
    if (gameStatus !== GAME_STATUS.PROCESS) return
    const { grid, status } = openCell(field, row, col, DEFAULT_ROWS, DEFAULT_COLS)
    if (status === null) return
    setField(grid)
    setGameStatus(status)
  }, [field, gameStatus])

  const handleCellFlag = useCallback((row, col) => {
    if (gameStatus !== GAME_STATUS.PROCESS) return
    setField(prevField => toggleFlag(prevField, row, col))
  }, [gameStatus])

  const flagsLeft = DEFAULT_MINES_COUNT - countFlags(field)

  return (
    <div className={styles.wrapper}>
      <HUD
        flagsLeft={flagsLeft}
        time={gameTime}
        status={gameStatus}
        onRestart={handleRestart}
      />
      <Board
        field={field}
        onCellClick={handleCellClick}
        onCellFlag={handleCellFlag}
      />
    </div>
  )
}

export default MinesweeperGame
