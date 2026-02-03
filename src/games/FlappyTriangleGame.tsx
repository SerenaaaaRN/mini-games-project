"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { Triangle, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { useFlappyTriangle } from "@/hooks/useFlappyTriangle";
import { FlappyCanvas } from "./molecules/FlappyCanvas";
import { themeGame } from "@/types";

const FlappyTriangleGame = ({ onBack, themeColor = "#f59e0b" }: themeGame) => {
  const { state, actions, constants } = useFlappyTriangle();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        actions.jump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [actions]);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-4xl mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Flappy Triangle</h1>
        <div className="w-20" />
      </div>

      <div className="relative w-full max-w-4xl">
        <FlappyCanvas {...state} themeColor={themeColor} constants={constants} onCanvasClick={actions.jump} />

        {state.gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
            <Card className="p-8 text-center border-amber-200 shadow-xl w-96">
              <div className="mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <Triangle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Flappy Triangle</h1>
                <p className="text-gray-600 mb-4">Navigate through the obstacles and score high!</p>
                <div className="bg-amber-50 rounded-lg p-4 text-left text-sm text-gray-700 space-y-2">
                  <div className="font-semibold text-amber-800">Controls:</div>
                  <div>
                    • <kbd className="px-2 py-1 bg-white rounded border text-xs">Space</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">↑</kbd> to jump
                  </div>
                  <div>
                    • <kbd className="px-2 py-1 bg-white rounded border text-xs">Click</kbd> anywhere to jump
                  </div>
                  <div>• Avoid the green pipes!</div>
                </div>
              </div>
              <Button
                onClick={actions.startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Flying
              </Button>
              {state.bestScore > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-amber-700">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Best: {state.bestScore}</span>
                </div>
              )}
            </Card>
          </div>
        )}

        {state.gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
            <Card className="p-8 text-center border-amber-200 shadow-xl w-96">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2" style={{ color: themeColor }}>
                    {state.score}
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                {state.score === state.bestScore && state.score > 0 && (
                  <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">New Best Score!</span>
                  </div>
                )}
                {state.bestScore > 0 && state.score !== state.bestScore && (
                  <div className="text-sm text-gray-500">Best Score: {state.bestScore}</div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={actions.startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-6 py-2 font-semibold shadow-lg"
                >
                  Play Again
                </Button>
                <Button
                  onClick={actions.resetGame}
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 px-6 py-2 font-semibold bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-amber-700 font-medium">
          {state.gameState === "playing" ? "Keep flying! Avoid the pipes!" : "Click anywhere or press Space to jump"}
        </p>
      </div>
    </div>
  );
};

export default FlappyTriangleGame;
