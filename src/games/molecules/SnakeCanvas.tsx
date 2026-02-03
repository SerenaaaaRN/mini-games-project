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

export const SnakeCanvas = ({ snake, food, themeColor, gameOver, score, bestScore, gridSize }: SnakeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const size = container.offsetWidth;
      canvas.width = size;
      canvas.height = size;
      draw(size, size / gridSize);
    };

    const draw = (currentSize: number, currentGridSize: number) => {
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, currentSize, currentSize);
      ctx.strokeStyle = "#e5e7eb";
      for (let i = 0; i <= currentSize; i += currentGridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, currentSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(currentSize, i);
        ctx.stroke();
      }

      ctx.fillStyle = themeColor;
      snake.forEach((segment, i) => {
        ctx.fillRect(
          segment.x * currentGridSize + 1,
          segment.y * currentGridSize + 1,
          currentGridSize - 2,
          currentGridSize - 2
        );
        if (i === 0) {
          ctx.fillStyle = "#fff";
          const eyeSize = currentGridSize / 6;
          ctx.fillRect(segment.x * currentGridSize + eyeSize, segment.y * currentGridSize + eyeSize, eyeSize, eyeSize);
          ctx.fillRect(
            segment.x * currentGridSize + 4 * eyeSize,
            segment.y * currentGridSize + eyeSize,
            eyeSize,
            eyeSize
          );
          ctx.fillStyle = themeColor;
        }
      });

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(
        food.x * currentGridSize + 1,
        food.y * currentGridSize + 1,
        currentGridSize - 2,
        currentGridSize - 2
      );

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, currentSize, currentSize);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = `bold ${currentSize / 15}px Arial`;
        ctx.fillText("Game Over!", currentSize / 2, currentSize / 2 - 10);
        ctx.font = `${currentSize / 25}px Arial`;
        ctx.fillText(`Score: ${score} | Best: ${bestScore}`, currentSize / 2, currentSize / 2 + 20);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [snake, food, gameOver, themeColor, gridSize, score, bestScore]);

  return (
    <div ref={containerRef} className="w-full aspect-square">
      <canvas ref={canvasRef} className="border border-gray-300 mx-auto block w-full h-full" />
    </div>
  );
};
