// src/components/CardGrid.jsx

export default function CardGrid({ cards, onSelect, selectedCardId }) {
  return (
    <div style={grid}>
      {cards.map((kart, i) => {
        const isSelected = selectedCardId === kart.id;

        return (
          <div
            key={i}
            onClick={() => onSelect && onSelect(kart)}
            style={{
              ...kartKutu,
              border: isSelected
                ? kart.dogruMu
                  ? "3px solid #22c55e"
                  : "3px solid #ef4444"
                : "1px solid #e2e8f0",
              background: isSelected
                ? kart.dogruMu
                  ? "#dcfce7"
                  : "#fee2e2"
                : "white",
            }}
          >
            {kart.metin}
          </div>
        );
      })}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
};

const kartKutu = {
  padding: "12px",
  background: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "0.9rem",
  lineHeight: 1.4,
};
