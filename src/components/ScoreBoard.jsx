// src/components/Scoreboard.jsx

export default function Scoreboard({ players = [] }) {
  const sirali = [...players].sort((a, b) => b.puan - a.puan);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
      }}
    >
      <h3 style={{ marginBottom: "14px" }}>📊 Skor Tablosu</h3>

      {sirali.length === 0 && <div>Henüz oyuncu yok…</div>}

      {sirali.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div>
            <b>{p.ad}</b>
            {p.sonCevap && (
              <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                Son cevap:{" "}
                {p.sonCevap.dogruMu ? (
                  <span style={{ color: "#16a34a" }}>Doğru</span>
                ) : (
                  <span style={{ color: "#dc2626" }}>Yanlış</span>
                )}
              </div>
            )}
          </div>

          <div style={{ textAlign: "right", minWidth: 80 }}>
            <div>
              <b>{p.puan}</b> puan
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              ✔ {p.dogru} — ✖ {p.yanlis}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
