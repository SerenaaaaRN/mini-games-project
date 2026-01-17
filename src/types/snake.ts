export type Position = {
  x: number;
  y: number;
};

export interface SnakeGameState {
  snake: Position[];
  food: Position;
  score: number;
  bestScore: number;
  gameRunning: boolean;
  gameOver: boolean;
}

export interface SnakeGameActions {
  resetGame: () => void;
  toggleGameRunning: () => void;
  changeDirection: (newDirection: Position) => void;
}
