import { useEffect, useRef } from "react";
import { Position } from "@/types/snake";

interface SnakeCanvasProps {
  snake: Position[];
  food: Position;
  themeColor: string;
  gameOver: boolean;
  score: number;
  bestScore: number;
  gridSize: number;
  canvasSize: number;
}

export const SnakeCanvas = ({
  snake,
  food,
  themeColor,
  gameOver,
  score,
  bestScore,
  gridSize,
  canvasSize,
}: SnakeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clear & Grid
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = "#e5e7eb";
    for (let i = 0; i <= canvasSize; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasSize, i);
      ctx.stroke();
    }

    // Snake
    ctx.fillStyle = themeColor;
    snake.forEach((segment, i) => {
      ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
      if (i === 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 3, 3);
        ctx.fillRect(segment.x * gridSize + 13, segment.y * gridSize + 4, 3, 3);
        ctx.fillStyle = themeColor;
      }
    });

    // Food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "bold 24px Arial";
      ctx.fillText("Game Over!", canvasSize / 2, canvasSize / 2 - 10);
      ctx.font = "16px Arial";
      ctx.fillText(`Score: ${score} | Best: ${bestScore}`, canvasSize / 2, canvasSize / 2 + 20);
    }
  }, [snake, food, gameOver, themeColor, gridSize, canvasSize, score, bestScore]);

  return (
    <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className="border border-gray-300 mx-auto block" />
  );
};
