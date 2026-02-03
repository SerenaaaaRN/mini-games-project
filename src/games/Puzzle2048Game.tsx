"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { RotateCcw, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">2048</h1>
          <Button onClick={actions.reset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </header>

        <div className="flex gap-4 mb-6">
          <ScoreCard label="Score" value={state.score} />
          <ScoreCard label="Best" value={state.bestScore} />
          <ScoreCard label="Moves" value={state.moveCount} />
        </div>

        <div className="bg-gray-300 rounded-lg p-3 mb-6 shadow-lg">
          <div className="grid grid-cols-4 gap-3">
            {state.board.flat().map((cell, idx) => (
              <Tile key={idx} value={cell} />
            ))}
          </div>
        </div>

        {/* Game Over Modal logic tetap sama menggunakan state.gameOver & state.won */}
      </div>
    </div>
  );
}

const ScoreCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-lg p-3 flex-1 text-center shadow-sm">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-xl font-bold">{value.toLocaleString()}</div>
  </div>
);
