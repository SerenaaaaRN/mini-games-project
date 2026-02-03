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
  const { CANVAS_WIDTH, CANVAS_HEIGHT, TRIANGLE_SIZE } = constants;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87ceeb");
    gradient.addColorStop(1, "#e0f6ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + Date.now() * 0.02) % (CANVAS_WIDTH + 100);
      const y = 50 + i * 30;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      const obstacleGradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + obstacle.width, 0);
      obstacleGradient.addColorStop(0, "#22c55e");
      obstacleGradient.addColorStop(1, "#16a34a");
      ctx.fillStyle = obstacleGradient;

      ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
      ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(obstacle.x, 0, 5, obstacle.topHeight);
      ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, 5, obstacle.bottomHeight);
    });

    // Draw triangle
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.moveTo(triangle.x, triangle.y);
    ctx.lineTo(triangle.x + TRIANGLE_SIZE, triangle.y + TRIANGLE_SIZE / 2);
    ctx.lineTo(triangle.x, triangle.y + TRIANGLE_SIZE);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeText(`${score}`, CANVAS_WIDTH / 2, 60);
    ctx.fillText(`${score}`, CANVAS_WIDTH / 2, 60);
    ctx.textAlign = "left";
  }, [triangle, obstacles, score, themeColor, CANVAS_WIDTH, CANVAS_HEIGHT, TRIANGLE_SIZE]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-amber-200 rounded-xl shadow-2xl cursor-pointer mx-auto block bg-white w-full max-w-full h-auto"
      onClick={onCanvasClick}
    />
  );
};
