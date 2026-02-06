"use client";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { RotateCcw, ArrowLeft, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { usePuzzle2048 } from "@/hooks/usePuzzle2048";
import { Tile } from "./molecules/Tile2048";
import { themeGame } from "@/types";
import { Direction } from "@/types/puzzle2048";

export default function Puzzle2048Game({ onBack }: themeGame) {
  const { state, actions } = usePuzzle2048();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        w: "up",
        ArrowDown: "down",
        s: "down",
        ArrowLeft: "left",
        a: "left",
        ArrowRight: "right",
        d: "right",
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        actions.move(keyMap[e.key]);
      }
    },
    [actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="bg-linear-to-br p-4 flex flex-col items-center justify-center">
      <main className="w-full max-w-sm mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">2048</h1>
          <Button onClick={actions.reset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </header>

        <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          <ScoreCard label="Score" value={state.score} />
          <ScoreCard label="Best" value={state.bestScore} />
          <ScoreCard label="Moves" value={state.moveCount} />
        </section>

        <section className="bg-gray-300 rounded-lg p-2 sm:p-3 mb-4 shadow-lg">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {state.board.flat().map((cell, idx) => (
              <Tile key={idx} value={cell} />
            ))}
          </div>
        </section>

        {/* Mobile Controls */}
        <section className="grid grid-cols-3 grid-rows-2 gap-2 sm:hidden">
          <div className="col-start-2 row-start-1 flex justify-center">
            <Button onClick={() => actions.move("up")} className="w-16 h-16">
              <ArrowUp />
            </Button>
          </div>
          <div className="col-start-1 row-start-2 flex justify-center">
            <Button onClick={() => actions.move("left")} className="w-16 h-16">
              <ArrowLeft />
            </Button>
          </div>
          <div className="col-start-2 row-start-2 flex justify-center">
            <Button onClick={() => actions.move("down")} className="w-16 h-16">
              <ArrowDown />
            </Button>
          </div>
          <div className="col-start-3 row-start-2 flex justify-center">
            <Button onClick={() => actions.move("right")} className="w-16 h-16">
              <ArrowRight />
            </Button>
          </div>
        </section>

        {(state.gameOver || state.won) && (
          <section className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-2">{state.won ? "You Win!" : "Game Over"}</h2>
              <p className="text-gray-600 mb-6">Score: {state.score}</p>
              <div className="flex flex-col gap-3">
                <Button onClick={actions.reset}>Play Again</Button>
                <Button onClick={onBack} variant="outline">
                  Back to Menu
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const ScoreCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 text-center shadow-sm">
    <div className="text-xs sm:text-sm text-gray-600">{label}</div>
    <div className="text-base sm:text-xl font-bold">{value.toLocaleString()}</div>
  </div>
);
