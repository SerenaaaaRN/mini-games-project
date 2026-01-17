import { useState, useEffect, useCallback } from "react";
import { Difficulty, wordLists } from "@/data/wordListTyping";
import { GameState } from "@/types/typing";

export const useTypingGame = (initialTime: number = 60) => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);

  const generateWords = useCallback((diff: Difficulty): string[] => {
    const list = wordLists[diff];
    return [...list].sort(() => Math.random() - 0.5).slice(0, 50);
  }, []);

  const start = useCallback(
    (diff: Difficulty, time: number) => {
      setWords(generateWords(diff));
      setCurrentWordIndex(0);
      setTypedWord("");
      setTimeLeft(time);
      setCorrectWords(0);
      setWrongWords(0);
      setTotalChars(0);
      setCorrectChars(0);
      setGameState("playing");
    },
    [generateWords]
  );

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const submitWord = useCallback(
    (currentWord: string) => {
      const typed = typedWord.trim();
      if (!typed) return;

      setTotalChars((prev) => prev + typed.length);
      if (typed === currentWord) {
        setCorrectWords((prev) => prev + 1);
        setCorrectChars((prev) => prev + typed.length);
      } else {
        setWrongWords((prev) => prev + 1);
      }

      setTypedWord("");
      setCurrentWordIndex((prev) => prev + 1);
    },
    [typedWord]
  );

  return {
    state: {
      gameState,
      words,
      currentWordIndex,
      typedWord,
      timeLeft,
      correctWords,
      wrongWords,
      totalChars,
      correctChars,
    },
    actions: { start, setTypedWord, submitWord, setGameState, setTimeLeft, setWords, setCurrentWordIndex },
    utils: { generateWords },
  };
};
