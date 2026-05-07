import { Navigate, Route, Routes } from 'react-router-dom';
import BesedinMaxymMinesweeper from './pages/BesedinMaxym';
import GamePage from './pages/Game';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/game" replace />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/besedin-maxym" element={<BesedinMaxymMinesweeper />} />
    </Routes>
  );
}
