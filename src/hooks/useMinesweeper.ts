import { useState, useEffect, useCallback } from "react";
import { Cell, GameStatus, Difficulty, DIFFICULTY_SETTINGS } from "@/types/minesweeper";

export const useMinesweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("ready");
  const [time, setTime] = useState(0);
  const [flags, setFlags] = useState(0);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);

  const createBoard = useCallback(
    (firstClickRow: number, firstClickCol: number) => {
      const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty];
      const newBoard: Cell[][] = Array(rows)
        .fill(null)
        .map(() =>
          Array(cols)
            .fill(null)
            .map(() => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }))
        );

      // Place mines, avoiding the first click
      let minesPlaced = 0;
      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!newBoard[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
          newBoard[row][col].isMine = true;
          minesPlaced++;
        }
      }

      // Calculate adjacent mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) continue;
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].adjacentMines = count;
        }
      }
      return newBoard;
    },
    [difficulty]
  );

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStatus("ready");
    setTime(0);
    setFlags(0);
    setBoard(
      Array(DIFFICULTY_SETTINGS[diff].rows)
        .fill(null)
        .map(() =>
          Array(DIFFICULTY_SETTINGS[diff].cols)
            .fill(null)
            .map(() => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }))
        )
    );
    setShowStartModal(false);
    setShowEndModal(false);
  };

  const revealCell = (row: number, col: number, currentBoard: Cell[][]): Cell[][] => {
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty];
    if (row < 0 || row >= rows || col < 0 || col >= cols || currentBoard[row][col].isRevealed) {
      return currentBoard;
    }

    let newBoard = currentBoard.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isRevealed = true;
    newBoard[row][col].isFlagged = false;

    if (newBoard[row][col].adjacentMines === 0 && !newBoard[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          newBoard = revealCell(row + dr, col + dc, newBoard);
        }
      }
    }
    return newBoard;
  };

  const checkWinCondition = (currentBoard: Cell[][]) => {
    const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty];
    const revealedCount = currentBoard.flat().filter((c) => c.isRevealed).length;
    if (rows * cols - revealedCount === mines) {
      setGameStatus("won");
      setShowEndModal(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === "won" || gameStatus === "lost" || board[row][col].isRevealed || board[row][col].isFlagged)
      return;

    let currentBoard = board;
    if (gameStatus === "ready") {
      currentBoard = createBoard(row, col);
      setGameStatus("playing");
    }

    if (currentBoard[row][col].isMine) {
      setGameStatus("lost");
      const newBoard = currentBoard.map((r) => r.map((c) => ({ ...c, isRevealed: c.isMine || c.isRevealed })));
      setBoard(newBoard);
      setShowEndModal(true);
      return;
    }

    const newBoard = revealCell(row, col, currentBoard);
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus !== "playing" || board[row][col].isRevealed) return;

    const newBoard = [...board];
    const cell = newBoard[row][col];
    if (!cell.isFlagged && flags < DIFFICULTY_SETTINGS[difficulty].mines) {
      cell.isFlagged = true;
      setFlags((f) => f + 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags((f) => f - 1);
    }
    setBoard(newBoard);
  };

  const changeDifficulty = () => {
    setShowEndModal(false);
    setShowStartModal(true);
  };

  useEffect(() => {
    if (gameStatus === "playing") {
      const timer = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStatus]);

  return {
    state: { difficulty, board, gameStatus, time, flags, showStartModal, showEndModal },
    actions: { startGame, handleCellClick, handleRightClick, changeDifficulty, setShowStartModal },
    settings: DIFFICULTY_SETTINGS,
  };
};
