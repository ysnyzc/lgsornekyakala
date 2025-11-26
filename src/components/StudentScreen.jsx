// src/components/StudentScreen.jsx
import { useState, useEffect, useRef } from "react";
import { useRoomContext } from "../context/RoomContext";
import { supabase } from "../supabase/client";
import MiniGame from "./MiniGame";  // 🎮 MINI GAME EKLENDİ

export default function StudentScreen() {
  const {
    roomCode,
    joinRoom,
    currentRule,
    sendAnswer,
    studentName,
  } = useRoomContext();

  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const [selectedCard, setSelectedCard] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [lives, setLives] = useState(6);

  // ============================
  // 🎧 SES
  // ============================
  const dogruSes = useRef(null);
  const yanlisSes = useRef(null);

  useEffect(() => {
    dogruSes.current = new Audio("/dogru.wav");
    yanlisSes.current = new Audio("/yanlis.mp3");

    const unlockAudio = () => {
      dogruSes.current.play().catch(() => {});
      yanlisSes.current.play().catch(() => {});
      dogruSes.current.pause();
      yanlisSes.current.pause();
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  // ============================
  // RESET KURAL
  // ============================
  useEffect(() => {
    if (currentRule) {
      setSelectedCard(null);
      setHasAnswered(false);
      setTimeLeft(60);
      setAttemptsLeft(2);
    }
  }, [currentRule]);

  // ============================
  // ⏱ Sayaç
  // ============================
  useEffect(() => {
    if (!currentRule) return;
    if (timeLeft <= 0) return;

    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, currentRule]);

  // ============================
  // 🔥 süre bitti → öğretmen doğruyu yayınlar
  // ============================
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase.channel(roomCode);
    channel.on("broadcast", { event: "sure_bitti" }, (msg) => {
      const dogruKart = msg.payload;
      setSelectedCard(dogruKart);
      setHasAnswered(true);
    });

    channel.subscribe();
  }, [roomCode]);

  // ==================================
  // GİRİŞ EKRANI
  // ==================================
  if (!studentName || !roomCode) {
    return (
      <div style={girisKapsayici}>
        <h2 style={{ marginBottom: 20 }}>🎓 Öğrenci Girişi</h2>

        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Adınızı yazın"
          style={input}
        />

        <input
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Oda Kodu"
          style={input}
        />

        <button
          style={buton}
          onClick={() => {
            if (!nameInput || !roomInput) return;
            joinRoom(roomInput, nameInput);
          }}
        >
          Odaya Katıl
        </button>
      </div>
    );
  }

  // ==================================
  // BEKLEME — 🎮 MINI GAME EKLENMİŞ HALİ
  // ==================================
  if (!currentRule) {
    return (
      <div style={beklemeEkrani}>
        <h2 style={{ marginBottom: 10 }}>⏳ Öğretmeni bekliyorsunuz…</h2>
        <div>Oda: {roomCode}</div>
        <div>Adınız: {studentName}</div>

        {/* 🎮 MİNİ OYUN */}
        <div style={{ marginTop: 20 }}>
          <MiniGame />
        </div>
      </div>
    );
  }

  // ==================================
  // KART SEÇME
  // ==================================
  const kartSec = (kart) => {
    if (lives <= 0) return;
    if (attemptsLeft <= 0) return;
    if (hasAnswered) return;

    setSelectedCard(kart);
    sendAnswer(kart);

    if (kart.dogruMu) {
      dogruSes.current?.play();
      setHasAnswered(true);
      return;
    }

    yanlisSes.current?.play();
    setAttemptsLeft(attemptsLeft - 1);
    setLives(lives - 1);

    if (attemptsLeft - 1 <= 0) setHasAnswered(true);
  };

  // ==================================
  // PROGRESS %
  // ==================================
  const progressPercent = (timeLeft / 60) * 100;

  return (
    <div style={kapsayici}>
      <h2 style={baslik}>🎯 Kural</h2>
      <div style={kuralBox}>{currentRule.kural}</div>

      {/* Progress Bar */}
      <div style={progressBarContainer}>
        <div
          style={{
            ...progressBarFill,
            width: `${progressPercent}%`,
          }}
        />
      </div>

      <div style={sayaç}>⏱ {timeLeft} sn</div>

      {/* Kalpler */}
      <div style={kalpKutu}>
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i} style={kalp}>❤️</span>
        ))}
      </div>

      <div style={hakText}>Kalan Cevap Hakkı: {attemptsLeft}</div>

      {/* Kartlar */}
      <div style={kartGrid}>
        {currentRule.kartlar.map((kart) => {
          const disabled = attemptsLeft <= 0 || lives <= 0;
          const isSelected = selectedCard?.id === kart.id;

          let stil = {
            ...kartKutu,
            opacity: disabled ? 0.5 : 1,
            transform: isSelected ? "scale(1.06)" : "scale(1)",
            background: "#fff5ff",
            border: "3px solid transparent",
            transition: "0.25s",
          };

          if (isSelected && hasAnswered) {
            stil = {
              ...stil,
              background: kart.dogruMu ? "#d1fadd" : "#ffd4d4",
              border: kart.dogruMu
                ? "3px solid #22c55e"
                : "3px solid #ef4444",
              animation: kart.dogruMu ? "pop 0.4s ease" : "shake 0.4s ease",
            };
          }

          return (
            <div key={kart.id} style={stil} onClick={() => kartSec(kart)}>
              {kart.metin}
            </div>
          );
        })}
      </div>

      {/* ANİMASYON KEYFRAMES */}
      <style>
        {`
        @keyframes pop {
          0% { transform: scale(0.9); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes shake {
          0% { transform: translateX(0px); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0px); }
        }
      `}
      </style>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const kapsayici = {
  padding: 20,
  fontFamily: "Poppins, Inter, sans-serif",
  maxWidth: 950,
  margin: "auto",
  background: "linear-gradient(135deg, #ffe8f5, #e3f8ff, #f3e8ff)",
  backgroundSize: "300% 300%",
  animation: "bgmove 12s ease infinite",
  minHeight: "100vh",
  borderRadius: 20,
};

const baslik = {
  fontSize: "1.8rem",
  fontWeight: 800,
  color: "#8B3FFC",
};

const kuralBox = {
  background: "#ffffffaa",
  padding: "14px",
  borderRadius: "14px",
  marginBottom: "16px",
  border: "2px solid #f3d1ff",
  backdropFilter: "blur(4px)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const progressBarContainer = {
  width: "100%",
  height: "12px",
  background: "#f1d4ff",
  borderRadius: "10px",
  marginBottom: "14px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg, #8B5CF6, #F472B6)",
  transition: "width 0.4s linear",
};

const sayaç = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "#7e22ce",
  textAlign: "center",
  marginBottom: 12,
};

const kalpKutu = {
  textAlign: "center",
  marginBottom: 12,
};

const kalp = {
  fontSize: "2rem",
  filter: "drop-shadow(0 0 4px red)",
  marginRight: 4,
};

const hakText = {
  marginBottom: 20,
  fontWeight: 700,
  color: "#8B3FFC",
  textAlign: "center",
};

const kartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "14px",
};

const kartKutu = {
  padding: "16px",
  background: "white",
  borderRadius: "18px",
  border: "2px solid #f0caff",
  cursor: "pointer",
  lineHeight: 1.4,
  fontWeight: 600,
  color: "#4b0082",
  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  userSelect: "none",
};

// --- Giriş ekranı ---
const girisKapsayici = {
  padding: "40px",
  textAlign: "center",
};

const input = {
  width: "250px",
  padding: "12px",
  borderRadius: "12px",
  border: "2px solid #e2e2ff",
  margin: "8px",
  fontSize: "1rem",
  background: "#ffffffcc",
};

const buton = {
  padding: "12px 18px",
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginTop: "18px",
  fontWeight: 700,
  width: "200px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
};

const beklemeEkrani = {
  padding: "40px",
  textAlign: "center",
  fontSize: "1.2rem",
};
