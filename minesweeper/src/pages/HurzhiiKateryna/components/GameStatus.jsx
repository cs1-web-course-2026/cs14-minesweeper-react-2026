export default function GameStatus({ status }) {
  if (status === "playing") return <h3>Гра триває</h3>;
  if (status === "won") return <h3>🎉 Перемога</h3>;
  return <h3>💣 Поразка</h3>;
}