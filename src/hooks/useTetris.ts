import { TetrisGameState, TetrisPiece } from "@/types/tetris";
import { useCallback, useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
export const CANVAS_WIDTH = BOARD_WIDTH * BLOCK_SIZE;
export const CANVAS_HEIGHT = BOARD_HEIGHT * BLOCK_SIZE;

const PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: "#00f5ff" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffed00",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#a000f0",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#00f000",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#f00000",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#0000f0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#ff7f00",
  },
};

export const useTetris = (themeColor: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(null);
  const dropTimeRef = useRef<number>(0);

  //react state untuk update ui
  const [stats, setStats] = useState<TetrisGameState>({
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
    gameState: "menu",
  });

  const gameStateRef = useRef({
    board: Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as TetrisPiece | null,
    nextPiece: null as TetrisPiece | null,
    score: 0,
    level: 1,
    lines: 0,
    dropTime: 1000,
  });

  const createPiece = useCallback((): TetrisPiece => {
    const pieceTypes = Object.keys(PIECES) as (keyof typeof PIECES)[];
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    const piece = PIECES[randomType];
    return {
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
    };
  }, []);

  const isValidMove = (piece: TetrisPiece, board: any[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    const { currentPiece, board } = gameStateRef.current;
    if (!currentPiece) return;

    currentPiece.shape.forEach((row, y) =>
      row.forEach((value, x) => {
        if (value) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) board[boardY][boardX] = currentPiece.color;
        }
      })
    );

    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every((cell: any) => cell !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      gameStateRef.current.lines += linesCleared;
      gameStateRef.current.score += linesCleared * 100 * gameStateRef.current.level;
      gameStateRef.current.level = Math.floor(gameStateRef.current.lines / 10) + 1;
      gameStateRef.current.dropTime = Math.max(100, 1000 - (gameStateRef.current.level - 1) * 100);

      setStats((prev) => ({
        ...prev,
        score: gameStateRef.current.score,
        lines: gameStateRef.current.lines,
        level: gameStateRef.current.level,
      }));
    }

    gameStateRef.current.currentPiece = gameStateRef.current.nextPiece;
    gameStateRef.current.nextPiece = createPiece();

    if (gameStateRef.current.currentPiece && !isValidMove(gameStateRef.current.currentPiece, board)) {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setStats((prev) => ({
      ...prev,
      gameState: "gameOver",
      highScore: Math.max(prev.highScore, gameStateRef.current.score),
    }));
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  };

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      const { currentPiece, board } = gameStateRef.current;
      if (!currentPiece || stats.gameState !== "playing") return false;

      const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
      if (isValidMove(newPiece, board)) {
        gameStateRef.current.currentPiece = newPiece;
        return true;
      }
      return false;
    },
    [stats.gameState]
  );

  const rotatePiece = useCallback(() => {
    const { currentPiece, board } = gameStateRef.current;
    if (!currentPiece || stats.gameState !== "playing") return;

    const rotatedShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map((row) => row[index]).reverse());
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };

    // Wall kick (basic)
    if (isValidMove(rotatedPiece, board)) {
      gameStateRef.current.currentPiece = rotatedPiece;
    } else {
      // Try moving left/right if rotation hits wall
      const kickedLeft = { ...rotatedPiece, x: rotatedPiece.x - 1 };
      const kickedRight = { ...rotatedPiece, x: rotatedPiece.x + 1 };
      if (isValidMove(kickedLeft, board)) gameStateRef.current.currentPiece = kickedLeft;
      else if (isValidMove(kickedRight, board)) gameStateRef.current.currentPiece = kickedRight;
    }
  }, [stats.gameState]);

  const dropPiece = useCallback(() => {
    if (stats.gameState !== "playing") return;
    if (!movePiece(0, 1)) {
      placePiece();
    }
  }, [stats.gameState, movePiece]);

  const draw = useCallback(
    (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (stats.gameState === "playing" && currentTime - dropTimeRef.current > gameStateRef.current.dropTime) {
        dropPiece();
        dropTimeRef.current = currentTime;
      }

      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE);
        ctx.stroke();
      }

      gameStateRef.current.board.forEach((row, y) =>
        row.forEach((value, x) => {
          if (value) {
            ctx.fillStyle = value as string;
            ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            // Add 8-bit highlight
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, 4, 4);
          }
        })
      );

      const { currentPiece, nextPiece } = gameStateRef.current;
      if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        currentPiece.shape.forEach((row, y) =>
          row.forEach((value, x) => {
            if (value) {
              ctx.fillStyle = currentPiece.color;
              ctx.fillRect(
                (currentPiece.x + x) * BLOCK_SIZE + 1,
                (currentPiece.y + y) * BLOCK_SIZE + 1,
                BLOCK_SIZE - 2,
                BLOCK_SIZE - 2
              );
              ctx.fillStyle = "rgba(255,255,255,0.3)";
              ctx.fillRect((currentPiece.x + x) * BLOCK_SIZE + 1, (currentPiece.y + y) * BLOCK_SIZE + 1, 4, 4);
            }
          })
        );
      }

      if (nextPiece) {
        ctx.fillStyle = "#171717";
        ctx.font = "bold 16px 'Press Start 2P', sans-serif";
        ctx.fillText("Next:", CANVAS_WIDTH + 20, 140);

        nextPiece.shape.forEach((row, y) =>
          row.forEach((value, x) => {
            if (value) {
              ctx.fillStyle = nextPiece.color;
              ctx.fillRect(CANVAS_WIDTH + 20 + x * 20, 160 + y * 20, 18, 18);
            }
          })
        );
      }

      // Border
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (stats.gameState === "playing") {
        gameLoopRef.current = requestAnimationFrame(draw);
      }
    },
    [stats.gameState, themeColor, dropPiece]
  );

  useEffect(() => {
    if (stats.gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [stats.gameState, draw]);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset Logic
    canvas.width = CANVAS_WIDTH + 150; // Extra width for UI
    canvas.height = CANVAS_HEIGHT;

    gameStateRef.current = {
      board: Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: createPiece(),
      nextPiece: createPiece(),
      score: 0,
      level: 1,
      lines: 0,
      dropTime: 1000,
    };

    setStats((prev) => ({ ...prev, score: 0, level: 1, lines: 0, gameState: "playing" }));
  };

  const resetGame = () => setStats((prev) => ({ ...prev, gameState: "menu" }));
  const pauseGame = () => setStats((prev) => ({ ...prev, gameState: "menu" }));
  const resumeGame = () => setStats((prev) => ({ ...prev, gameState: "playing" }));

  return {
    canvasRef,
    stats,
    actions: {
      startGame,
      resetGame,
      pauseGame,
      resumeGame,
      movePiece,
      rotatePiece,
      dropPiece,
    },
  };
};
