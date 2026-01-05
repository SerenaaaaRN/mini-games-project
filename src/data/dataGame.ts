import type { gamesProp } from "@/types";
import { Brain, Grid3X3 } from "lucide-react";

export const games: gamesProp[] = [
  {
    id: "2048" as const,
    title: "2048",
    description: "Slide numbered tiles to reach 2048 - addictive puzzle challenge!",
    icon: Grid3X3,
    color: "bg-amber-500",
    themeColor: "#f59e0b",
    category: "Puzzle" as const,
    isNew: true,
  },
  {
    id: "tic-tac-to",
    title: "Tic Tac To",
    description: "deskripsi tic-tac-to",
    icon: Grid3X3,
    color: "bg-emarld-500",
    themeColor: "#f59e0b",
    category: "Strategy" as const,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "deskripsi memory games",
    icon: Brain,
    color: "bg-pink-500",
    themeColor: "#f59e0b",
    category: "Puzzle" as const,
  },
];
