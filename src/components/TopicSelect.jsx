// src/components/TopicSelect.jsx
import { useRoomContext } from "../context/RoomContext";
import { veriSetleri } from "../data/veriSetleri";

export default function TopicSelect() {
  const { chooseTopic } = useRoomContext();

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

      {Object.keys(veriSetleri).map((key) => (
        <button
          key={key}
          onClick={() => chooseTopic(key, veriSetleri[key])}  // ✔ DOĞRU KULLANIM
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
