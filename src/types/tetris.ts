export interface TetrisPiece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

export interface TetrisGameState {
  score: number;
  level: number;
  lines: number;
  highScore: number;
  gameState: "menu" | "playing" | "gameOver";
}

export interface TetrisGameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  movePiece: (dx: number, dy: number) => void;
  rotatePiece: () => void;
  dropPiece: () => void;
}
