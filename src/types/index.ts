import type { LucideIcon } from "lucide-react";

export type GameType = "menu" | "2048" | "tic-tac-to" | "memory-match" | "flappy" | "snake" | "pong";

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
