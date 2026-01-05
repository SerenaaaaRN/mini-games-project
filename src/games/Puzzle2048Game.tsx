import { useState } from "react";



type Board = (number | null)[][];
type Derection = "up" | "down" | "left" | "right";

const Puzzle2048Game = ({ onBack, themeColor }: Puzzle2048GameProps) => {
  const [board, setBoard] = useState();
  const [score, setScore] = useState(0);

  function initialBoard(): Board {
    const newBoard: Board = Array(4).fill.map(() => Array(4).fill(null));
  }
  return (
    <div className="grid h-screen place-items-center">
      <h1 className="text-4xl font-bold ">Hello world</h1>
      <p className="font-semibold">Game Nya belum jadi</p>
    </div>
  );
};

export default Puzzle2048Game;
