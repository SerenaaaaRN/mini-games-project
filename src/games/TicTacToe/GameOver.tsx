import type { GameMode, Player, Score } from "@/types/typeTicTac";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  winner: Player | "tie";
  gameMode: GameMode;
  scores: Score;
  themeColor: string;
  onReset: () => void;
  onMenu: () => void;
}

export const GameOver = ({ winner, gameMode, scores, themeColor, onReset, onMenu }: GameOverProps) => {
  const getWinnerText = () => {
    if (winner === "tie") return "TIE";
    if (winner === "X") return gameMode === "computer" ? "Kamu Menang" : "X Win";
    return gameMode === "computer" ? "Komputer Menang" : "0 Wins";
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white backdrop-blur-sm rounded-lg">
      <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
        <h2 className="text-lg font-medium text-gray-500 mb-1">Tic Tac Toe</h2>
        <h3 className="text-xl font-medium text-gray-900 mb-4">{getWinnerText()}</h3>
        <div className="grid grid-cols-3 gap-4 text-sm mb-6">
          <div>
            <div className="text-gray-400">X Wins</div>
            <div className="text-xl font-mono" style={{ color: themeColor }}>
              {scores.X}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Ties</div>
            <div className="text-xl font-mono text-gray-700">{scores.ties}</div>
          </div>
          <div>
            <div className="text-gray-400">O Wins</div>
            <div className="text-xl font-mono text-gray-700">{scores.O}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onReset} style={{ color: themeColor }}>
            Play again
          </Button>
          <Button onClick={onMenu} variant={"outline"}>
            Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};
