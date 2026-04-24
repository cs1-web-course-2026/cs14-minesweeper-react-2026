import { Routes, Route } from 'react-router-dom'
import HurzhiiKateryna from './pages/HurzhiiKateryna'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/hurzhii-kateryna" element={<HurzhiiKateryna />} />
      <Route path="/game" element={<HurzhiiKateryna />} />
    </Routes>
  )
}

export default App