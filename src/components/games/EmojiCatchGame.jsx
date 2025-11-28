// src/components/games/EmojiCatchGame.jsx
import { useState, useEffect } from "react";

const EMOJIS = ["😀", "😎", "🤩", "😄", "🧐", "🥳"];

export default function EmojiCatchGame({ quit }) {
  const [emoji, setEmoji] = useState("😀");
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
      setPos({
        x: Math.random() * 80,
        y: Math.random() * 60,
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={box}>
      <div style={{ marginBottom: 10 }}>
        <b>Puan:</b> {score}
      </div>

      <div
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          fontSize: "2.5rem",
          cursor: "pointer",
        }}
        onClick={() => setScore(score + 1)}
      >
        {emoji}
      </div>

      <button style={quitBtn} onClick={quit}>Çık</button>
    </div>
  );
}

const box = {
  position: "relative",
  width: 300,
  height: 200,
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const quitBtn = {
  marginTop: 140,
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};
