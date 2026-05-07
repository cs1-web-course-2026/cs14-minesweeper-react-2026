import { Link } from 'react-router-dom';
import BesedinMaxymMinesweeper from '../BesedinMaxym';

export const implementations = [
  {
    name: 'Бесідін Максим — Minesweeper',
    path: '/besedin-maxym',
    Component: BesedinMaxymMinesweeper,
  },
];

export default function GamePage() {
  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#0d0d0d', color: '#e0e0e0' }}>
      <h1>Play Game</h1>
      <ul>
        {implementations.map(({ name, path }) => (
          <li key={path}>
            <Link style={{ color: '#00e676' }} to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
