"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { SnakeCanvas } from "@/games/molecules/SnakeCanvas";
import { themeGame } from "@/types";
import { RotateCcw, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const SnakeGame = ({ themeColor = "#22c55e" }: themeGame) => {
  const { state, actions, constants } = useSnakeGame();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        actions.setGameRunning(!state.gameRunning);
        return;
      }
      if (!state.gameRunning || state.gameOver) return;

      const directions: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };

      if (directions[e.key]) actions.changeDirection(directions[e.key]);
    },
    [state.gameRunning, state.gameOver, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className=" bg-linear-0-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center">
      <main className="max-w-md w-full">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Snake</h1>
          <Button variant="outline" size="sm" onClick={actions.resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </header>

        <Card>
          <SnakeCanvas
            {...state}
            themeColor={themeColor}
            gridSize={constants.GRID_SIZE}
            canvasSize={constants.CANVAS_SIZE}
          />
        </Card>

        <section className="text-center space-y-4 mt-10">
          <div className="flex justify-center gap-4 text-sm font-semibold text-gray-700">
            <span>Score: {state.score}</span>
            <span>Best: {state.bestScore}</span>
          </div>

          <Button
            variant="default"
            size="lg"
            className="animate-pulse"
            onClick={() => actions.setGameRunning(!state.gameRunning)}
            style={{ backgroundColor: themeColor }}
          >
            {state.gameRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {state.gameOver ? "Play Again" : state.gameRunning ? "Pause" : "Start"}
          </Button>

          {/* Mobile Controls */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16"
              onClick={() => actions.changeDirection({ x: 0, y: -1 })}
            >
              <ChevronUp />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16"
                onClick={() => actions.changeDirection({ x: -1, y: 0 })}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16"
                onClick={() => actions.changeDirection({ x: 0, y: 1 })}
              >
                <ChevronDown />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16"
                onClick={() => actions.changeDirection({ x: 1, y: 0 })}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SnakeGame;
