export type Player = "X" | "O" | null;
export type GameMode = "human" | "computer";
export type GameState = "menu" | "playing" | "gameOver";

export interface GameResult {
  winner: Player | "tie";
  line: number[] | null;
}

export interface Score {
  X: number;
  O: number;
  ties: number;
}
