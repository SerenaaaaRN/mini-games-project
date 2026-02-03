"use client";

import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { Play, Pause, RotateCcw, MoveVertical, Trophy } from "lucide-react";
import { usePongGame } from "@/hooks/usePongGame";
import { PongCanvas } from "./molecules/PongCanvas";
import type { themeGame } from "@/types";

const PongGame = ({ themeColor = "#3b82f6" }: themeGame) => {
  const { state, actions, constants, canvasRef } = usePongGame();

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full font-pixel">
      <div className="max-w-4xl w-full space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-bold uppercase tracking-widest drop-shadow-sm">Pong</h1>
            <span className="text-[10px] md:text-xs text-muted-foreground font-mono tracking-widest">
              CLASSIC ARCADE
            </span>
          </div>
          <Button
            onClick={actions.resetGame}
            variant="outline"
            size="sm"
            className="bg-white uppercase text-[10px] md:text-xs h-8"
          >
            <RotateCcw className="w-3 h-3 mr-2" /> Reset
          </Button>
        </header>

        <div className="relative">
          <Card className="p-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden relative">
            <PongCanvas {...state} constants={constants} canvasRef={canvasRef} themeColor={themeColor} />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scoreboard */}
          <Card className="p-3 border-2 border-black flex flex-col items-center justify-center bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Score
            </div>
            <div className="flex gap-6 text-xl md:text-2xl font-bold font-mono">
              <span style={{ color: themeColor }}>P1: {state.playerScore}</span>
              <span className="text-gray-400">|</span>
              <span className="text-red-500">AI: {state.aiScore}</span>
            </div>
          </Card>

          {/* Play/Pause Button */}
          <div className="flex flex-col h-full">
            <Button
              onClick={actions.toggleGame}
              disabled={state.gameOver}
              className="w-full h-full uppercase font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all border-2 border-black"
              style={{ backgroundColor: state.gameRunning ? "#ef4444" : themeColor }}
            >
              {state.gameRunning ? (
                <div className="flex items-center gap-2">
                  <Pause className="w-5 h-5 fill-current" /> PAUSE
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" /> {state.gameOver ? "RESTART" : "START"}
                </div>
              )}
            </Button>
          </div>

          {/* Instruction Panel */}
          <Card className="p-3 border-2 border-black flex items-center justify-center bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-yellow-700 mb-1">How to Play</div>
              <p className="text-xs font-mono text-yellow-900 uppercase leading-tight">
                <MoveVertical className="w-3 h-3 inline mr-1" />
                Move Mouse / Touch <br />
                to control paddle
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PongGame;
