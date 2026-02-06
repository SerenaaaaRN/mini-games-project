import type { LucideIcon } from "lucide-react";

export type GameType =
  | "menu"
  | "2048"
  | "flappy"
  | "snake"
  | "pong"
  | "tetris"
  | "tic-tac-toe"
  | "memory-match"
  | "minesweeper"
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
  category: Category;
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
