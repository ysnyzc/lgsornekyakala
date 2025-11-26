// src/components/CountdownTimer.jsx
import { useEffect, useState } from "react";

export default function CountdownTimer({
  duration = 60,
  onFinish = () => {},
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timeLeft]);

  let renk = "#1e3a8a"; // mavi

  if (timeLeft <= 30 && timeLeft > 10) renk = "#f97316"; // turuncu
  if (timeLeft <= 10) renk = "#dc2626"; // kırmızı

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "1.4rem",
        fontWeight: 700,
        color: renk,
        marginBottom: "15px",
      }}
    >
      ⏱ {timeLeft} saniye
    </div>
  );
}
