export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface PongGameState {
  ball: Ball;
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  playerScore: number;
  aiScore: number;
  gameRunning: boolean;
  gameOver: boolean;
}

export interface PongGameActions {
  resetGame: () => void;
  toggleGame: () => void;
}

export interface PongConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  BALL_SIZE: number;
}
