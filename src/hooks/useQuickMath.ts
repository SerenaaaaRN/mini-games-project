import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Question, MathOperator, QuickMathGameState } from "@/types/quickmath";

const DURATION = 60;

function useBestScore(key: string) {
  const [best, setBest] = useState<number>(0);

  useEffect(() => {
    // Ensure we are in the client environment
    if (typeof window !== "undefined") {
      const v = Number(localStorage.getItem(key) || 0);
      if (!Number.isNaN(v)) setBest(v);
    }
  }, [key]);

  const update = useCallback(
    (score: number) => {
      setBest((prev) => {
        const next = Math.max(prev, score);
        localStorage.setItem(key, String(next));
        return next;
      });
    },
    [key]
  );
  return { best, update };
}

export const useQuickMath = () => {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const { best, update } = useBestScore("quick_math_best");

  const accuracy = useMemo(() => (total ? Math.round((correct / total) * 100) : 0), [correct, total]);

  const makeQuestion = useCallback((): Question => {
    const ops: MathOperator[] = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 40) + 1;
        b = Math.floor(Math.random() * 40) + 1;
        break;
      case "-":
        a = Math.floor(Math.random() * 40) + 10;
        b = Math.floor(Math.random() * a); // ensure non-negative
        break;
      case "×":
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
    }
    const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;

    // Build options: 1 correct + 3 distractors near the answer
    const deltas = new Set<number>();
    while (deltas.size < 6) deltas.add(Math.floor(Math.random() * 9) - 4); // -4..+4
    const all = Array.from(deltas)
      .map((d) => answer + d)
      .filter((n) => n !== answer && n >= 0);
    const distractors = all.slice(0, 3);
    const options = [...distractors, answer].sort(() => Math.random() - 0.5);

    return { a, b, op, answer, options };
  }, []);

  const nextQuestion = useCallback(() => {
    setSelected(null);
    setQuestion(makeQuestion());
  }, [makeQuestion]);

  useEffect(() => {
    // Initial question
    if (!question) nextQuestion();
  }, [nextQuestion, question]);

  // Timer logic
  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (tickRef.current) window.clearInterval(tickRef.current);
          tickRef.current = null;
          setRunning(false);
          update(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running, score, update]);

  const handlePick = (value: number) => {
    if (!question || !running) return;
    setSelected(value);
    setTotal((t) => t + 1);
    if (value === question.answer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 10);
    }
    // move to next after a brief pause
    setTimeout(nextQuestion, 350);
  };

  const resetGame = () => {
    setTimeLeft(DURATION);
    setScore(0);
    setTotal(0);
    setCorrect(0);
    setRunning(true);
    nextQuestion();
  };

  return {
    state: {
      timeLeft,
      running,
      score,
      total,
      correct,
      question,
      selected,
      bestScore: best,
      accuracy,
    },
    actions: { handlePick, resetGame },
    constants: { DURATION },
  };
};
