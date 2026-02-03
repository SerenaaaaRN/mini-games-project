import { useState, useCallback } from "react";
import { Board, Direction } from "@/types/puzzle2048";

const BOARD_SIZE = 4;

const addRandomTile = (board: Board): void => {
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
};

const initializeBoard = (): Board => {
  const newBoard: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  addRandomTile(newBoard);
  addRandomTile(newBoard);
  return newBoard;
};

const checkCanMove = (b: Board): boolean => {
  if (b.flat().some((v) => v === null)) return true;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = b[r][c];
      if ((r < 3 && b[r + 1][c] === v) || (c < 3 && b[r][c + 1] === v)) return true;
    }
  }
  return false;
};

const slideArray = (arr: (number | null)[]): { newArr: (number | null)[]; score: number; moved: boolean } => {
  const filtered = arr.filter((v): v is number => v !== null);
  const newArr: (number | null)[] = [];
  let score = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      newArr.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i++;
    } else {
      newArr.push(filtered[i]);
    }
  }
  while (newArr.length < BOARD_SIZE) newArr.push(null);
  return { newArr, score, moved: arr.some((v, i) => v !== newArr[i]) };
};

// --- MAIN HOOK ---
export const usePuzzle2048 = () => {
  const [board, setBoard] = useState<Board>(initializeBoard);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  //  Baca localStorage langsung saat init state
  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("2048-best-score");
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  const move = useCallback(
    (direction: Direction) => {
      if (gameOver || won) return;

      const newBoard = board.map((row) => [...row]);
      let totalScoreGain = 0;
      let anyMoved = false;

      for (let i = 0; i < BOARD_SIZE; i++) {
        let line: (number | null)[];
        if (direction === "left" || direction === "right") {
          line = direction === "right" ? [...newBoard[i]].reverse() : newBoard[i];
        } else {
          line = [newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i]];
          if (direction === "down") line.reverse();
        }

        const { newArr, score: s, moved } = slideArray(line);
        if (moved) anyMoved = true;
        totalScoreGain += s;

        const finalArr = direction === "right" || direction === "down" ? newArr.reverse() : newArr;
        if (direction === "left" || direction === "right") {
          newBoard[i] = finalArr;
        } else {
          for (let j = 0; j < BOARD_SIZE; j++) newBoard[j][i] = finalArr[j];
        }
      }

      if (anyMoved) {
        addRandomTile(newBoard);
        setBoard(newBoard);

        // Hitung score baru dan bandingkan dengan bestScore di sini
        const nextScore = score + totalScoreGain;
        setScore(nextScore);

        if (nextScore > bestScore) {
          setBestScore(nextScore);
          localStorage.setItem("2048-best-score", nextScore.toString());
        }

        setMoveCount((m) => m + 1);
        if (newBoard.flat().some((v) => v === 2048)) setWon(true);
        if (!checkCanMove(newBoard)) setGameOver(true);
      }
    },
    [board, gameOver, won, score, bestScore]
  );

  const reset = useCallback(() => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setMoveCount(0);
  }, []);

  return { state: { board, score, bestScore, gameOver, won, moveCount }, actions: { move, reset } };
};
