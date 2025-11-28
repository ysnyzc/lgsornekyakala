// src/components/TeacherScreen.jsx
import { useRoomContext } from "../context/RoomContext";
import { useEffect } from "react";
import { supabase } from "../supabase/client";

export default function TeacherScreen() {
  const {
    roomCode,
    topicData,
    currentRule,
    chooseRule,
    students,
    timer,
    setTimer,
    setCurrentRule,
  } = useRoomContext();

  // =============================
  // ⏱ SÜRE SAYACI VE YAYIN
  // =============================
  useEffect(() => {
    let t;

    if (currentRule && timer > 0) {
      t = setTimeout(() => setTimer(timer - 1), 1000);
    }

    if (currentRule && timer === 0) {
      if (!supabase || !roomCode) {
        console.error("Supabase veya roomCode eksik!");
        setCurrentRule(null);
        setTimer(60);
        return;
      }

      const dogruCevap = {
        metin: currentRule.ornek || currentRule.dogruOrnek || currentRule.kural,
        kart: currentRule.kartlar?.find((k) => k.dogruMu),
      };

      supabase
        .channel(roomCode)
        .httpSend({
          type: "broadcast",
          event: "sure_bitti",
          payload: dogruCevap,
        });

      setTimeout(() => {
        setCurrentRule(null);
        setTimer(60);
      }, 500);
    }

    return () => clearTimeout(t);
  }, [timer, currentRule, roomCode, setTimer, setCurrentRule]);

  if (!topicData) {
    return <div style={{ padding: 40 }}>Konu yüklenmedi.</div>;
  }

  // =============================
  // 🎯 RASTGELE KURAL
  // =============================
  const rastgeleKuralSec = () => {
    const liste = topicData.liste;
    const secilen = liste[Math.floor(Math.random() * liste.length)];

    chooseRule(secilen);
    setTimer(60);
  };

  // =============================
  // ⭐ ÖĞRENCİLERİ SIRALA
  // =============================
  const siraliStudents = [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correct !== a.correct) return b.correct - a.correct;
    if (a.wrong !== b.wrong) return a.wrong - b.wrong;
    return a.name.localeCompare(b.name);
  });

  const birinci = siraliStudents[0]?.id;
  const ikinci = siraliStudents[1]?.id;
  const ucuncu = siraliStudents[2]?.id;

  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div style={page}>
      <div style={header}>
        <h2 style={title}>👩‍🏫 Öğretmen Paneli</h2>
      </div>

      <div style={roomCard}>
        <div>
          <div style={roomLabel}>Oda Kodu</div>
          <div style={roomCodeStyle}>{roomCode}</div>
        </div>

        {!currentRule && (
          <button style={ruleBtn} onClick={rastgeleKuralSec}>
            🎯 Yeni Kural Başlat
          </button>
        )}
      </div>

      {currentRule && (
        <div style={timerBarContainer}>
          <div
            style={{
              ...timerBarFill,
              width: `${(timer / 60) * 100}%`,
            }}
          />
        </div>
      )}

      {currentRule && (
        <>
          <div style={timerCard}>
            ⏱ <b>{timer}</b> saniye
          </div>

          <div style={ruleCard}>
            <h3 style={ruleHeader}>📌 Kural</h3>
            <p style={ruleText}>{currentRule.kural}</p>
          </div>
        </>
      )}

      {/* ÖĞRENCİ TABLOSU */}
      <h3 style={studentsHeader}>👥 Öğrenciler</h3>

      <div style={table}>
        <div style={tableHead}>
          <div>Öğrenci</div>
          <div>Can</div>
          <div>D/Y</div>
          <div>Puan</div>
        </div>

        {/* ⭐ SIRALANMIŞ ÖĞRENCİLER */}
        {siraliStudents.map((s) => {
          const rank =
            s.id === birinci ? 1 : s.id === ikinci ? 2 : s.id === ucuncu ? 3 : null;

          return (
            <div
              key={s.id}
              style={{
                ...tableRow,
                background:
                  rank === 1
                    ? "#fff7c2"
                    : rank === 2
                    ? "#f4f4f7"
                    : rank === 3
                    ? "#fde6c8"
                    : "white",
                border:
                  rank === 1
                    ? "2px solid #facc15"
                    : rank === 2
                    ? "2px solid #cbd5e1"
                    : rank === 3
                    ? "2px solid #d97706"
                    : "1px solid #e2e8f0",
                position: "relative",
              }}
            >
              {/* 🥇 🥈 🥉 Madalya */}
              {rank && (
                <div
                  style={{
                    position: "absolute",
                    left: "-38px",
                    fontSize: "2.4rem",
                  }}
                >
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </div>
              )}

              <div style={nameCell}>
                <span style={avatar}>{s.name[0].toUpperCase()}</span>
                {s.name}
              </div>

              <div>
                {Array.from({ length: s.lives }).map((_, i) => (
                  <span key={i} style={{ color: "#ef4444" }}>
                    ❤️
                  </span>
                ))}
              </div>

              <div>
                ✔ {s.correct} / ❌ {s.wrong}
              </div>

              <div style={scoreBadge}>{s.score} P</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================
// 🎨 TASARIM (STYLES)
// =====================================================
const page = {
  padding: "24px",
  fontFamily: "Inter, sans-serif",
  maxWidth: "900px",
  margin: "auto",
};

const header = { marginBottom: "12px" };

const title = {
  fontSize: "2rem",
  fontWeight: 800,
};

const roomCard = {
  background: "white",
  border: "1px solid #e2e8f0",
  padding: "18px",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const roomLabel = { fontSize: "0.9rem", color: "#64748b" };

const roomCodeStyle = {
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "#1e3a8a",
  letterSpacing: "2px",
};

const ruleBtn = {
  padding: "12px 20px",
  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
};

const timerBarContainer = {
  width: "100%",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 12,
};

const timerBarFill = {
  height: "100%",
  background: "linear-gradient(90deg, #10b981, #22d3ee)",
  transition: "width 0.4s linear",
};

const timerCard = {
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  padding: "14px",
  fontSize: "1.2rem",
  borderRadius: "12px",
  marginBottom: "16px",
};

const ruleCard = {
  background: "white",
  border: "1px solid #e2e8f0",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "24px",
};

const ruleHeader = {
  marginBottom: "8px",
  fontSize: "1.2rem",
  fontWeight: 700,
};

const ruleText = { fontSize: "1.05rem", lineHeight: 1.6 };

const studentsHeader = {
  fontSize: "1.4rem",
  fontWeight: 800,
  marginBottom: 12,
};

const table = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const tableHead = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  padding: "12px",
  background: "#f1f5f9",
  borderRadius: "10px",
  fontWeight: 600,
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  padding: "14px",
  background: "white",
  borderRadius: "12px",
  alignItems: "center",
};

const nameCell = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
};

const avatar = {
  width: "32px",
  height: "32px",
  background: "#c7d2fe",
  color: "#312e81",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const scoreBadge = {
  background: "#dbeafe",
  padding: "4px 12px",
  borderRadius: "8px",
  fontWeight: 700,
  textAlign: "center",
};
