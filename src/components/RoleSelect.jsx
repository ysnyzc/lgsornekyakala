// src/pages/RoleSelect.jsx
import { useRoomContext } from "../context/RoomContext";

export default function RoleSelect() {
  const { chooseRole } = useRoomContext();

  return (
    <div style={kapsayici}>

      {/* ⭐ Banner */}
      <img
        src="/banner.png"
        alt="Türkçe Örnek Yakala Banner"
        style={banner}
      />

      {/* ⭐ Açıklama */}
      <div style={aciklama}>
        8. sınıf için hazırlanan bu oyunda öğretmen kuralları çeker,
        öğrenciler 16 kart içinden doğru örneği en hızlı şekilde bulmaya çalışır!
      </div>

      <h2 style={baslik}>Rol Seç</h2>

      {/* Öğretmen */}
      <button
        style={buton}
        onClick={() => chooseRole("teacher")}
      >
        👩‍🏫 Öğretmen
      </button>

      {/* Öğrenci */}
      <button
        style={buton}
        onClick={() => chooseRole("student")}
      >
        👨‍🎓 Öğrenci
      </button>
    </div>
  );
}

// ------------------ STYLES --------------------

const kapsayici = {
  padding: "20px",
  textAlign: "center",
  maxWidth: "600px",
  margin: "auto",
};

const banner = {
  width: "100%",
  maxWidth: "520px",
  borderRadius: "12px",
  marginBottom: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
};

const aciklama = {
  fontSize: "1rem",
  color: "#475569",
  marginBottom: "24px",
  lineHeight: 1.5,
};

const baslik = {
  fontSize: "1.6rem",
  marginBottom: "16px",
  fontWeight: 700,
};

const buton = {
  padding: "14px 22px",
  background: "rgb(30, 41, 59)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "1rem",
  marginTop: "10px",
  width: "200px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};
