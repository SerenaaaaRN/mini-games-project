"use client";

import { useEffect, useRef } from "react";
import { PongGameState, PongConstants } from "@/types/pong";

interface PongCanvasProps extends PongGameState {
  themeColor: string;
  constants: PongConstants;
}

export const PongCanvas = ({
  ball,
  playerPaddle,
  aiPaddle,
  playerScore,
  aiScore,
  gameOver,
  themeColor,
  constants,
}: PongCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { CANVAS_WIDTH, CANVAS_HEIGHT, BALL_SIZE } = constants;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = themeColor;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore.toString(), CANVAS_WIDTH / 4, 50);
    ctx.fillText(aiScore.toString(), (3 * CANVAS_WIDTH) / 4, 50);

    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "24px Arial";
      ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      ctx.font = "18px Arial";
      const winner = playerScore > aiScore ? "You Win!" : "AI Wins!";
      ctx.fillText(winner, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillText("Press Reset to play again", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    ctx.textAlign = "left";
  }, [
    ball,
    playerPaddle,
    aiPaddle,
    playerScore,
    aiScore,
    gameOver,
    themeColor,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    BALL_SIZE,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-300 mx-auto block w-full max-w-full h-auto"
    />
  );
};
