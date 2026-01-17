import { Difficulty } from "@/data/wordListTyping";

export type SubmitKey = "space" | "enter";
export type GameState = "idle" | "playing" | "finished";

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctWords: number;
  wrongWords: number;
}

export type BestScores = Record<Difficulty, number>;

export interface DifficultySetting {
  time: number;
  label: string;
  description: string;
  color: string;
}
