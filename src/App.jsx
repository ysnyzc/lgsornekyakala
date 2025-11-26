// src/App.jsx
import { useRoomContext } from "./context/RoomContext";
import RoleSelect from "./components/RoleSelect";
import TopicSelect from "./components/TopicSelect";
import TeacherScreen from "./components/TeacherScreen";
import StudentScreen from "./components/StudentScreen";

export default function App() {
  const { role, topicKey } = useRoomContext();

  // 1) Rol seçilmemiş → Rol ekranı
  if (!role) return <RoleSelect />;

  // 2) Öğretmen konu seçmemiş → Konu ekranı
  if (role === "teacher" && !topicKey) return <TopicSelect />;

  // 3) Öğretmen ekranı
  if (role === "teacher") return <TeacherScreen />;

  // 4) Öğrenci ekranı
  if (role === "student") return <StudentScreen />;

  return <div>Beklenmeyen bir durum oluştu…</div>;
}
