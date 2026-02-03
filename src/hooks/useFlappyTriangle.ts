import { Obstacle, TrianglePlayer } from "@/types/flappyTriangle";
import { useState, useEffect, useCallback } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TRIANGLE_SIZE = 20;
const GRAVITY = 0.4;
const JUMP_FORCE = -6;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 200;
const OBSTACLE_SPEED = 3;

export const useFlappyTriangle = () => {
  const [triangle, setTriangle] = useState<TrianglePlayer>({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");

  const resetGame = useCallback(() => {
    setTriangle({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 });
    setObstacles([]);
    setScore(0);
    setGameRunning(false);
    setGameOver(false);
    setGameState("menu");
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setGameRunning(true);
    setTriangle({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 });
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  }, []);

  const jump = useCallback(() => {
    if (gameState === "menu") {
      startGame();
      return;
    }
    if (gameState === "gameOver") {
      resetGame();
      return;
    }
    if (gameState === "playing") {
      setTriangle((prev) => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, [gameState, startGame, resetGame]);

  const generateObstacle = useCallback((x: number): Obstacle => {
    const topHeight = Math.random() * (CANVAS_HEIGHT - OBSTACLE_GAP - 100) + 50;
    return {
      x,
      topHeight,
      bottomHeight: CANVAS_HEIGHT - topHeight - OBSTACLE_GAP,
      width: OBSTACLE_WIDTH,
      passed: false,
    };
  }, []);

  const checkCollision = useCallback((currTriangle: TrianglePlayer, currObstacles: Obstacle[]): boolean => {
    if (currTriangle.y <= 0 || currTriangle.y >= CANVAS_HEIGHT - TRIANGLE_SIZE) {
      return true;
    }
    for (const obstacle of currObstacles) {
      if (
        currTriangle.x + TRIANGLE_SIZE > obstacle.x &&
        currTriangle.x < obstacle.x + obstacle.width &&
        (currTriangle.y < obstacle.topHeight || currTriangle.y + TRIANGLE_SIZE > CANVAS_HEIGHT - obstacle.bottomHeight)
      ) {
        return true;
      }
    }
    return false;
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setTriangle((prev) => ({
      ...prev,
      velocity: prev.velocity + GRAVITY,
      y: prev.y + prev.velocity,
    }));

    setObstacles((prev) => {
      let newObstacles = prev.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - OBSTACLE_SPEED,
      }));

      newObstacles = newObstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

      if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < CANVAS_WIDTH - 200) {
        newObstacles.push(generateObstacle(CANVAS_WIDTH));
      }

      newObstacles.forEach((obstacle) => {
        if (!obstacle.passed && obstacle.x + obstacle.width < triangle.x) {
          obstacle.passed = true;
          setScore((prevScore) => prevScore + 1);
        }
      });

      return newObstacles;
    });
  }, [gameRunning, gameOver, triangle.x, generateObstacle]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    if (gameRunning && checkCollision(triangle, obstacles)) {
      setGameOver(true);
      setGameRunning(false);
      setGameState("gameOver");
      if (score > bestScore) {
        setBestScore(score);
      }
    }
  }, [triangle, obstacles, gameRunning, checkCollision, score, bestScore]);

  return {
    state: { triangle, obstacles, score, bestScore, gameRunning, gameOver, gameState },
    actions: { jump, resetGame, startGame },
    constants: { CANVAS_WIDTH, CANVAS_HEIGHT, TRIANGLE_SIZE },
  };
};
