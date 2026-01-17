"use client";

import { useParams, useRouter } from "next/navigation";
import { games } from "@/data/listGames"; //
import { Button } from "@/components/ui/button"; //
import { ArrowLeft } from "lucide-react";
import TicTacToeGame from "@/games/TicTacToe/TicTacToeGame";
import SnakeGame from "@/games/SnakeGame";
import MemoryMatch from "@/games/MemoryMatchGame";
import Puzzle2048Game from "@/games/Puzzle2048Game";
import TypingSpeedGame from "@/games/TypingSpeedGame";

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const gameData = games.find((g) => g.id === id);

  if (!gameData) return <div>Game not found</div>;

  const onBack = () => router.push("/");

  return (
    <div className="p-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back To Home
      </Button>

      {/* Logika render sesuai ID dari App.tsx */}
      {id === "tic-tac-to" && <TicTacToeGame onBack={onBack} themeColor={gameData.themeColor} />}
      {id === "snake" && <SnakeGame onBack={onBack} themeColor={gameData.themeColor} />}
      {id === "memory-match" && <MemoryMatch onBack={onBack} themeColor={gameData.themeColor} />}
      {id === "2048" && <Puzzle2048Game onBack={onBack} themeColor={gameData.themeColor} />}
      {id === "typing-speed" && <TypingSpeedGame onBack={onBack} themeColor={gameData.themeColor} />}

      {/* Lanjutkan untuk id lainnya */}
    </div>
  );
}
