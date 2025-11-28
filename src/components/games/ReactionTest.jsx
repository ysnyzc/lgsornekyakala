// src/components/games/ReactionTest.jsx
import { useState } from "react";

export default function ReactionTest({ quit }) {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("Hazır mısın?");
  const [startTime, setStartTime] = useState(0);

  const start = () => {
    setMsg("Bekle...");
    const delay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      setReady(true);
      setStartTime(Date.now());
      setMsg("TIKLA!");
    }, delay);
  };

  const click = () => {
    if (!ready) {
      setMsg("Çok erken!");
      return;
    }

    const reaction = Date.now() - startTime;
    setMsg(`Tepki Süresi: ${reaction} ms`);
    setReady(false);
  };

  return (
    <div style={box} onClick={click}>
      <h3>{msg}</h3>
      <button style={btn} onClick={start}>
        Başlat
      </button>
      <button style={quitBtn} onClick={quit}>Çık</button>
    </div>
  );
}

const box = {
  padding: 20,
  width: 260,
  height: 180,
  background: "#fff",
  borderRadius: 16,
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const btn = {
  padding: "8px 14px",
  marginTop: 20,
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
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
