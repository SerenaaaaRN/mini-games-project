"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuickMath } from "@/hooks/useQuickMath";
import { themeGame } from "@/types";
import { QuickMathBoard } from "./molecules/QuickMathBoard";

export const QuickMathGame = ({ onBack, themeColor = "#111827" }: themeGame) => {
  const { state, actions, constants } = useQuickMath();
  const { DURATION } = constants;

  const accentStyle = { "--accent": themeColor } as React.CSSProperties;
  const percent = Math.max(0, Math.min(100, (state.timeLeft / DURATION) * 100));

  return (
    <div className="w-full max-w-xl space-y-6">
      <header className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <div className="text-sm text-gray-600">
          Best: <span className="font-semibold text-black">{state.bestScore}</span>
        </div>
      </header>

      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%`, backgroundColor: "var(--accent)" }}
          aria-label={`Time left ${state.timeLeft}s`}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <CardStats label="Score" value={state.score} />
        <CardStats label="Accuracy" value={state.accuracy} />
        <CardStats label="Time" value={state.timeLeft} />
      </div>

      <QuickMathBoard
        question={state.question}
        selected={state.selected}
        running={state.running}
        onPick={actions.handlePick}
      />

      {!state.running && (
        <div className="mt-6 rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold mb-1">Times up!</div>
          <div className="text-gray-600 mb-4">
            Score {state.score} • Accuracy {state.accuracy}% • Questions {state.total}
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={actions.resetGame} className="text-white" style={{ backgroundColor: "var(--accent)" }}>
              Play Again
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Menu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const CardStats = ({ label, value }: { label: string; value: number }) => (
  <Card className="p-3">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </Card>
);
