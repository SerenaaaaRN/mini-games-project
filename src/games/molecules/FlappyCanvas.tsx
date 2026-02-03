"use client";
import { FlappyConstants, FlappyGameState } from "@/types/flappyTriangle";
import { useEffect, useRef } from "react";

interface FlappyCanvasProps extends FlappyGameState {
  themeColor: string;
  constants: FlappyConstants;
  onCanvasClick: () => void;
}

export const FlappyCanvas = ({
  triangle,
  obstacles,
  score,
  themeColor,
  constants,
  onCanvasClick,
}: FlappyCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width } = container.getBoundingClientRect();
      const aspectRatio = 9 / 16;
      canvas.width = width;
      canvas.height = width * aspectRatio;
      draw(width, width * aspectRatio);
    };

    const draw = (width: number, height: number) => {
      const scaleX = width / constants.CANVAS_WIDTH;
      const scaleY = height / constants.CANVAS_HEIGHT;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#87ceeb");
      gradient.addColorStop(1, "#e0f6ff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 5; i++) {
        const x = (i * 200 * scaleX + Date.now() * 0.02 * scaleX) % (width + 100 * scaleX);
        const y = (50 + i * 30) * scaleY;
        ctx.beginPath();
        ctx.arc(x, y, 20 * scaleX, 0, Math.PI * 2);
        ctx.arc(x + 25 * scaleX, y, 30 * scaleX, 0, Math.PI * 2);
        ctx.arc(x + 50 * scaleX, y, 20 * scaleX, 0, Math.PI * 2);
        ctx.fill();
      }

      obstacles.forEach((obstacle) => {
        const obstacleGradient = ctx.createLinearGradient(
          obstacle.x * scaleX,
          0,
          (obstacle.x + obstacle.width) * scaleX,
          0
        );
        obstacleGradient.addColorStop(0, "#22c55e");
        obstacleGradient.addColorStop(1, "#16a34a");
        ctx.fillStyle = obstacleGradient;

        ctx.fillRect(obstacle.x * scaleX, 0, obstacle.width * scaleX, obstacle.topHeight * scaleY);
        ctx.fillRect(
          obstacle.x * scaleX,
          height - obstacle.bottomHeight * scaleY,
          obstacle.width * scaleX,
          obstacle.bottomHeight * scaleY
        );

        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(obstacle.x * scaleX, 0, 5 * scaleX, obstacle.topHeight * scaleY);
        ctx.fillRect(
          obstacle.x * scaleX,
          height - obstacle.bottomHeight * scaleY,
          5 * scaleX,
          obstacle.bottomHeight * scaleY
        );
      });

      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10 * scaleX;
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.moveTo(triangle.x * scaleX, triangle.y * scaleY);
      ctx.lineTo(
        triangle.x * scaleX + constants.TRIANGLE_SIZE * scaleX,
        triangle.y * scaleY + (constants.TRIANGLE_SIZE / 2) * scaleY
      );
      ctx.lineTo(triangle.x * scaleX, triangle.y * scaleY + constants.TRIANGLE_SIZE * scaleY);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#000";
      ctx.font = `bold ${width / 20}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4 * scaleX;
      ctx.strokeText(`${score}`, width / 2, height / 8);
      ctx.fillText(`${score}`, width / 2, height / 8);
      ctx.textAlign = "left";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [triangle, obstacles, score, themeColor, constants]);

  return (
    <div ref={containerRef} className="w-full h-auto aspect-[16/9]">
      <canvas
        ref={canvasRef}
        className="border-2 border-amber-200 rounded-xl shadow-2xl cursor-pointer mx-auto block bg-white w-full h-full"
        onClick={onCanvasClick}
      />
    </div>
  );
};
