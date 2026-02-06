"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { useTetris } from "@/hooks/useTetris";
import { themeGame } from "@/types";
import { RotateCcw, Play, ChevronDown, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

const TetrisGame = ({ themeColor = "#a855f7" }: themeGame) => {
  const { canvasRef, stats, actions } = useTetris(themeColor);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (stats.gameState !== "playing") {
        if (e.key === "Enter" && (stats.gameState === "menu" || stats.gameState === "gameOver")) {
          actions.startGame();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          e.preventDefault();
          actions.movePiece(-1, 0);
          break;
        case "arrowright":
        case "d":
          e.preventDefault();
          actions.movePiece(1, 0);
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          actions.dropPiece();
          break;
        case "arrowup":
        case "w":
        case " ":
          e.preventDefault();
          actions.rotatePiece();
          break;
        case "escape":
          actions.pauseGame();
          break;
      }
    },
    [stats.gameState, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="bg-linear-0-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center min-h-150 p-4">
      <main className="max-w-xl w-full">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tetris</h1>
          <Button variant="outline" size="sm" onClick={actions.resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </header>

        <section className="flex flex-col md:flex-row gap-6 justify-center items-start">
          <Card className="p-1 border-4 border-gray-800 bg-white relative">
            <canvas ref={canvasRef} className="rounded-sm" style={{ maxWidth: "100%", height: "auto" }} />

            {/* Overlay Menu */}
            {stats.gameState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">TETRIS</h2>
                <Button
                  onClick={actions.startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white animate-pulse"
                >
                  <Play className="w-4 h-4 mr-2" /> Start Game
                </Button>
              </div>
            )}

            {stats.gameState === "gameOver" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-10">
                <h2 className="text-2xl font-bold text-red-500 mb-2">GAME OVER</h2>
                <p className="text-lg mb-4">Score: {stats.score}</p>
                <Button onClick={actions.startGame} style={{ backgroundColor: themeColor }} className="text-white">
                  Try Again
                </Button>
              </div>
            )}
          </Card>

          {/* sidebar status */}
          <aside className="flex flex-col gap-4 w-full md:w-48">
            <Card className="p-4 space-y-2 bg-white/50">
              <span className="text-sm text-gray-600">Score</span>
              <span className="text-xl font-bold text-gray-900">{stats.score}</span>
              <span className="text-sm text-gray-600 mt-2">Level</span>
              <span className="text-xl font-bold text-gray-900">{stats.level}</span>
              <span className="text-sm text-gray-600 mt-2">Best</span>
              <span className="text-xl font-bold text-gray-900">{stats.highScore}</span>
            </Card>

            {/* contoller mobile */}
            <section className="grid grid-cols-3 gap-2 md:hidden">
              <div />
              <Button variant="outline" className="h-12" onClick={actions.rotatePiece}>
                <RotateCw className="w-5 h-5" />
              </Button>
              <div />
              <Button variant="outline" className="h-12" onClick={() => actions.movePiece(-1, 0)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="h-12" onClick={actions.dropPiece}>
                <ChevronDown className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="h-12" onClick={() => actions.movePiece(1, 0)}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </section>

            <section className="hidden md:block text-xs text-gray-500 bg-white/50 p-4 rounded-lg">
              <p className="font-bold mb-2">Controls:</p>
              <p>WASD / Arrows to Move</p>
              <p>Space / Up to Rotate</p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default TetrisGame;
