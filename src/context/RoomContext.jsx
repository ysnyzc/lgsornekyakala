// src/context/RoomContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/client";

const RoomContext = createContext();
export const useRoomContext = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {

  // ----------------------------------------------------------
  // STATE YAPISI
  // ----------------------------------------------------------
  const [role, setRole] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [topicKey, setTopicKey] = useState(null);
  const [topicData, setTopicData] = useState(null);

  const [currentRule, setCurrentRule] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState(null);

  const [timer, setTimer] = useState(60);

  // ----------------------------------------------------------
  // 1) ROL SEÇ
  // ----------------------------------------------------------
  const chooseRole = (r) => setRole(r);

  // ----------------------------------------------------------
  // 2) KONUYU SEÇ → ODA OLUŞSUN
  // ----------------------------------------------------------
  const chooseTopic = (key, data) => {
    setTopicKey(key);
    setTopicData(data);

    if (!roomCode) {
      const kod = Math.floor(1000 + Math.random() * 9000).toString();
      setRoomCode(kod);
    }
  };

  // ----------------------------------------------------------
  // 3) ÖĞRENCİ ODAYA KATILIR
  // ----------------------------------------------------------
  const joinRoom = async (oda, name) => {
    setRoomCode(oda);
    setStudentName(name);
    setRole("student");

    const yeni = {
      id: crypto.randomUUID(),
      name,
      correct: 0,
      wrong: 0,
      score: 0,
      lives: 6,
      attempts: 2,
    };

    setStudents((prev) => [...prev, yeni]);

    await supabase.channel(oda).send({
      type: "broadcast",
      event: "ogrenci_katildi",
      payload: yeni,
    });
  };

  // ----------------------------------------------------------
  // 4) KURAL SEÇ (ÖĞRETMEN)
  // ----------------------------------------------------------
  const chooseRule = async (ruleItem) => {
    const hazir = {
      id: ruleItem.id,
      kural: ruleItem.kural,
      dogruOrnek: ruleItem.ornek,
      kartlar: generateCards(ruleItem.ornek, topicData.liste),
    };

    setCurrentRule(hazir);
    setTimer(60);

    // Her öğrenciye yeni attempts tanımla
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attempts: 2,
      }))
    );

    // öğrencilere gönder
    await supabase.channel(roomCode).send({
      type: "broadcast",
      event: "kural_geldi",
      payload: hazir,
    });
  };

  // ----------------------------------------------------------
  // 5) 16 KART ÜRET
  // ----------------------------------------------------------
  const generateCards = (correctSentence, allRules) => {
    const yanlislar = allRules
      .filter((x) => x.ornek !== correctSentence)
      .map((x) => ({
        id: crypto.randomUUID(),
        metin: x.ornek,
        dogruMu: false,
      }));

    const dogru = {
      id: crypto.randomUUID(),
      metin: correctSentence,
      dogruMu: true,
    };

    const secilenYanlis = yanlislar.sort(() => Math.random() - 0.5).slice(0, 15);

    return [...secilenYanlis, dogru].sort(() => Math.random() - 0.5);
  };

  // ----------------------------------------------------------
  // 6) ÖĞRENCİ CEVAP GÖNDERİR
  // ----------------------------------------------------------
  const sendAnswer = async (kart) => {
    if (role !== "student") return;

    await supabase.channel(roomCode).send({
      type: "broadcast",
      event: "cevap",
      payload: { studentName, kart, timeLeft: timer },
    });
  };

  // ----------------------------------------------------------
  // 7) ÖĞRETMEN CEVABI ALIR → PUAN & CAN
  // ----------------------------------------------------------
  const handleIncomingAnswer = (payload) => {
    const { studentName, kart, timeLeft } = payload;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.name !== studentName) return s;
        if (s.lives <= 0) return s;
        if (s.attempts <= 0) return s;

        // -------------------------------
        // ⭐ DOĞRU CEVAP → PUAN HESABI
        //   her 10 saniyede 1 puan düşer
        // -------------------------------
        if (kart.dogruMu) {
          let puan = Math.ceil(timeLeft / 10); // ör: 43 sn → ceil(4.3)=5 puan

          if (puan > 10) puan = 10;
          if (puan < 1) puan = 1;

          return {
            ...s,
            correct: s.correct + 1,
            score: s.score + puan,
            attempts: 0,
          };
        }

        // -------------------------------
        // ❌ YANLIŞ CEVAP
        // -------------------------------
        return {
          ...s,
          wrong: s.wrong + 1,
          lives: s.lives - 1,
          attempts: s.attempts - 1,
        };
      })
    );
  };

  // ----------------------------------------------------------
  // 8) SÜRE BİTİNCE DOĞRU KARTI HERKESE GÖNDER
  // ----------------------------------------------------------
  const broadcastTimeUp = async () => {
    if (!currentRule) return;

    const dogruKart = currentRule.kartlar.find((k) => k.dogruMu);

    await supabase.channel(roomCode).send({
      type: "broadcast",
      event: "sure_bitti",
      payload: dogruKart,
    });
  };

  // ----------------------------------------------------------
  // 9) BROADCAST KANALI
  // ----------------------------------------------------------
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase.channel(roomCode);

    // Kural geldi
    channel.on("broadcast", { event: "kural_geldi" }, (msg) => {
      setCurrentRule(msg.payload);
      setTimer(60);
    });

    // Öğrenci katıldı
    channel.on("broadcast", { event: "ogrenci_katildi" }, (msg) => {
      if (role === "teacher") {
        setStudents((prev) => [...prev, msg.payload]);
      }
    });

    // Cevap geldi
    channel.on("broadcast", { event: "cevap" }, (msg) => {
      if (role === "teacher") handleIncomingAnswer(msg.payload);
    });

    // Süre bitti (öğrenci tarafında otomatik doğruyu seçer)
    channel.on("broadcast", { event: "sure_bitti" }, () => {
      /* öğrenciler kendi ekranında işliyor */
    });

    channel.subscribe();
  }, [roomCode, role]);

  // ----------------------------------------------------------
  // SAĞLANAN DEĞERLER
  // ----------------------------------------------------------
  return (
    <RoomContext.Provider
      value={{
        role,
        chooseRole,
        roomCode,
        topicKey,
        topicData,
        chooseTopic,
        joinRoom,
        studentName,
        students,
        currentRule,
        setCurrentRule,
        chooseRule,
        sendAnswer,
        timer,
        setTimer,
        broadcastTimeUp,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
