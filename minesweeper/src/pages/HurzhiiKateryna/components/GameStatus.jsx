const GAME_STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

export default function GameStatus({ status }) {
  const getStatusStyle = () => {
    switch (status) {
      case GAME_STATUS.WON:
        return { background: '#fff3e0', color: '#f57c00' };
      case GAME_STATUS.LOST:
        return { background: '#ffebee', color: '#c62828' };
      default:
        return { background: '#e8f5e9', color: '#2e7d32' };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case GAME_STATUS.WON:
        return 'Ви виграли! 🎉';
      case GAME_STATUS.LOST:
        return 'Ви програли! 💣';
      default:
        return '🙂 Граємо';
    }
  };

  return (
    <div style={{
      ...getStatusStyle(),
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '10px 0',
      padding: '8px 16px',
      borderRadius: '8px',
    }}>
      {getStatusText()}
    </div>
  );
}