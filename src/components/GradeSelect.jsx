// src/components/GradeSelect.jsx
import { useRoomContext } from "../context/RoomContext";

export default function GradeSelect() {
  const { chooseGrade } = useRoomContext();

  const grades = [
    { id: 5, label: "5. Sınıf" },
    { id: 6, label: "6. Sınıf" },
    { id: 7, label: "7. Sınıf" },
    { id: 8, label: "8. Sınıf" },
  ];

  return (
    <div style={kapsayici}>
      <h2 style={{ marginBottom: 20 }}>Sınıf Seç</h2>

      {grades.map((g) => (
        <button
          key={g.id}
          onClick={() => chooseGrade(g.id)}
          style={buton}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}

const kapsayici = {
  padding: 30,
  textAlign: "center",
};

const buton = {
  padding: "14px 22px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "1rem",
  marginTop: "10px",
  width: "200px",
};
