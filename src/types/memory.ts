import { GameCardProps } from "./index";

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultySettings {
  pairs: number;
  gridCols: number;
  flipBackDelay: number;
  description: string;
}

export interface MemoryGameState {
  difficulty: Difficulty;
  cards: GameCardProps[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  timeElapsed: number;
  gameStarted: boolean;
  gameWon: boolean;
  showStartModal: boolean;
  showEndModal: boolean;
}
