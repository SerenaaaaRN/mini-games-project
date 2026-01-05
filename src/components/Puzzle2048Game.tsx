import { useState } from "react";

interface Puzzle2048GameProps {
  onBack: () => void;
  themeColor: string;
}



type Board = (number | null)[][]
type Derection = "up" | "down" | "left" | "right";

const Puzzle2048Game = ({ onBack, themeColor }: Puzzle2048GameProps) => {
    const [board, setBoard] = useState();
    const [score, setScore] = useState(0);





    function initialBoard(): Board {
      const newBoard: Board = Array(4).fill.map(() => Array(4).fill(null));
      addRandom;
    }
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
};

export default Puzzle2048Game;
