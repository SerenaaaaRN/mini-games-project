export type GameStatus = "ready" | "playing" | "won" | "lost";
export type Difficulty = "easy" | "medium" | "hard";

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface DifficultySetting {
  rows: number;
  cols: number;
  mines: number;
  label: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySetting> = {
  easy: { rows: 9, cols: 9, mines: 10, label: "Easy (9x9, 10 mines)" },
  medium: { rows: 16, cols: 16, mines: 40, label: "Medium (16x16, 40 mines)" },
  hard: { rows: 16, cols: 30, mines: 99, label: "Hard (16x30, 99 mines)" },
};

export interface MinesweeperGameState {
  difficulty: Difficulty;
  board: Cell[][];
  gameStatus: GameStatus;
  time: number;
  flags: number;
  showStartModal: boolean;
  showEndModal: boolean;
}

export interface MinesweeperGameActions {
  startGame: (diff: Difficulty) => void;
  handleCellClick: (row: number, col: number) => void;
  handleRightClick: (e: React.MouseEvent, row: number, col: number) => void;
  changeDifficulty: () => void;
  setShowStartModal: (show: boolean) => void;
}
