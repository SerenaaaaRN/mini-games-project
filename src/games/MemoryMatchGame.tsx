"use client";

import { useMemoryMatch, getDifficultySettings } from "@/hooks/useMemoryMatch";
import { MemoryBoard } from "./molecules/MemoryBoard";
import { Button } from "@/components/ui/button";
import { themeGame } from "@/types";
import { ArrowLeft, Clock, RotateCcw, Target, Trophy } from "lucide-react";

const MemoryMatch = ({ onBack }: themeGame) => {
  const { state, actions } = useMemoryMatch();
  const settings = getDifficultySettings(state.difficulty);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold">Memory Match</h1>
          <Button onClick={() => actions.setShowStartModal(true)} variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" /> New Game
          </Button>
        </header>

        {!state.showStartModal && (
          <>
            <div className="flex justify-center gap-8 mb-8 text-gray-600">
              <div className="flex gap-2">
                <Clock className="w-4 h-4" /> <span className="font-mono text-sm">{formatTime(state.timeElapsed)}</span>
              </div>
              <div className="flex gap-2">
                <Target className="w-4 h-4" /> <span className="font-mono text-sm">{state.moves} moves</span>
              </div>
              <div className="flex gap-2">
                <Trophy className="w-4 h-4" />{" "}
                <span className="font-mono text-sm">
                  {state.matchedPairs}/{settings.pairs}
                </span>
              </div>
            </div>

            <MemoryBoard cards={state.cards} gridCols={settings.gridCols} onCardClick={actions.handleCardClick} />
          </>
        )}

        {/* Modal Start/End tetap di sini atau bisa diekstrak lagi ke file terpisah */}
        {state.showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-center mb-6">Pilih Kesulitan</h2>
              <div className="space-y-3">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <Button
                    key={d}
                    onClick={() => {
                      actions.initializeGame(d);
                      actions.setShowStartModal(false);
                    }}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-bold capitalize">{d}</div>
                      <div className="text-xs text-gray-500">{getDifficultySettings(d).description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatch;
