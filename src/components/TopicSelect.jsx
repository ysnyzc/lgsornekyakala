// src/components/TopicSelect.jsx
import { useRoomContext } from "../context/RoomContext";
import { veriSetleri } from "../data/veriSetleri";

export default function TopicSelect() {
  const { chooseTopic, gradeLevel } = useRoomContext();

  const emptyMessage = (
    <div style={{ marginTop: 20, fontSize: "1.2rem", color: "#555" }}>
      Bu sınıf için konular yakında eklenecek.
    </div>
  );

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h2 style={{ fontSize: "1.6rem", marginBottom: "30px" }}>
        Konu Seçin
      </h2>

      {/* Sınıf içerik kontrolü */}
      {gradeLevel !== 8 && emptyMessage}

      {gradeLevel === 8 &&
        Object.keys(veriSetleri).map((key) => (
          <button
            key={key}
            onClick={() => chooseTopic(key, veriSetleri[key])}
            style={buttonStyle}
          >
            {veriSetleri[key].ad}
          </button>
        ))}
    </div>
  );
}

const buttonStyle = {
  padding: "14px 22px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "1rem",
  width: "100%",
  margin: "10px auto",
  display: "block",
  fontWeight: 600,
};
