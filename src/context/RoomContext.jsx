// src/context/RoomContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/client";

const RoomContext = createContext();
export const useRoomContext = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {

  // ----------------------------------------------------------
  // PUAN HESAPLAMA FONKSİYONU
  // ----------------------------------------------------------
  const calculateScore = (timeLeft) => {
    if (timeLeft >= 51) return 10;
    if (timeLeft >= 41) return 9;
    if (timeLeft >= 31) return 8;
    if (timeLeft >= 21) return 7;
    if (timeLeft >= 11) return 6;
    if (timeLeft >= 1) return 5;
    return 0;
  };

  // ----------------------------------------------------------
  // STATE YAPISI
  // ----------------------------------------------------------
  const [role, setRole] = useState(null);
  const [gradeLevel, setGradeLevel] = useState(null);
  const [roomCode, setRoomCode] = useState(null);

  const [topicKey, setTopicKey] = useState(null);
  const [topicData, setTopicData] = useState(null);

  const [currentRule, setCurrentRule] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState(null);

  const [timer, setTimer] = useState(60); // Öğretmen sayacı

  // ----------------------------------------------------------
  const chooseRole = (r) => setRole(r);
  const chooseGrade = (level) => setGradeLevel(level);

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
  // ÖĞRENCİ GİRİŞİ
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
  // KURAL SEÇ – TUR BAŞLAT
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

    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attempts: 2,  // yeni tur → attempts reset
      }))
    );

    await supabase.channel(roomCode).send({
      type: "broadcast",
      event: "kural_geldi",
      payload: hazir,
    });
  };

  // ----------------------------------------------------------
  // KART ÜRET
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
  // ÖĞRENCİ CEVAP GÖNDERİR (timeLeft parametreli)
  // ----------------------------------------------------------
  const sendAnswer = async (kart, timeLeft) => {
    if (role !== "student") return;

    await supabase.channel(roomCode).send({
      type: "broadcast",
      event: "cevap",
      payload: { studentName, kart, timeLeft },
    });
  };

  // ----------------------------------------------------------
  // PUANLAMA + CANLI SIRALAMA
  // ----------------------------------------------------------
  const handleIncomingAnswer = (payload) => {
    const { studentName, kart, timeLeft } = payload;

    setStudents((prev) => {
      let updated = prev.map((s) => {
        if (s.name !== studentName) return s;
        if (s.lives <= 0) return s;
        if (s.attempts <= 0) return s;

        // DOĞRU CEVAP
        if (kart.dogruMu) {
          const puan = calculateScore(timeLeft);

          return {
            ...s,
            correct: s.correct + 1,
            score: s.score + puan,
            attempts: 0,
          };
        }

        // YANLIŞ CEVAP
        return {
          ...s,
          wrong: s.wrong + 1,
          lives: s.lives - 1,
          attempts: s.attempts - 1,
        };
      });

      // ⭐ CANLI LİDERLİK TABLOSU — ANLIK SIRALAMA
      updated = updated.sort((a, b) => {
        // 1) Puan
        if (b.score !== a.score) return b.score - a.score;

        // 2) Doğru sayısı
        if (b.correct !== a.correct) return b.correct - a.correct;

        // 3) Yanlış sayısı (az olan önde)
        if (a.wrong !== b.wrong) return a.wrong - b.wrong;

        // 4) İsim
        return a.name.localeCompare(b.name);
      });

      return updated;
    });
  };

  // ----------------------------------------------------------
  // SÜRE BİTİNCE DOĞRUYU YAYINLA
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
  // REALTIME KANAL
  // ----------------------------------------------------------
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase.channel(roomCode);

    channel.on("broadcast", { event: "kural_geldi" }, (msg) => {
      setCurrentRule(msg.payload);
      setTimer(60);

      // Yeni kural geldiğinde de liste sırası korunur
      setStudents((prev) =>
        [...prev].sort((a, b) => b.score - a.score)
      );
    });

    channel.on("broadcast", { event: "ogrenci_katildi" }, (msg) => {
      if (role === "teacher") {
        setStudents((prev) => [...prev, msg.payload]);
      }
    });

    channel.on("broadcast", { event: "cevap" }, (msg) => {
      if (role === "teacher") handleIncomingAnswer(msg.payload);
    });

    channel.subscribe();
  }, [roomCode, role]);

  // ----------------------------------------------------------
  return (
    <RoomContext.Provider
      value={{
        role,
        chooseRole,
        gradeLevel,
        chooseGrade,
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
