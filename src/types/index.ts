import type { LucideIcon } from "lucide-react";

export type GameType = "menu" | "2048" | "tic-tac-to" | "memory-match";

export type Category = "All" | "Arcade" | "Puzzle" | "Strategy" | "Action";

export type gamesProp = {
  id: GameType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  themeColor: string;
  category: string;
  isNew?: boolean;
};

