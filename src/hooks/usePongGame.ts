import { useState, useEffect, useCallback } from "react";
import { Ball, Paddle } from "@/types/pong";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const INITIAL_BALL_SPEED = 4;

export const usePongGame = () => {
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
  });

  const [playerPaddle, setPlayerPaddle] = useState<Paddle>({
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 6,
  });

  const [aiPaddle, setAiPaddle] = useState<Paddle>({
    x: CANVAS_WIDTH - 30,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 4,
  });

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED,
      dy: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
      speed: INITIAL_BALL_SPEED,
    });
  }, []);

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameRunning(false);
    setGameOver(false);
    resetBall();
    setPlayerPaddle((prev) => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
    setAiPaddle((prev) => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
  }, [resetBall]);

  const toggleGame = useCallback(() => {
    if (!gameOver) {
      setGameRunning((prev) => !prev);
    }
  }, [gameOver]);

  const checkCollision = useCallback((ball: Ball, paddle: Paddle): boolean => {
    return (
      ball.x < paddle.x + paddle.width &&
      ball.x + BALL_SIZE > paddle.x &&
      ball.y < paddle.y + paddle.height &&
      ball.y + BALL_SIZE > paddle.y
    );
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: true }));
      if (event.key === " ") {
        event.preventDefault();
        if (!gameRunning && !gameOver) {
          setGameRunning(true);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameRunning, gameOver]);

  // Game Loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const interval = setInterval(() => {
      // Move player paddle
      setPlayerPaddle((prev) => {
        let newY = prev.y;
        if (keys["ArrowUp"] && newY > 0) {
          newY -= prev.speed;
        }
        if (keys["ArrowDown"] && newY < CANVAS_HEIGHT - prev.height) {
          newY += prev.speed;
        }
        return { ...prev, y: newY };
      });

      // Move AI paddle
      setAiPaddle((prev) => {
        const ballCenterY = ball.y + BALL_SIZE / 2;
        const paddleCenterY = prev.y + prev.height / 2;
        let newY = prev.y;

        if (ballCenterY < paddleCenterY - 10) {
          newY -= prev.speed;
        } else if (ballCenterY > paddleCenterY + 10) {
          newY += prev.speed;
        }

        newY = Math.max(0, Math.min(CANVAS_HEIGHT - prev.height, newY));
        return { ...prev, y: newY };
      });

      // Move ball
      setBall((prev) => {
        const newBall = {
          ...prev,
          x: prev.x + prev.dx,
          y: prev.y + prev.dy,
        };

        // Wall collision
        if (newBall.y <= 0 || newBall.y >= CANVAS_HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Paddle collision
        if (checkCollision(newBall, playerPaddle)) {
          newBall.dx = Math.abs(newBall.dx);
          newBall.speed += 0.2;
          newBall.dx = newBall.speed * (newBall.dx > 0 ? 1 : -1);
        }

        if (checkCollision(newBall, aiPaddle)) {
          newBall.dx = -Math.abs(newBall.dx);
          newBall.speed += 0.2;
          newBall.dx = newBall.speed * (newBall.dx > 0 ? 1 : -1);
        }

        // Scoring
        if (newBall.x <= 0) {
          setAiScore((s) => s + 1);
          setTimeout(resetBall, 1000);
          return prev;
        }

        if (newBall.x >= CANVAS_WIDTH) {
          setPlayerScore((s) => s + 1);
          setTimeout(resetBall, 1000);
          return prev;
        }

        return newBall;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameRunning, gameOver, keys, ball, playerPaddle, aiPaddle, checkCollision, resetBall]);

  // Check Game Over
  useEffect(() => {
    if (playerScore >= 5 || aiScore >= 5) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [playerScore, aiScore]);

  return {
    state: { ball, playerPaddle, aiPaddle, playerScore, aiScore, gameRunning, gameOver },
    actions: { resetGame, toggleGame },
    constants: { CANVAS_WIDTH, CANVAS_HEIGHT, BALL_SIZE },
  };
};
