import type { GameMode, Score } from "@/types/typeTicTac";
import { Card } from "../ui/card";
import { Grid3X3 } from "lucide-react";
import { Button } from "../ui/button";

interface GameMenuProps {
  themeColor: string;
  scores: Score;
  onStart: (mode: GameMode) => void;
}

export const GameMenu = ({ themeColor, scores, onStart }: GameMenuProps) => {
  const hasHistory = scores.X > 0 || scores.O > 0 || scores.ties > 0;

  return (
    <div>
      <Card>
        <div>
          <div style={{ color: themeColor }}>
            <Grid3X3 />
          </div>
          <h1>Tic Tac Toe</h1>
          <p>Classic Startegy</p>
          <div>
            <div>How To Play</div>
            <div> Click on empty squares to place your mark</div>
            <div>Get there X or O in a row to win</div>
          </div>
        </div>

        <div>
          <Button onClick={() => onStart("computer")} style={{ color: themeColor }}>
            Play vs AI
          </Button>
          <Button onClick={() => onStart("human")}>Play with Human</Button>
        </div>

        {hasHistory && (
          <div>
            Score: X: {scores.X} | O: {scores.O} | Ties: {scores.ties}
          </div>
        )}
      </Card>
    </div>
  );
};
