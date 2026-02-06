"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { Keyboard, ArrowLeft, Trophy, XCircle, CheckCircle2 } from "lucide-react";
import { useTypingGame } from "@/hooks/useTypingGame";
import { WordDisplay } from "./molecules/WordDisplayTyping";
import { Difficulty } from "@/data/wordListTyping";
import { SubmitKey, BestScores, DifficultySetting } from "@/types/typing";
import type { themeGame } from "@/types";

const difficultySettings: Record<Difficulty, DifficultySetting> = {
  easy: { time: 60, label: "Easy", description: "Short words (3-5)", color: "bg-green-500" },
  medium: { time: 45, label: "Medium", description: "Normal words", color: "bg-yellow-500" },
  hard: { time: 30, label: "Hard", description: "Complex words", color: "bg-red-500" },
};

export default function TypingSpeedGame({ onBack, themeColor }: themeGame) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [submitKey, setSubmitKey] = useState<SubmitKey>("space");
  const [bestScores, setBestScores] = useState<BestScores>({ easy: 0, medium: 0, hard: 0 });
  const { state, actions, utils } = useTypingGame();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("typing-speed-best");
    if (stored) setBestScores(JSON.parse(stored));
    const storedKey = localStorage.getItem("typing-speed-submit-key");
    if (storedKey) setSubmitKey(storedKey as SubmitKey);
  }, []);

  useEffect(() => {
    if (state.gameState === "finished" && difficulty) {
      const wpm = Math.round(state.correctChars / 5 / (difficultySettings[difficulty].time / 60));
      if (wpm > bestScores[difficulty]) {
        const newScores = { ...bestScores, [difficulty]: wpm };
        setBestScores(newScores);
        localStorage.setItem("typing-speed-best", JSON.stringify(newScores));
      }
    }
  }, [state.gameState, difficulty, state.correctChars, bestScores]);

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

  const calculateWPM = () => {
    if (!difficulty) return 0;
    const timeElapsed = difficultySettings[difficulty].time - state.timeLeft;
    if (timeElapsed === 0) return 0;
    return Math.round(state.correctChars / 5 / (timeElapsed / 60));
  };

  // --- MENU VIEW (RESPONSIVE) ---
  if (!difficulty) {
    return (
      <div className="w-full flex items-center justify-center p-4 ">
        <Card className="w-full max-w-md p-6 bg-white dark:bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <header className="text-center mb-6 md:mb-8">
            <div
              className="w-12 h-12 md:w-16 md:h-16 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColor }}
            >
              <Keyboard className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">Typing Speed</h1>
            <p className="text-xs text-gray-500 mt-2 font-mono">Test your WPM (Words Per Minute)</p>
          </header>

          <main className="space-y-3 md:space-y-4">
            {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleStart(diff)}
                className="w-full group relative p-3 md:p-4 rounded-none border-2 border-black hover:bg-gray-50 active:translate-y-1 transition-all text-left"
              >
                {/* Responsive Layout: Flex Col di HP, Row di Desktop */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold uppercase text-sm md:text-base">{difficultySettings[diff].label}</div>
                    <div className="text-xs text-gray-500 font-mono">{difficultySettings[diff].description}</div>
                  </div>
                  {bestScores[diff] > 0 && (
                    <div className="text-xs font-bold px-2 py-1 bg-yellow-100 border border-black flex items-center gap-1 w-fit">
                      <Trophy className="w-3 h-3 text-yellow-600" /> {bestScores[diff]}
                    </div>
                  )}
                </div>
                {/* Decor */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${difficultySettings[diff].color}`} />
              </button>
            ))}
          </main>
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full mt-6 text-xs uppercase text-gray-500 hover:text-black hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Arcade
          </Button>
        </Card>
      </div>
    );
  }

  // --- GAME VIEW (RESPONSIVE) ---
  return (
    <div className=" w-full flex items-center justify-center p-2 md:p-4 font-sans">
      <Card className="w-full max-w-3xl p-4 md:p-8 bg-white dark:bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {state.gameState === "playing" ? (
          <>
            <header className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <figure className="p-2 bg-black text-white rounded font-mono text-sm md:text-base font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                  {state.timeLeft}s
                </figure>
              </div>
              <div className="text-sm md:text-xl font-bold font-mono">WPM: {calculateWPM()}</div>
            </header>

            {/* Game Area */}
            <main className="mb-4">
              <WordDisplay words={state.words} currentIndex={state.currentWordIndex} typedWord={state.typedWord} />

              <input
                ref={inputRef}
                type="text"
                value={state.typedWord}
                onChange={(e) => actions.setTypedWord(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-base md:text-xl p-3 md:p-4 rounded-none border-4 border-black focus:outline-none focus:ring-4 focus:ring-black/20 font-mono placeholder:text-gray-300"
                placeholder="Type here..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                autoFocus
              />

              <div className="mt-2 text-[10px] md:text-xs text-gray-400 text-center uppercase">
                Press{" "}
                <span className="font-bold text-black border border-gray-300 px-1 mx-1 rounded bg-gray-100">
                  {submitKey === "space" ? "SPACE" : "ENTER"}
                </span>{" "}
                to submit word
              </div>
            </main>
          </>
        ) : (
          // --- RESULTS SCREEN ---
          <section className="text-center py-4 md:py-8 animate-in zoom-in-95">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 uppercase">Time&apos;s Up!</h2>
            <p className="text-sm text-gray-500 mb-8 font-mono">You typed with fury!</p>

            <section className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
              <div className="p-3 md:p-4 bg-green-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Final WPM</p>
                <span className="text-2xl md:text-4xl font-bold text-green-600">{calculateWPM()}</span>
              </div>
              <div className="p-3 md:p-4 bg-blue-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Accuracy</p>
                <span className="text-2xl md:text-4xl font-bold text-blue-600">
                  {state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 0}%
                </span>
              </div>
              <div className="p-2 border-2 border-gray-200 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mb-1" />
                <span className="text-xs md:text-sm font-bold">{state.correctWords} Words</span>
              </div>
              <div className="p-2 border-2 border-gray-200 flex flex-col items-center justify-center">
                <XCircle className="w-4 h-4 text-red-500 mb-1" />
                <span className="text-xs md:text-sm font-bold">{state.wrongWords} Missed</span>
              </div>
            </section>

            <Button
              onClick={() => setDifficulty(null)}
              className="w-full md:w-auto px-8 py-6 uppercase text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Play Again
            </Button>
          </section>
        )}
      </Card>
    </div>
  );
}
