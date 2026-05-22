import React from 'react';

const GameOverOverlay = ({ status }) => {
  if (status === 'playing') return null;

  const isWon = status === 'won';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: isWon ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '10px 20px', borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        color: isWon ? '#27ae60' : '#c0392b',
        fontSize: '24px', fontWeight: 'bold'
      }}>
        {isWon ? 'Victory! 🎉' : 'Game Over 💀'}
      </div>
    </div>
  );
};

export default GameOverOverlay;