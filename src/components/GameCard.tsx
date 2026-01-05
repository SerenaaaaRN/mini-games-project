import type { gamesProp } from "@/types";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Play } from "lucide-react";

interface GameCardProps {
  game: gamesProp;
  onClick: () => void;
}

export const GameCard = ({ game, onClick }: GameCardProps) => (
  <Card
    className="relative hover:border-gray-500 transition-all duration-200 cursor-pointer hover:shadow-lg"
    onClick={onClick}
  >
    {game.id && (
      <div className="absolute top-3 right-3 bg-black text-white text-xs font-medium px-2 py-1 rounded-full z-10">
        NEW
      </div>
    )}

    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${game.color} text-white`}>
          <game.icon className="w-5 h-5" />
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Play className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold">{game.title}</CardTitle>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{game.category}</span>
        </div>

        <CardDescription className="text-gray-600 text-sm">{game.description}</CardDescription>
      </div>
    </div>
  </Card>
);
