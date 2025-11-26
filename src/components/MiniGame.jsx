// src/components/MiniGame.jsx
import { useState, useEffect } from "react";

export default function MiniGame() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [score, setScore] = useState(0);

  // 🐥 Emoji'yi rastgele konuma kaçır
  const moveEmoji = () => {
    const newX = Math.random() * 300 + 40;
    const newY = Math.random() * 300 + 40;
    setPos({ x: newX, y: newY });
  };

  // 🐥 Tıklama olayı
  const handleClick = () => {
    setScore(score + 1);
    moveEmoji();
  };

  // İlk pozisyonu rastgele ayarla
  useEffect(() => {
    moveEmoji();
  }, []);

  return (
    <div style={kapsayici}>
      <h3 style={{ marginBottom: 10 }}>🎮 Mini Oyun: Emoji Yakala!</h3>
      <div style={{ marginBottom: 12, fontSize: "1.2rem" }}>
        Skor: <b>{score}</b>
      </div>

      <div style={oyunAlanı}>
        <div
          onClick={handleClick}
          style={{
            ...emoji,
            left: pos.x,
            top: pos.y,
          }}
        >
          🐥
        </div>
      </div>

      <p style={{ marginTop: 12, color: "#475569" }}>
        Öğretmen kural seçtiğinde oyun otomatik kapanır.
      </p>
    </div>
  );
}

// ---------------- STYLES -----------------
const kapsayici = {
  textAlign: "center",
  padding: 20,
  fontFamily: "Inter, sans-serif",
};

const oyunAlanı = {
  position: "relative",
  width: "100%",
  height: "350px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const emoji = {
  position: "absolute",
  fontSize: "2.4rem",
  cursor: "pointer",
  transition: "left 0.2s ease, top 0.2s ease",
};
