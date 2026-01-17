export type Player = "X" | "O" | null;
export type GameMode = "human" | "ai";
export type GameStatus = "menu" | "playing" | "gameOver";

export interface Scores {
  X: number;
  O: number;
  ties: number;
}

export interface WinResult {
  winner: Player | "tie" | null;
  line: number[] | null;
}

export interface GameStateRefData {
  board: Player[];
  winner: Player | "tie" | null;
  winLine: number[] | null;
  animatingWin: boolean;
}

export interface TicTacToeGameProps {
  onBack: () => void;
  themeColor: string;
}
