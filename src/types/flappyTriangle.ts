export interface TrianglePlayer {
  x: number;
  y: number;
  velocity: number;
}

export interface Obstacle {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export interface FlappyGameState {
  triangle: TrianglePlayer;
  obstacles: Obstacle[];
  score: number;
  bestScore: number;
  gameRunning: boolean;
  gameOver: boolean;
  gameState: "menu" | "playing" | "gameOver";
}

export interface FlappyGameActions {
  jump: () => void;
  resetGame: () => void;
  startGame: () => void;
}

export interface FlappyConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  TRIANGLE_SIZE: number;
}
