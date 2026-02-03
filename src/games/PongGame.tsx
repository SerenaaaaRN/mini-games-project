"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { usePongGame } from "@/hooks/usePongGame";
import { PongCanvas } from "./molecules/PongCanvas";
import { themeGame } from "@/types";

const PongGame = ({ onBack, themeColor = "#3b82f6" }: themeGame) => {
  const { state, actions, constants } = usePongGame();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Pong</h1>
          <Button onClick={actions.resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
    
        <Card className="p-4 mb-4">
          <PongCanvas {...state} themeColor={themeColor} constants={constants} />
        </Card>

        {/* Controls & Status */}
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-8 text-lg font-semibold text-gray-700">
            <span>You: {state.playerScore}</span>
            <span>AI: {state.aiScore}</span>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={actions.toggleGame}
              disabled={state.gameOver}
              size="sm"
              style={{ backgroundColor: state.gameRunning ? undefined : themeColor }}
            >
              {state.gameRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {state.gameRunning ? "Pause" : "Start"}
            </Button>
          </div>
          <p className="text-sm text-gray-600">Use arrow keys to move your paddle • First to 5 wins!</p>
        </div>
      </div>
    </div>
  );
};

export default PongGame;
