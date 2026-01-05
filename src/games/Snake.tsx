import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { themeGame } from "@/types";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

type Position = { x: number; y: number };

const Snake = ({ onBack }: themeGame) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const [canvasSize, setCanvasSize] = useState(400);
  const gameLoopRef = useRef<number>();
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const maxSize = Math.min(window.innerWidth - 48, 400);
      setCanvasSize(maxSize);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cellSize = canvasSize / GRID_SIZE;

  // Generate random food position
  

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = "#d1fae5";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#065f46" : "#10b981";
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }, [snake, food, canvasSize, cellSize]);

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameRunning(false);
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameRunning(false);
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10;
          setBestScore((best) => Math.max(best, newScore));
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      const key = e.key;
      const currentDir = directionRef.current;

      if (key === "ArrowUp" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: -1 };
      } else if (key === "ArrowDown" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: 1 };
      } else if (key === "ArrowLeft" && currentDir.x === 0) {
        directionRef.current = { x: -1, y: 0 };
      } else if (key === "ArrowRight" && currentDir.x === 0) {
        directionRef.current = { x: 1, y: 0 };
      }

      setDirection(directionRef.current);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameRunning]);

  // Game loop effect
  useEffect(() => {
    if (gameRunning) {
      gameLoopRef.current = window.setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameRunning, gameLoop]);

  // Initialize canvas and draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = `${canvasSize}px`;
      canvas.style.height = `${canvasSize}px`;
    }
    draw();
  }, [draw, canvasSize]);

  const handleStartPause = () => {
    if (gameOver) return;
    setGameRunning(!gameRunning);
  };

  const handleReset = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: 15, y: 15 });
    setGameRunning(false);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-linear-0-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Snake</h1>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Card className="p-4 mb-4">
          <canvas className="border border-gray-300 mx-auto block" ref={canvasRef} />
          {gameOver && (
            <div className="text-center mt-4">
              <p className="text-red-600 font-bold text-xl">Game Over!</p>
              <p className="text-gray-600">Press Reset to play again</p>
            </div>
          )}
        </Card>

        <div className="text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <span className="font-semibold">Score: {score}</span>
            <span className="font-semibold">Best: {bestScore}</span>
          </div>

          <div className="space-y-2">
            <Button size="sm" onClick={handleStartPause} disabled={gameOver}>
              {gameRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <p className="text-xs text-gray-600">Use arrow keys to control the snake</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snake;
