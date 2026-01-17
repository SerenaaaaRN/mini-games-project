import { useState, useEffect, useCallback } from "react";
import { Difficulty, DifficultySettings } from "@/types/memory";
import { GameCardProps } from "@/types";

const CARD_SYMBOLS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺", "🎻", "🎹", "🎤", "🎧", "🎬", "🎭", "🎨", "🎯"];

export const getDifficultySettings = (diff: Difficulty): DifficultySettings => {
  const settings: Record<Difficulty, DifficultySettings> = {
    easy: { pairs: 6, gridCols: 4, flipBackDelay: 2000, description: "6 pairs - 2s to memorize" },
    medium: { pairs: 8, gridCols: 4, flipBackDelay: 1200, description: "8 pairs - 1.2s to memorize" },
    hard: { pairs: 12, gridCols: 6, flipBackDelay: 600, description: "12 pairs - 0.6s to memorize" },
  };
  return settings[diff];
};

export const useMemoryMatch = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<GameCardProps[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);

  const initializeGame = useCallback((diff: Difficulty) => {
    const { pairs } = getDifficultySettings(diff);
    const symbols = CARD_SYMBOLS.slice(0, pairs);
    const newCards: GameCardProps[] = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setGameWon(false);
    setShowEndModal(false);
    setDifficulty(diff);
  }, []);

  const handleCardClick = useCallback(
    (cardID: number) => {
      if (!gameStarted) setGameStarted(true);

      setCards((prevCards) => {
        const card = prevCards.find((c) => c.id === cardID);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return prevCards;

        const newFlipped = [...flippedCards, cardID];
        setFlippedCards(newFlipped);

        const updatedCards = prevCards.map((c) => (c.id === cardID ? { ...c, isFlipped: true } : c));

        if (newFlipped.length === 2) {
          setMoves((m) => m + 1);
          const [id1, id2] = newFlipped;
          const c1 = updatedCards.find((c) => c.id === id1);
          const c2 = updatedCards.find((c) => c.id === id2);

          if (c1?.symbol === c2?.symbol) {
            setTimeout(() => {
              setCards((curr) => curr.map((c) => (c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c)));
              setMatchedPairs((p) => {
                const newCount = p + 1;
                if (newCount === getDifficultySettings(difficulty).pairs) {
                  setGameWon(true);
                  setShowEndModal(true);
                }
                return newCount;
              });
              setFlippedCards([]);
            }, 500);
          } else {
            setTimeout(() => {
              setCards((curr) => curr.map((c) => (c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c)));
              setFlippedCards([]);
            }, getDifficultySettings(difficulty).flipBackDelay);
          }
        }
        return updatedCards;
      });
    },
    [gameStarted, flippedCards, difficulty]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  return {
    state: { difficulty, cards, matchedPairs, moves, timeElapsed, gameStarted, gameWon, showStartModal, showEndModal },
    actions: { initializeGame, handleCardClick, setShowStartModal, setShowEndModal, setDifficulty },
  };
};
