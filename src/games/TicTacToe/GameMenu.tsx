import type { GameMode, Score } from "@/types/typeTicTac";
import { Card } from '@/components/ui/card';
import { Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameMenuProps {
  themeColor: string;
  scores: Score;
  onStart: (mode: GameMode) => void;
}

export const GameMenu = ({ themeColor, scores, onStart }: GameMenuProps) => {
  const hasHistory = scores.X > 0 || scores.O > 0 || scores.ties > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white backdrop-blur-sm rounded-lg">
      <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
        <div className="mb-6">
          <div
            className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: themeColor }}
          >
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>

          <h1 className="text-2xl font-medium text-gray-900 mb-2">Tic Tac Toe</h1>
          <p className="text-sm text-gray-600 mb-4">Classic Strategy</p>
          <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
            <div className="font-medium text-gray-800">How To Play</div>
            <div> Click on empty squares to place your mark</div>
            <div>Get three. X or O in a row to win</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => onStart("computer")} className="w-full text-white" style={{ color: themeColor }}>
            Play vs AI
          </Button>
          <Button onClick={() => onStart("human")} variant={"outline"} className="w-full border-gray-200 text-gray-700">
            Play with Human
          </Button>
        </div>

        {hasHistory && (
          <div className="mt-4 text-xs text-gray-500">
            Score: X: {scores.X} | O: {scores.O} | Ties: {scores.ties}
          </div>
        )}
      </Card>
    </div>
  );
};
