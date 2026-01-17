import { useState, useRef, useCallback } from "react";
import { Player, GameMode, GameStatus, Scores, WinResult, GameStateRefData } from "../types/tictactoe";

const checkWinner = (board: Player[]): WinResult => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((cell) => cell !== null)) return { winner: "tie", line: null };
  return { winner: null, line: null };
};

const minimax = (board: Player[], depth: number, isMaximizing: boolean): number => {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "tie") return 0;

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, depth + 1, false); // Rekursi aman di sini
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        const score = minimax(board, depth + 1, true); // Rekursi aman di sini
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const useTicTacToe = (gameModeInitial: GameMode) => {
  const [gameState, setGameState] = useState<GameStatus>("menu");
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "tie" | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(gameModeInitial);
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, ties: 0 });
  const [isThinking, setIsThinking] = useState(false);

  const gameStateRef = useRef<GameStateRefData>({
    board: Array(9).fill(null) as Player[],
    winner: null as Player | "tie" | null,
    winLine: null as number[] | null,
    animatingWin: false,
  });

  const getBestMove = useCallback((board: Player[]): number => {
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }, []);

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] !== null || winner !== null || isThinking) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      gameStateRef.current.board = newBoard;

      const { winner: gameWinner, line } = checkWinner(newBoard);

      if (gameWinner) {
        setWinner(gameWinner);
        gameStateRef.current.winner = gameWinner;
        gameStateRef.current.winLine = line;
        gameStateRef.current.animatingWin = true;
        setScores((prev) => ({
          ...prev,
          [gameWinner === "tie" ? "ties" : gameWinner]: prev[gameWinner === "tie" ? "ties" : gameWinner] + 1,
        }));
        setTimeout(() => setGameState("gameOver"), 1500);
        return;
      }

      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      if (gameMode === "ai" && nextPlayer === "O") {
        setIsThinking(true);
        setTimeout(() => {
          const aiMove = getBestMove(newBoard);
          if (aiMove !== -1) {
            const aiBoard = [...newBoard];
            aiBoard[aiMove] = "O";
            setBoard(aiBoard);
            gameStateRef.current.board = aiBoard;
            const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);
            if (aiWinner) {
              setWinner(aiWinner);
              gameStateRef.current.winner = aiWinner;
              gameStateRef.current.winLine = aiLine;
              gameStateRef.current.animatingWin = true;
              setScores((prev) => ({
                ...prev,
                [aiWinner === "tie" ? "ties" : aiWinner]: prev[aiWinner === "tie" ? "ties" : aiWinner] + 1,
              }));
              setTimeout(() => setGameState("gameOver"), 1500);
            } else {
              setCurrentPlayer("X");
            }
          }
          setIsThinking(false);
        }, 500);
      }
    },
    [board, currentPlayer, gameMode, getBestMove, isThinking, winner]
  );

  const resetGame = useCallback(() => {
    const emptyBoard = Array(9).fill(null);
    setBoard(emptyBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setIsThinking(false);
    gameStateRef.current = { board: emptyBoard, winner: null, winLine: null, animatingWin: false };
    setGameState("playing");
  }, []);

  return {
    gameState,
    setGameState,
    board,
    currentPlayer,
    winner,
    gameMode,
    setGameMode,
    scores,
    isThinking,
    makeMove,
    resetGame,
    gameStateRef,
  };
};
