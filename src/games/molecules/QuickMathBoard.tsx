import { Question } from "@/types/quickmath";
import { Card } from "@/components/ui/card";

interface QuickMathBoardProps {
  question: Question | null;
  selected: number | null;
  running: boolean;
  onPick: (value: number) => void;
}

export const QuickMathBoard = ({ question, selected, running, onPick }: QuickMathBoardProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Question Display */}
      <Card className="p-4 sm:p-6 text-center">
        <div className="text-sm text-gray-500 mb-2">Solve</div>
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
          {question ? (
            <>
              {question.a} {question.op} {question.b} = ?
            </>
          ) : (
            "..."
          )}
        </div>
      </Card>

      {/* Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {question?.options.map((opt) => {
          const isRight = selected !== null && opt === question.answer;
          const isWrongPick = selected === opt && opt !== question.answer;

          return (
            <button
              key={opt}
              className={`rounded-xl border p-4 sm:p-5 text-lg sm:text-xl font-semibold transition-all
                ${isRight ? "bg-green-500 text-white border-green-500" : ""}
                ${isWrongPick ? "bg-red-500 text-white border-red-500" : ""}
                ${selected === null ? "bg-white hover:bg-gray-50 border-gray-200 text-black" : ""}
              `}
              onClick={() => onPick(opt)}
              disabled={!running || selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
