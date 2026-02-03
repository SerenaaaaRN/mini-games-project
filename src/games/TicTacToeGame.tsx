"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid3X3 } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
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

        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center w-96">
              <div
                className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-medium mb-2">Tic Tac Toe</h1>
              <div className="space-y-3 mt-6">
                <Button
                  onClick={() => {
                    setGameMode("ai");
                    resetGame();
                  }}
                  style={{ backgroundColor: themeColor }}
                  className="w-full text-white"
                >
                  Play vs AI
                </Button>
                <Button
                  onClick={() => {
                    setGameMode("human");
                    resetGame();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Play vs Human
                </Button>
              </div>
            </Card>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center w-96">
              <h3 className="text-xl font-medium mb-4">
                {winner === "tie"
                  ? "It's a Tie! 🤝"
                  : `${winner === "X" ? (gameMode === "ai" ? "You" : "X") : gameMode === "ai" ? "AI" : "O"} Wins! 🎉`}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                <div>
                  <div className="text-gray-400">X</div>
                  <div className="text-xl" style={{ color: themeColor }}>
                    {scores.X}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Ties</div>
                  <div className="text-xl">{scores.ties}</div>
                </div>
                <div>
                  <div className="text-gray-400">O</div>
                  <div className="text-xl">{scores.O}</div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetGame} style={{ backgroundColor: themeColor }} className="text-white">
                  Play Again
                </Button>
                <Button onClick={() => setGameState("menu")} variant="outline">
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
