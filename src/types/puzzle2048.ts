export type Board = (number | null)[][];
export type Direction = "up" | "down" | "left" | "right";

export interface PuzzleState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  moveCount: number;
}
