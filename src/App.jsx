// src/App.jsx
import { useRoomContext } from "./context/RoomContext";
import RoleSelect from "./components/RoleSelect";
import GradeSelect from "./components/GradeSelect";
import TopicSelect from "./components/TopicSelect";
import TeacherScreen from "./components/TeacherScreen";
import StudentScreen from "./components/StudentScreen";

export default function App() {
  const { role, gradeLevel, topicKey } = useRoomContext();

  // 1) Rol seçilmemiş
  if (!role) return <RoleSelect />;

  // 2) Sınıf seçilmemiş
  if (!gradeLevel && role === "teacher") return <GradeSelect />;

  // 3) Öğretmen konu seçmemiş
  if (role === "teacher" && !topicKey) return <TopicSelect />;

  // 4) Öğretmen ekranı
  if (role === "teacher") return <TeacherScreen />;

  // 5) Öğrenci ekranı
  if (role === "student") return <StudentScreen />;

  return <div>Beklenmeyen bir durum oluştu…</div>;
}
