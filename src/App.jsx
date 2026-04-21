import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import Minesweeper from './pages/Kisilova-CholariiaAlevtyna/Minesweeper';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="kisilova-cholariia-alevtyna" element={<Minesweeper />} />
      </Route>
    </Routes>
  )
}

export default App
