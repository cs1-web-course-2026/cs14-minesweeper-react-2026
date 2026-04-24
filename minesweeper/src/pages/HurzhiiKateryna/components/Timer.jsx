import { useEffect, useState } from 'react';

export default function Timer({ gameOver, resetKey }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
  }, [resetKey]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  return (
    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#555' }}>
      <span style={{ fontSize: '13px', color: '#777' }}>⏱ Time:</span> {time}s
    </div>
  );
}