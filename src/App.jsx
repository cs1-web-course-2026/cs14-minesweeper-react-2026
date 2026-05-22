import { Navigate, Route, Routes } from 'react-router-dom';
import GamePage from './pages/Game';
import RepkaMaksymGame from './pages/RepkaMaksym';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/repka-maksym" element={<RepkaMaksymGame />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}