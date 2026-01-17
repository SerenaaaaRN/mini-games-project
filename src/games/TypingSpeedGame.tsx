"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Keyboard, ArrowLeft, Trophy } from "lucide-react";
import { useTypingGame } from "@/hooks/useTypingGame";
import { WordDisplay } from "./molecules/WordDisplayTyping";
import { Difficulty } from "@/data/wordListTyping";
import { SubmitKey, BestScores, DifficultySetting } from "@/types/typing";
import type { themeGame } from "@/types";

const difficultySettings: Record<Difficulty, DifficultySetting> = {
  easy: { time: 60, label: "Easy", description: "Simple 3-5 letter words", color: "bg-green-500" },
  medium: { time: 45, label: "Medium", description: "Common longer words", color: "bg-yellow-500" },
  hard: { time: 30, label: "Hard", description: "Complex vocabulary", color: "bg-red-500" },
};

export default function TypingSpeedGame({ onBack, themeColor }: themeGame) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [submitKey, setSubmitKey] = useState<SubmitKey>("space");
  const [bestScores, setBestScores] = useState<BestScores>({ easy: 0, medium: 0, hard: 0 });
  const { state, actions, utils } = useTypingGame();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persistence
  useEffect(() => {
    const stored = localStorage.getItem("typing-speed-best");
    if (stored) setBestScores(JSON.parse(stored));
    const storedKey = localStorage.getItem("typing-speed-submit-key");
    if (storedKey) setSubmitKey(storedKey as SubmitKey);
  }, []);

  const handleStart = (diff: Difficulty) => {
    setDifficulty(diff);
    actions.start(diff, difficultySettings[diff].time);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isSubmit = (submitKey === "space" && e.key === " ") || (submitKey === "enter" && e.key === "Enter");
    if (isSubmit) {
      e.preventDefault();
      actions.submitWord(state.words[state.currentWordIndex]);
      if (state.currentWordIndex >= state.words.length - 5) {
        actions.setWords((prev) => [...prev, ...utils.generateWords(difficulty!)]);
      }
    }
  };

  // UI rendering logic
  if (!difficulty) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: themeColor }}>
        <Card className="w-full max-w-md p-8 bg-white rounded-3xl">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColor }}
            >
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Typing Speed</h1>
          </div>

          <div className="space-y-3">
            {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleStart(diff)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{difficultySettings[diff].label}</div>
                    <div className="text-sm text-gray-500">{difficultySettings[diff].description}</div>
                  </div>
                  {bestScores[diff] > 0 && (
                    <div className="text-xs text-amber-600 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {bestScores[diff]} WPM
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <Button onClick={onBack} variant="ghost" className="w-full mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: themeColor }}>
      <Card className="w-full max-w-2xl p-8 bg-white rounded-3xl">
        {state.gameState === "playing" ? (
          <>
            <WordDisplay words={state.words} currentIndex={state.currentWordIndex} typedWord={state.typedWord} />
            <input
              ref={inputRef}
              type="text"
              value={state.typedWord}
              onChange={(e) => actions.setTypedWord(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xl p-4 rounded-xl border-2 border-gray-200 focus:outline-none"
              placeholder="Type here..."
              autoFocus
            />
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            {/* Statistik akhir di sini */}
            <Button onClick={() => setDifficulty(null)} className="mt-4">
              Back to Menu
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
