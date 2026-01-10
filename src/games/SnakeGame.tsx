import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { themeGame } from "@/types";
import { ArrowLeft, Pause, Play, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

type Position = { x: number; y: number };

const Snake = ({ onBack, themeColor = "#22c55e" }: themeGame) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameRunning(false);
    setGameOver(false);
  }, []);

  const toggleGameRunning = useCallback(() => {
    if (gameOver) {
      resetGame();
    } else {
      setGameRunning((prev) => !prev);
    }
  }, [gameOver, resetGame]);

  const changeDirection = useCallback((newDirection: Position) => {
    setDirection((prevDirection) => {
      // Prevent reversing direction
      if (newDirection.x === -prevDirection.x && newDirection.y === -prevDirection.y) {
        return prevDirection;
      }
      return newDirection;
    });
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        setBestScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        setBestScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [gameRunning, gameOver, direction, food, score, generateFood]);

  // Game loop - fixed dependency array
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = themeColor;
    snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, 3, 3);
        ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 4, 3, 3);
        ctx.fillStyle = themeColor;
      }
    });

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x * GRID_SIZE + 1, food.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);

    // Game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Fixed rgba syntax
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 30);
      ctx.font = "18px Arial";
      ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      ctx.fillText(`Best: ${bestScore}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 25);
      ctx.font = "14px Arial";
      ctx.fillText("Press Start to play again", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);
      ctx.textAlign = "left";
    }
  }, [snake, food, gameOver, score, bestScore, themeColor]);

  // Keyboard control
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleGameRunning();
        return;
      }

      if (!gameRunning || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          changeDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          changeDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          changeDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameRunning, gameOver, toggleGameRunning, changeDirection]);

  return (
    <div className="min-h-screen bg-linear-0-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold text-gray-800">Snake</h1>

          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Card className="p-4 mb-4">
          <canvas
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border border-gray-300 mx-auto block"
            ref={canvasRef}
          />
        </Card>

        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4 text-sm text-gray-700">
            <span className="font-semibold">Score: {score}</span>
            <span className="font-semibold">Best: {bestScore}</span>
          </div>

          <div className="flex justify-center gap-2">
            <Button onClick={toggleGameRunning} style={{ backgroundColor: themeColor }}>
              {gameRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {gameOver ? "Play Again" : gameRunning ? "Pause" : "Start"}
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => changeDirection({ x: 0, y: -1 })}
              disabled={!gameRunning || gameOver}
              className="w-16 h-16"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => changeDirection({ x: -1, y: 0 })}
                disabled={!gameRunning || gameOver}
                className="w-16 h-16"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => changeDirection({ x: 0, y: 1 })}
                disabled={!gameRunning || gameOver}
                className="w-16 h-16"
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => changeDirection({ x: 1, y: 0 })}
                disabled={!gameRunning || gameOver}
                className="w-16 h-16"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-2">Use arrow keys (or WASD) to control the snake</p>
        </div>
      </div>
    </div>
  );
};

export default Snake;
