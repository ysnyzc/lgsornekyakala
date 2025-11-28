// src/components/MiniGameMenu.jsx
export default function MiniGameMenu({ setActiveGame }) {
  return (
    <div style={menuBox}>
      <h3 style={{ marginBottom: 15 }}>🎮 Mini Oyun Menüsü</h3>

      <button style={btn} onClick={() => setActiveGame("emoji")}>
        😀 Emoji Yakalama
      </button>

      <button style={btn} onClick={() => setActiveGame("word")}>
        🔤 Kelime Avı
      </button>

      <button style={btn} onClick={() => setActiveGame("reaction")}>
        ⚡ Tepki Testi
      </button>

      <button style={btn} onClick={() => setActiveGame("math")}>
        ➕ Hızlı Matematik
      </button>
    </div>
  );
}

const menuBox = {
  padding: 20,
  background: "#fff",
  borderRadius: 14,
  width: 240,
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};

const btn = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  marginBottom: 10,
  background: "#6366f1",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer",
  border: "none",
  fontWeight: 600,
};
