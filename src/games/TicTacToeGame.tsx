"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";

import { Grid3X3, RotateCcw, Trophy } from "lucide-react";
import { TicTacToeCanvas } from "./molecules/TicTacToeCanvas";
import { useTicTacToe } from "../hooks/useTicTacToe";
import { TicTacToeGameProps } from "../types/tictactoe";

export default function TicTacToeGame({ themeColor }: TicTacToeGameProps) {
  const {
    gameState,
    setGameState,
    currentPlayer,
    winner,
    gameMode,
    setGameMode,
    scores,
    isThinking,
    makeMove,
    resetGame,
    gameStateRef,
  } = useTicTacToe("ai");

  useEffect(() => {
    if (gameState !== "gameOver") return;
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") resetGame();
      else if (e.key === "Escape") setGameState("menu");
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [gameState, resetGame, setGameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative">
        <TicTacToeCanvas
          gameState={gameState}
          currentPlayer={currentPlayer}
          isThinking={isThinking}
          gameMode={gameMode}
          themeColor={themeColor}
          gameStateRef={gameStateRef}
          onCanvasClick={(index) => {
            if (gameState === "playing" && !winner && !isThinking) makeMove(index);
          }}
        />

        {/* --- MENU SCREEN (Retro Style) --- */}
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-[2px]">
            <Card className="p-8 text-center w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div
                className="w-12 h-12 mx-auto mb-4 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: themeColor }}
              >
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold mb-6 uppercase tracking-wider">Tic Tac Toe</h1>
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setGameMode("ai");
                    resetGame();
                  }}
                  className="w-full uppercase text-xs font-bold"
                  size="sm"
                >
                  VS Computer
                </Button>
                <Button
                  onClick={() => {
                    setGameMode("human");
                    resetGame();
                  }}
                  variant="outline"
                  className="w-full uppercase text-xs font-bold bg-white"
                  size="sm"
                >
                  VS Player 2
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- GAME OVER SCREEN (Retro Style) --- */}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-[2px]">
            <Card className="p-6 text-center w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
              <div className="flex justify-center mb-4">
                <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-md animate-bounce" />
              </div>
              <h3 className="text-lg font-bold mb-6 uppercase">
                {winner === "tie"
                  ? "It's a Draw!"
                  : `${
                      winner === "X"
                        ? gameMode === "ai"
                          ? "You Won!"
                          : "P1 Wins!"
                        : gameMode === "ai"
                        ? "AI Won!"
                        : "P2 Wins!"
                    }`}
              </h3>

              {/* Scoreboard Mini */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-6 font-mono border-y-2 border-black py-2 bg-gray-100">
                <div className="flex flex-col">
                  <span className="font-bold">P1</span>
                  <span style={{ color: themeColor }}>{scores.X}</span>
                </div>
                <div className="flex flex-col border-x-2 border-black/10">
                  <span className="text-gray-500">DRAW</span>
                  <span>{scores.ties}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">P2/AI</span>
                  <span>{scores.O}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={resetGame} size="sm" className="w-full uppercase text-xs">
                  Play Again
                </Button>
                <Button
                  onClick={() => setGameState("menu")}
                  variant="ghost"
                  size="sm"
                  className="w-full uppercase text-[10px] text-muted-foreground hover:bg-transparent hover:text-black"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Back to Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
