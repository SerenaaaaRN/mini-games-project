import { Button } from "@/components/ui/button";
import type { themeGame, GameCardProps } from "@/types";
import { ArrowLeft, Clock, RotateCcw, Target, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Dificult = "easy" | "medium" | "hard";

const CARD_SYMBOLS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺", "🎻", "🎹", "🎤", "🎧", "🎬", "🎪", "🎨", "🎭"];

const MemoryMatch = ({ onBack, themeColor = "#ec4899" }: themeGame) => {
  const [cards, setCards] = useState<GameCardProps[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [dificulty, setDificulcty] = useState<Dificult>("medium");
  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);

  const getDifficulty = (diff: Dificult) => {
    switch (diff) {
      case "easy":
        return {
          pairs: 6,
          gridCols: 4,
          flipBackDelay: 2000,
          desciption: "6 pairs - 2 second to memorize",
        };
      case "medium":
        return {
          pairs: 8,
          gridCols: 4,
          flipBackDelay: 1200,
          desciption: "8 pairs - 1.2 second to memorize",
        };
      case "hard":
        return {
          pairs: 12,
          gridCols: 6,
          flipBackDelay: 600,
          desciption: "12 pairs - 0.6 second to memorize",
        };
    }
  };

  const initializeGame = useCallback(() => {
    const { pairs } = getDifficulty(dificulty);
    const selectedSymbol = CARD_SYMBOLS.slice(0, pairs);
    const gameCard = [...selectedSymbol, ...selectedSymbol]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(gameCard);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setGameWon(false);
    setShowEndModal(false);
  }, [dificulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: any;
    if (gameStarted && !gameWon) {
      interval = setTimeElapsed(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-semibold text-gray-900">Memory Match</h1>

          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex justify-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span className="font-mono text-sm">{} moves</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-4 h-4" />
            <span className="font-mono text-sm"></span>
          </div>
        </div>

        {/* Game Board */}
      </div>
    </div>
  );
};

export default MemoryMatch;
