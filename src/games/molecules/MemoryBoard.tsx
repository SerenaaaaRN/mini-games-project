import { Card } from "@/components/ui/card";
import { GameCardProps } from "@/types";

interface BoardProps {
  cards: GameCardProps[];
  gridCols: number;
  onCardClick: (id: number) => void;
}

export const MemoryBoard = ({ cards, gridCols, onCardClick }: BoardProps) => (
  <div className="grid gap-3 max-w-2xl mx-auto mb-8" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
    {cards.map((card) => (
      <Card
        key={card.id}
        className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 border-0 shadow-sm
          ${
            card.isMatched
              ? "bg-green-50 opacity-60"
              : card.isFlipped
              ? "bg-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        onClick={() => onCardClick(card.id)}
      >
        {card.isFlipped || card.isMatched ? (
          <span className="text-3xl">{card.symbol}</span>
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded-full opacity-40" />
        )}
      </Card>
    ))}
  </div>
);
