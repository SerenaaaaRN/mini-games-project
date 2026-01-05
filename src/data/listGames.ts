import type { gamesProp } from "@/types";
import { Brain, Grid3X3, Minus, Route, Triangle } from "lucide-react";

export const games: gamesProp[] = [
  {
    id: "tic-tac-to",
    title: "Tic Tac To",
    description: "Classic stategy game - get three in a row to win",
    icon: Grid3X3,
    color: "bg-emerald-500",
    themeColor: "#10b981",
    category: "Strategy",
    status: "ready"
  },
  {
    id: "2048",
    title: "2048",
    description: "description for games",
    icon: Grid3X3,
    color: "bg-amber-500",
    themeColor: "#f59e0b",
    category: "Puzzle",
    status: "soon",
  },

  {
    id: "memory-match",
    title: "Memory Match",
    description: "deskripsi for games",
    icon: Brain,
    color: "bg-pink-500",
    themeColor: "#ec4899",
    category: "Puzzle",
    status: "soon",
  },
  {
    id: "flappy",
    title: "Triangle",
    description: "deskripsi for games",
    icon: Triangle,
    color: "bg-yellow-500",
    themeColor: "#f59e0b",
    category: "Arcade",
    status: "soon",
  },
  {
    id: "snake",
    title: "Snake",
    description: "deskripsi for games",
    icon: Route,
    color: "bg-green-500",
    themeColor: "#22c55e",
    category: "Arcade",
    status: "maintance",
  },
  {
    id: "pong",
    title: "Pong",
    description: "deskripsi for games",
    icon: Minus,
    color: "bg-sky-500",
    themeColor: "#0ea5e9",
    category: "Arcade",
    status: "soon",
  },
];
