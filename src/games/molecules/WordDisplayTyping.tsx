interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  typedWord: string;
}

export const WordDisplay = ({ words, currentIndex, typedWord }: WordDisplayProps) => {
  const getCharColor = (charIdx: number, word: string) => {
    if (charIdx >= typedWord.length) return "text-gray-400";
    return typedWord[charIdx] === word[charIdx] ? "text-green-600" : "text-red-500";
  };

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6 min-h-[100px] md:min-h-[140px] flex items-center shadow-inner">
      <div className="flex flex-wrap gap-2 md:gap-3 text-lg md:text-2xl leading-relaxed font-mono">
        {words.slice(currentIndex, currentIndex + 12).map((word, idx) => (
          <span
            key={`${currentIndex + idx}`}
            className={`px-2 py-1 rounded transition-all duration-200 ${
              idx === 0
                ? "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] font-bold border border-gray-200 scale-105"
                : "text-gray-400 opacity-60"
            }`}
          >
            {idx === 0
              ? word.split("").map((char, cIdx) => (
                  <span key={cIdx} className={getCharColor(cIdx, word)}>
                    {char}
                  </span>
                ))
              : word}
          </span>
        ))}
      </div>
    </div>
  );
};
