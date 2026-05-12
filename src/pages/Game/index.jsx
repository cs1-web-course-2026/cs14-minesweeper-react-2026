import React from 'react';
import { Link } from 'react-router-dom';

import PolivanovDanyloGame from '../PolivanovDanylo/index.jsx';

export const implementations = [
  {
    id: 'polivanov-danylo',
    title: 'Polivanov Danylo',
    path: '/polivanov-danylo',
    element: <PolivanovDanyloGame />,
  },
];

export default function GameIndexPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: '0 0 12px' }}>Minesweeper implementations</h1>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {implementations.map((impl) => (
          <li key={impl.id}>
            <Link to={impl.path}>{impl.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
