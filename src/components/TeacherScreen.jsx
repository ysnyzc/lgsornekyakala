// src/components/TeacherScreen.jsx
import { useRoomContext } from "../context/RoomContext";
import { useEffect } from "react";

export default function TeacherScreen() {
  const {
    roomCode,
    topicData,
    currentRule,
    chooseRule,
    students,
    timer,
    setTimer,
    setCurrentRule,   // ⭐ Ekledik (reset için gerekli)
    broadcastTimeUp,  // ⭐ Öğrencilere doğru kartı yayınlamak için
  } = useRoomContext();

  // =============================
  // 🧠 SÜRE SAYACI
  // =============================
  useEffect(() => {
    let t;
    if (currentRule && timer > 0) {
      t = setTimeout(() => setTimer(timer - 1), 1000);
    }

    // ⭐ SÜRE BİTTİ → doğruyu yayınla + reset yap
    if (currentRule && timer === 0) {
      // Öğrencilere doğru cevap yayınla
      broadcastTimeUp(currentRule.dogruKart);

      // Öğretmen ekranını sıfırla
      setTimeout(() => {
        setCurrentRule(null);  // yeni kural çekilebilir
        setTimer(60);          // yeni tur süresi
      }, 500);
    }

    return () => clearTimeout(t);
  }, [timer, currentRule]);


  // =============================
  // VERİ YOKSA
  // =============================
  if (!topicData) {
    return <div style={{ padding: 40 }}>Konu yüklenmedi.</div>;
  }


  // =============================
  // 🎯 RASTGELE KURAL SEÇ
  // =============================
  const rastgeleKuralSec = () => {
    const liste = topicData.liste;
    const randomIndex = Math.floor(Math.random() * liste.length);
    const secilen = liste[randomIndex];

    // Kartlara doğru etiketi eklenmiş halde gelir
    chooseRule(secilen);
    setTimer(60);  // Yeni tur başlasın
  };


  // =============================
  // RENDER
  // =============================
  return (
    <div style={kapsayici}>

      {/* ÜST BAŞLIK */}
      <div style={header}>
        <h2 style={title}>👩‍🏫 Öğretmen Paneli</h2>
      </div>

      {/* ODA + BUTON */}
      <div style={odaKutu}>
        <div>
          <div style={odaLabel}>Oda Kodu</div>
          <div style={odaKod}>{roomCode}</div>
        </div>

        {/* ⭐ Yeni kural seçilebilir */}
        {!currentRule && (
          <button onClick={rastgeleKuralSec} style={kuralButon}>
            🎯 Yeni Kural Başlat
          </button>
        )}
      </div>


      {/* SÜRE + KURAL */}
      {currentRule && (
        <>
          <div style={sureKutu}>
            <span style={sureBaslik}>⏱ Kalan Süre:</span>
            <span style={sureDeger}>{timer} sn</span>
          </div>

          <div style={kuralCard}>
            <h3 style={kuralBaslik}>📌 Kural</h3>
            <p style={kuralMetin}>{currentRule.kural}</p>
          </div>
        </>
      )}


      {/* ÖĞRENCİ TABLOSU */}
      <h3 style={listBaslik}>👥 Öğrenci Durumu</h3>

      <div style={tablo}>
        <div style={tabloHeader}>
          <div>Ad</div>
          <div>Can</div>
          <div>D/Y</div>
          <div>Puan</div>
        </div>

        {students.map((s) => (
          <div key={s.id} style={tabloSatir}>
            <div style={ogrAd}>{s.name}</div>

            <div>
              {Array.from({ length: s.lives }).map((_, i) => (
                <span key={i} style={{ color: "#ef4444" }}>❤️</span>
              ))}
            </div>

            <div>
              ✔ {s.correct} / ❌ {s.wrong}
            </div>

            <div style={puan}>{s.score} P</div>
          </div>
        ))}
      </div>

    </div>
  );
}


// ------------------------
// STYLES (MODERN DASHBOARD)
// ------------------------

const kapsayici = {
  padding: "20px",
  fontFamily: "Inter, sans-serif",
  maxWidth: "880px",
  margin: "auto",
  color: "#1e293b",
};

const header = {
  marginBottom: "20px",
};

const title = {
  fontSize: "1.9rem",
  fontWeight: "700",
  color: "#0f172a",
};

const odaKutu = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "18px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const odaLabel = {
  fontSize: "0.9rem",
  color: "#64748b",
};

const odaKod = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1e3a8a",
};

const kuralButon = {
  padding: "12px 20px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
};

const sureKutu = {
  background: "#eef2ff",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #c7d2fe",
  marginBottom: "20px",
  fontSize: "1.2rem",
  display: "flex",
  justifyContent: "space-between",
};

const sureBaslik = {
  fontWeight: "600",
  color: "#4338ca",
};

const sureDeger = {
  fontWeight: "700",
  color: "#1e40af",
};

const kuralCard = {
  background: "white",
  border: "1px solid #e2e8f0",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "24px",
};

const kuralBaslik = {
  marginBottom: "8px",
  fontSize: "1.1rem",
  fontWeight: "700",
};

const kuralMetin = {
  fontSize: "1rem",
  lineHeight: 1.5,
};

const listBaslik = {
  fontSize: "1.35rem",
  fontWeight: "700",
  marginBottom: "12px",
};

const tablo = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const tabloHeader = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  background: "#e2e8f0",
  padding: "10px",
  borderRadius: "10px",
  fontWeight: "600",
};

const tabloSatir = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "12px 10px",
  borderRadius: "10px",
  alignItems: "center",
};

const ogrAd = { fontWeight: "600" };

const puan = {
  background: "#dbeafe",
  padding: "4px 10px",
  borderRadius: "6px",
  fontWeight: "700",
  textAlign: "center",
};
