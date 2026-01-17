"use client";

import type { GameMode, GameState, Player, Score } from "@/types/typeTicTac";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameMenu } from "./GameMenu";
import { GameOver } from "./GameOver";
import { checkWinner, getBestMove } from "./gameUtils";
import { themeGame } from "@/types";

const CANVAS_SIZE = 600;
const GRID_SIZE = 200;

const TicTacToeGame = ({ onBack, themeColor }: themeGame) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "tie" | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("computer");
  const [scores, setScores] = useState<Score>({ X: 0, O: 0, ties: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [winLine, setWinLine] = useState<number[] | null>(null);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
      ctx.stroke();
    }

    board.forEach((player, i) => {
      if (!player) return;
      const x = (i % 3) * GRID_SIZE + GRID_SIZE / 2;
      const y = Math.floor(i / 3) * GRID_SIZE + GRID_SIZE / 2;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";

      if (player === "X") {
        ctx.strokeStyle = themeColor;
        ctx.beginPath();
        ctx.moveTo(x - 60, y - 60);
        ctx.lineTo(x + 60, y + 60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 60, y - 60);
        ctx.lineTo(x - 60, y + 60);
        ctx.stroke();
      } else {
        ctx.strokeStyle = "#171717";
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    if (winLine) {
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 12;
      const start = {
        x: (winLine[0] % 3) * GRID_SIZE + GRID_SIZE / 2,
        y: Math.floor(winLine[0] / 3) * GRID_SIZE + GRID_SIZE / 2,
      };
      const end = {
        x: (winLine[2] % 3) * GRID_SIZE + GRID_SIZE / 2,
        y: Math.floor(winLine[2] / 3) * GRID_SIZE + GRID_SIZE / 2,
      };
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }, [board, winLine, themeColor]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  const handleWin = (gameWinner: Player | "tie", line: number[] | null) => {
    setWinner(gameWinner);
    setWinLine(line);
    setScores((prev) => {
      if (gameWinner === "tie") {
        return { ...prev, ties: prev.ties + 1 };
      }
      if (gameWinner === "X" || gameWinner === "O") {
        return { ...prev, [gameWinner]: prev[gameWinner] + 1 };
      }
      return prev;
    });
    setTimeout(() => setGameState("gameOver"), 1000);
  };

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] || winner || isThinking) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.winner) {
        handleWin(result.winner, result.line);
        return;
      }

      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      if (gameMode === "computer" && nextPlayer === "O") {
        setIsThinking(true);
        setTimeout(() => {
          const aiMove = getBestMove(newBoard);
          if (aiMove !== -1) {
            const aiBoard = [...newBoard];
            aiBoard[aiMove] = "O";
            setBoard(aiBoard);

            const aiResult = checkWinner(newBoard);
            if (aiResult.winner) handleWin(aiResult.winner, aiResult.line);
            else setCurrentPlayer("X");
          }
          setIsThinking(false);
        }, 600);
      }
    },
    [board, winner, isThinking, currentPlayer, gameMode]
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinLine(null);
    setGameState("playing");
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (gameState !== "playing" || (gameMode === "computer" && currentPlayer === "O")) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const col = Math.floor((e.clientX - rect.left) / (rect.width / 3));
    const row = Math.floor((e.clientY - rect.top) / (rect.height / 3));
    makeMove(row * 3 + col);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 ">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border border-gray-200 rounded-lg shadow-sm cursor-pointer max-w-full h-auto"
          onClick={handleCanvasClick}
        />
        {gameState === "menu" && (
          <GameMenu
            themeColor={themeColor}
            scores={scores}
            onStart={(mode) => {
              setGameMode(mode);
              resetGame();
            }}
          />
        )}
        {gameState === "gameOver" && winner && (
          <GameOver
            winner={winner}
            gameMode={gameMode}
            scores={scores}
            themeColor={themeColor}
            onReset={resetGame}
            onMenu={() => setGameState("menu")}
          />
        )}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        {gameState === "playing" ? (isThinking ? "AI is thinking..." : `${currentPlayer} turn`) : "AI MINI Game"}
      </p>
    </div>
  );
};

export default TicTacToeGame;
