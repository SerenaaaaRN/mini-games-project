"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Player, GameMode, GameStatus, GameStateRefData } from "../../types/tictactoe";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 200;

interface TicTacToeCanvasProps {
  gameState: GameStatus;
  currentPlayer: Player;
  isThinking: boolean;
  gameMode: GameMode;
  themeColor: string;
  gameStateRef: React.MutableRefObject<GameStateRefData>;
  onCanvasClick: (index: number) => void;
}

export const TicTacToeCanvas: React.FC<TicTacToeCanvasProps> = ({
  gameState,
  currentPlayer,
  isThinking,
  gameMode,
  themeColor,
  gameStateRef,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 600; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(600, i);
      ctx.stroke();
    }

    // Main Grid
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, 600);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(600, i * GRID_SIZE);
      ctx.stroke();
    }

    // X and O
    gameStateRef.current.board.forEach((player: Player, i: number) => {
      const x = (i % 3) * GRID_SIZE + GRID_SIZE / 2;
      const y = Math.floor(i / 3) * GRID_SIZE + GRID_SIZE / 2;
      if (player === "X") {
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - 60, y - 60);
        ctx.lineTo(x + 60, y + 60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 60, y - 60);
        ctx.lineTo(x - 60, y + 60);
        ctx.stroke();
      } else if (player === "O") {
        ctx.strokeStyle = "#171717";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Win Line
    if (gameStateRef.current.animatingWin && gameStateRef.current.winLine) {
      const line = gameStateRef.current.winLine;
      const start = { x: (line[0] % 3) * GRID_SIZE + 100, y: Math.floor(line[0] / 3) * GRID_SIZE + 100 };
      const end = { x: (line[2] % 3) * GRID_SIZE + 100, y: Math.floor(line[2] / 3) * GRID_SIZE + 100 };
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    // Status Text
    if (gameState === "playing" && !gameStateRef.current.winner) {
      ctx.fillStyle = "#171717";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      const text = isThinking
        ? "AI is thinking..."
        : gameMode === "ai"
        ? currentPlayer === "X"
          ? "Your turn"
          : "AI's turn"
        : `Player ${currentPlayer}'s turn`;
      ctx.fillText(text, 300, 570);
    }
  }, [gameState, currentPlayer, isThinking, gameMode, themeColor, gameStateRef]);

  useEffect(() => {
    const animate = () => {
      drawBoard();
      requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [drawBoard]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const col = Math.floor((e.clientX - rect.left) / (rect.width / 3));
    const row = Math.floor((e.clientY - rect.top) / (rect.height / 3));
    onCanvasClick(row * 3 + col);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-200 rounded-lg shadow-sm cursor-pointer max-w-full h-auto"
      onClick={handleClick}
    />
  );
};
