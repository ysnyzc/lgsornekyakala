// src/components/games/QuickMath.jsx
import { useState } from "react";

export default function QuickMath({ quit }) {
  const a = Math.floor(Math.random() * 20);
  const b = Math.floor(Math.random() * 20);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");

  const check = () => {
    if (parseInt(input) === a + b) setMsg("🎉 Doğru!");
    else setMsg("❌ Yanlış!");
  };

  return (
    <div style={box}>
      <h3>Hesapla:</h3>
      <p style={{ fontSize: "1.4rem" }}>
        {a} + {b} = ?
      </p>

      <input
        style={inp}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button style={btn} onClick={check}>Kontrol Et</button>

      <div style={{ marginTop: 10, fontSize: "1.2rem" }}>{msg}</div>

      <button style={quitBtn} onClick={quit}>Çık</button>
    </div>
  );
}

const box = {
  padding: 20,
  width: 260,
  background: "#fff",
  borderRadius: 16,
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const inp = {
  width: "90%",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #ddd",
};
const btn = {
  marginTop: 10,
  padding: "8px 14px",
  borderRadius: 8,
  background: "#38bdf8",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
const quitBtn = {
  marginTop: 12,
  padding: "6px 12px",
  borderRadius: 8,
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
  border: "none",
};
