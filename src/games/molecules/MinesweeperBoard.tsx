import { Cell } from "@/types/minesweeper";
import { Flag, Bomb } from "lucide-react";

interface MinesweeperBoardProps {
  board: Cell[][];
  cols: number;
  onCellClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

export const MinesweeperBoard = ({ board, cols, onCellClick, onRightClick }: MinesweeperBoardProps) => {
  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return <Flag className="w-4 h-4 text-red-500" />;
    if (!cell.isRevealed) return null;
    if (cell.isMine) return <Bomb className="w-4 h-4 text-gray-800" />;
    if (cell.adjacentMines > 0) {
      const colors = [
        "",
        "text-blue-500",
        "text-green-600",
        "text-red-500",
        "text-purple-700",
        "text-maroon-700",
        "text-cyan-500",
        "text-black",
        "text-gray-500",
      ];
      return <span className={`font-bold ${colors[cell.adjacentMines]}`}>{cell.adjacentMines}</span>;
    }
    return null;
  };

  return (
    <div className="bg-gray-300 p-1 inline-block">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 24px)` }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              onContextMenu={(e) => onRightClick(e, r, c)}
              className={`w-6 h-6 flex items-center justify-center text-sm border
                ${
                  cell.isRevealed
                    ? "bg-gray-200 border-gray-300"
                    : "bg-gray-400 border-l-gray-100 border-t-gray-100 border-r-gray-500 border-b-gray-500 hover:bg-gray-300"
                } cursor-pointer select-none`}
            >
              {getCellContent(cell)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
