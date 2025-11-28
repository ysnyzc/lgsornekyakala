// src/components/MiniGame.jsx
import { useState } from "react";
import MiniGameMenu from "./MiniGameMenu";
import EmojiCatchGame from "./games/EmojiCatchGame";
import WordHunter from "./games/WordHunter";
import ReactionTest from "./games/ReactionTest";
import QuickMath from "./games/QuickMath";

export default function MiniGame() {
  const [activeGame, setActiveGame] = useState(null);

  const quitGame = () => setActiveGame(null);

  if (activeGame === "emoji") return <EmojiCatchGame quit={quitGame} />;
  if (activeGame === "word") return <WordHunter quit={quitGame} />;
  if (activeGame === "reaction") return <ReactionTest quit={quitGame} />;
  if (activeGame === "math") return <QuickMath quit={quitGame} />;

  return <MiniGameMenu setActiveGame={setActiveGame} />;
}
