"use client";

import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { ArrowLeft, RotateCcw, Flag, Timer } from "lucide-react";
import { useMinesweeper } from "@/hooks/useMinesweeper";
import { MinesweeperBoard } from "./molecules/MinesweeperBoard";
import { themeGame } from "@/types";
import { Difficulty } from "@/types/minesweeper";

const MinesweeperGame = ({ onBack }: themeGame) => {
  const { state, actions, settings } = useMinesweeper();
  const { difficulty, board, gameStatus, time, flags, showStartModal, showEndModal } = state;
  const { rows, cols, mines } = settings[difficulty];

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-max">
        {!showStartModal && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Minesweeper</h1>
              <Button onClick={() => actions.setShowStartModal(true)} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>

            <Card className="p-4 mb-4">
              <div className="flex justify-between items-center mb-4 bg-gray-200 p-2 rounded-md">
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Flag className="w-5 h-5 text-red-500" />
                  {mines - flags}
                </div>
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Timer className="w-5 h-5" />
                  {time}
                </div>
              </div>

              <MinesweeperBoard
                board={board}
                cols={cols}
                onCellClick={actions.handleCellClick}
                onRightClick={actions.handleRightClick}
              />
            </Card>
          </>
        )}

        {showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-4">Minesweeper</h2>
              <p className="text-gray-600 mb-6">Select a difficulty to start.</p>
              <div className="space-y-3 mb-6">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <Button key={d} onClick={() => actions.startGame(d)} className="w-full capitalize" variant="outline">
                    {settings[d].label}
                  </Button>
                ))}
              </div>
              <div className="text-left text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold mb-1">Rules:</h3>
                <ul className="list-disc list-inside">
                  <li>Click a cell to reveal it.</li>
                  <li>If you reveal a mine, you lose.</li>
                  <li>Numbers show adjacent mines.</li>
                  <li>Right-click to flag suspected mines.</li>
                  <li>Clear all non-mine cells to win!</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {showEndModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-2">{gameStatus === "won" ? "You Win! 🎉" : "Game Over 💥"}</h2>
              <p className="text-gray-600 mb-6">Your time: {time} seconds</p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => actions.startGame(difficulty)}>Play Again ({difficulty})</Button>
                <Button onClick={actions.changeDifficulty} variant="outline">
                  Change Difficulty
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinesweeperGame;
