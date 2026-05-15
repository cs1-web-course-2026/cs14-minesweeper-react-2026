import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import Minesweeper from './pages/Kisilova-CholariiaAlevtyna/Minesweeper';
import MokhNazarGame from './pages/MokhNazar';
import MockGame from './pages/MockGame'
import KvitkaAlinaGame from "./pages/KvitkaAlina";
import PolivanovDanyloGame from "./pages/PolivanovDanylo";
import HurzhiiKateryna from './pages/HurzhiiKateryna'
import YasinskaAnastasiiaGame from './pages/YasinskaAnastasiia'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="kisilova-cholariia-alevtyna" element={<Minesweeper />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="hurzhii-kateryna" element={<HurzhiiKateryna />} />
        <Route path="kvitka-alina" element={<KvitkaAlinaGame />} />
        <Route path="polivanov-danylo" element={<PolivanovDanyloGame />} />
        <Route path="yasinska-anastasiia" element={<YasinskaAnastasiiaGame />} />
      </Route>
    </Routes>
  )
}

export default App
