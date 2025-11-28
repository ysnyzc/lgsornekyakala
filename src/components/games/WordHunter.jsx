// src/components/games/WordHunter.jsx
import { useState } from "react";

const WORDS = ["masa", "kalem", "kitap", "yol", "deniz", "bulut"];

export default function WordHunter({ quit }) {
  const [target] = useState(
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");

  const check = () => {
    if (input.toLowerCase() === target) {
      setMsg("🎉 Doğru!");
    } else {
      setMsg("❌ Yanlış!");
    }
  };

  return (
    <div style={box}>
      <h3>Kelimeyi Tahmin Et</h3>
      <p>İpucu: {target.length} harf</p>

      <input
        style={inp}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button style={btn} onClick={check}>
        Kontrol Et
      </button>

      <div style={{ marginTop: 10, fontSize: "1.2rem" }}>{msg}</div>

      <button style={quitBtn} onClick={quit}>Çık</button>
    </div>
  );
}

const box = {
  padding: 20,
  width: 260,
  background: "#fff",
  borderRadius: 14,
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};

const inp = {
  width: "90%",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 10,
};
const btn = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#6366f1",
  color: "#fff",
  cursor: "pointer",
};
const quitBtn = {
  marginTop: 10,
  padding: "6px 12px",
  borderRadius: 8,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
