"use client";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { RotateCcw, Flag, Timer } from "lucide-react";
import { useMinesweeper } from "@/hooks/useMinesweeper";
import { MinesweeperBoard } from "./molecules/MinesweeperBoard";
import { Difficulty } from "@/types/minesweeper";

const MinesweeperGame = () => {
  const { state, actions, settings } = useMinesweeper();
  const { difficulty, board, gameStatus, time, flags, showStartModal, showEndModal } = state;
  const { cols, mines } = settings[difficulty];

  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {!showStartModal && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center">Minesweeper</h1>
              <Button onClick={() => actions.setShowStartModal(true)} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Game</span>
              </Button>
            </div>

            <Card className="p-2 sm:p-4 mb-4">
              <div className="flex justify-between items-center mb-4 bg-muted p-2 rounded-md">
                <div className="flex items-center gap-2 font-mono text-base sm:text-lg">
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                  {mines - flags}
                </div>
                <div className="flex items-center gap-2 font-mono text-base sm:text-lg">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 sm:p-8 text-center w-full max-w-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Minesweeper</h2>
              <p className="text-gray-600 mb-6 text-sm ">Select a difficulty to start.</p>
              <div className="space-y-3 mb-6">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <Button
                    key={d}
                    onClick={() => actions.startGame(d)}
                    className="w-full text-xs capitalize"
                    variant="outline"
                  >
                    {settings[d].label}
                  </Button>
                ))}
              </div>
              <div className="text-left text-xs text-gray-500 bg-gray-50 p-3">
                <h3 className="font-semibold mb-1 text-foreground">Rules:</h3>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 sm:p-8 text-center w-full max-w-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {gameStatus === "won" ? "You Win! 🎉" : "Game Over 💥"}
              </h2>
              <p className="text-muted-foreground mb-6">Your time: {time} seconds</p>
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
