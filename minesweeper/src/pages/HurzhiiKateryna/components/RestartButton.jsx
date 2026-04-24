export default function RestartButton({ onRestart }) {
  return (
    <button 
      onClick={onRestart}
      style={{
        padding: '8px 20px',
        border: 'none',
        borderRadius: '20px',
        background: '#667eea',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
      }}
    >
      🔄 Нова гра
    </button>
  );
}