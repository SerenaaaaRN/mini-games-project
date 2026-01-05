import type { GameMode, Player, Score } from "@/types/typeTicTac";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

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
    <div>
        <Card>
            <h2>Tic Tac Toe</h2>
            <h3>{getWinnerText()}</h3>
            <div>
                <div>X Menang</div><div style={{color: themeColor}}>{scores.X}</div>
                <div>Ties</div><div>{scores.ties}</div>
                <div>O Menang</div><div>{scores.O}</div>
            </div>

            <div>
                <Button onClick={onReset} style={{color: themeColor}}>Play again</Button>
                <Button onClick={onMenu }>Menu</Button>
            </div>
        </Card>
    </div>
  )
};
