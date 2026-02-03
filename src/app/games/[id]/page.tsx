"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/data/listGames";
import { ArrowLeft, Gamepad2, Info } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

import TicTacToeGame from "@/games/TicTacToeGame";
import SnakeGame from "@/games/SnakeGame";
import MemoryMatch from "@/games/MemoryMatchGame";
import Puzzle2048Game from "@/games/Puzzle2048Game";
import TypingSpeedGame from "@/games/TypingSpeedGame";
import FlappyTriangleGame from "@/games/FlappyTriangleGame";
import { QuickMathGame } from "@/games/QuickMathGame";
import PongGame from "@/games/PongGame";
import MinesweeperGame from "@/games/MinesweeperGame";

const GAME_COMPONENTS: Record<string, any> = {
  "tic-tac-toe": TicTacToeGame,
  snake: SnakeGame,
  "memory-match": MemoryMatch,
  "2048": Puzzle2048Game,
  "typing-speed": TypingSpeedGame,
  flappy: FlappyTriangleGame,
  "quick-math": QuickMathGame,
  pong: PongGame,
  minesweeper: MinesweeperGame,
};

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const game = games.find((g) => g.id === id);
  const GameComponent = GAME_COMPONENTS[id];

  if (!game || !GameComponent) {
    notFound();
  }

  const handlePlayFocus = () => {
    const gameElement = document.getElementById("game-screen");
    if (gameElement) {
      gameElement.scrollIntoView({ behavior: "smooth", block: "center" });
      gameElement.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-[#2d2a2e] p-4 md:p-8 font-pixel">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-white dark:bg-black uppercase text-xs">
              <ArrowLeft className="w-4 h-4" />
              Back to Arcade
            </Button>
          </Link>
          <div className="hidden md:block text-xs uppercase tracking-widest opacity-50 animate-pulse">
            INSERT COIN [CREDITS: 00]
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
          <main className="order-2 lg:order-1">
            {/* Frame Monitor Retro */}
            <div className="p-1 bg-gray-800 rounded-lg shadow-xl">
              <div className="bg-[#1a1b26] border-4 border-gray-600 rounded-lg p-2 md:p-4">
                {/* Card Game Area */}
                <Card
                  id="game-screen"
                  className="bg-white dark:bg-black min-h-[400px] md:min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-none border-2"
                  tabIndex={0}
                >
                  {/* Render Game Component dengan props yang diperlukan */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <GameComponent themeColor={game.themeColor} />
                  </div>
                </Card>

                <div className="mt-2 flex justify-between items-center px-2">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-sans tracking-wider">POWER</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-sans">STEREO SOUND</div>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar Info (The Cabinet Panel) */}
          <div className="order-1 lg:order-2 space-y-6">
            <Card className="bg-white dark:bg-black p-6 space-y-6">
              <header className="border-b-4 border-current pb-4 space-y-2">
                <Badge variant="outline" className="mb-2 bg-yellow-300 text-black border-black">
                  {game.category}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight text-primary">{game.title}</h1>
              </header>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold uppercase border-b-2 border-dashed border-gray-300 pb-1 w-fit">
                  <Info className="w-4 h-4" />
                  Mission Brief
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">{game.description}</p>
              </div>

              {/* Controls Hints */}
              <div className="space-y-3 bg-gray-100 dark:bg-gray-900 p-4 rounded border-2 border-black/10">
                <div className="flex items-center gap-2 text-sm font-bold uppercase mb-2">
                  <Gamepad2 className="w-4 h-4" />
                  Controls
                </div>
                <div className="text-xs font-mono text-muted-foreground text-center italic">
                  Controls are displayed inside the game screen
                </div>
              </div>

              {/* Start Button Decoration (Visual Only) */}
              <div className="pt-4">
                <Button
                  onClick={handlePlayFocus}
                  className="w-full h-14 text-lg animate-bounce hover:animate-none bg-primary text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  PLAY NOW
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
