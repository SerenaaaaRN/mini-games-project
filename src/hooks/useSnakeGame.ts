import { useState, useEffect, useCallback } from "react";
import { Position } from "@/types/snake";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Position = { x: 1, y: 0 };
const GAME_SPEED = 150;

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    const maxGrid = CANVAS_SIZE / GRID_SIZE;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxGrid),
        y: Math.floor(Math.random() * maxGrid),
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

  const changeDirection = useCallback((newDir: Position) => {
    setDirection((prev) => {
      if (newDir.x === -prev.x && newDir.y === -prev.y) return prev;
      return newDir;
    });
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake((prevSnake) => {
      const head = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // Wall Collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        setBestScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        setBestScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [gameRunning, gameOver, direction, food, score, generateFood]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return {
    state: { snake, food, score, bestScore, gameRunning, gameOver },
    actions: { resetGame, setGameRunning, changeDirection },
    constants: { GRID_SIZE, CANVAS_SIZE },
  };
};
