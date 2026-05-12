import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import GameIndexPage, { implementations } from './pages/Game/index.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GameIndexPage />} />

      {implementations.map((impl) => (
        <Route key={impl.id} path={impl.path} element={impl.element} />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
