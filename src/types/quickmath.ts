export type MathOperator = "+" | "-" | "×";

export type Question = {
  a: number;
  b: number;
  op: MathOperator;
  answer: number;
  options: number[];
};

export interface QuickMathGameState {
  timeLeft: number;
  running: boolean;
  score: number;
  total: number;
  correct: number;
  question: Question | null;
  selected: number | null;
  bestScore: number;
  accuracy: number;
}

export interface QuickMathGameActions {
  handlePick: (value: number) => void;
  resetGame: () => void;
}

export interface QuickMathConstants {
  DURATION: number;
}
