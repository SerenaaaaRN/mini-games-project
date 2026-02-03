"use client";
import { useMemoryMatch, getDifficultySettings } from "@/hooks/useMemoryMatch";
import { MemoryBoard } from "./molecules/MemoryBoard";
import { Button } from "@/components/ui/8bit/button";
import { Clock, RotateCcw, Target, Trophy } from "lucide-react";

const MemoryMatch = () => {
  const { state, actions } = useMemoryMatch();
  const settings = getDifficultySettings(state.difficulty);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className=" bg-gray-50 p-2 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">Memory Match</h1>
          <Button onClick={() => actions.setShowStartModal(true)} variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Game</span>
          </Button>
        </header>

        {!state.showStartModal && (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-center text-gray-600">
              <StatCard icon={Clock} label="Time" value={formatTime(state.timeElapsed)} />
              <StatCard icon={Target} label="Moves" value={`${state.moves} moves`} />
              <StatCard icon={Trophy} label="Matched" value={`${state.matchedPairs}/${settings.pairs}`} />
            </div>

            <MemoryBoard cards={state.cards} gridCols={settings.gridCols} onCardClick={actions.handleCardClick} />
          </>
        )}

        {state.showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Pilih Kesulitan</h2>
              <div className="space-y-3">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <Button
                    key={d}
                    onClick={() => {
                      actions.initializeGame(d);
                      actions.setShowStartModal(false);
                    }}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                  >
                    <div>
                      <div className="font-bold capitalize">{d}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{getDifficultySettings(d).description}</div>
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

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-white p-2 rounded-lg shadow-sm">
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-400 mb-1" />
    <div className="text-xs font-mono">{value}</div>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

export default MemoryMatch;
