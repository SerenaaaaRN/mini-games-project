import type { LucideIcon } from "lucide-react";

export type GameType =
  | "menu"
  | "2048"
  | "simon-says"
  | "whack-a-mole"
  | "coin-collector"
  | "bubble-pop"
  | "word-scramble"
  | "flappy"
  | "dino"
  | "snake"
  | "pong"
  | "reaction"
  | "tetris"
  | "breakout"
  | "orbit-defense"
  | "color-match"
  | "space-invaders"
  | "tic-tac-toe"
  | "memory-match"
  | "minesweeper"
  | "connect-four"
  | "quick-math"
  | "typing-speed";

export type Category = "All" | "Arcade" | "Puzzle" | "Strategy" | "Action";

export type gamesProp = {
  id: GameType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  themeColor: string;
  category: string;
  status?: "ready" | "maintance" | "soon";
};

export interface themeGame {
  onBack?: () => void;
  themeColor?: string;
}

export type GameCardProps = {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};
