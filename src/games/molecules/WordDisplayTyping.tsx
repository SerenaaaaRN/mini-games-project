interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  typedWord: string;
}

export const WordDisplay = ({ words, currentIndex, typedWord }: WordDisplayProps) => {
  const getCharColor = (charIdx: number, word: string) => {
    if (charIdx >= typedWord.length) return "text-gray-400";
    return typedWord[charIdx] === word[charIdx] ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-6 min-h-[120px]">
      <div className="flex flex-wrap gap-3 text-xl leading-relaxed">
        {words.slice(currentIndex, currentIndex + 10).map((word, idx) => (
          <span
            key={`${currentIndex + idx}`}
            className={`px-2 py-1 rounded ${idx === 0 ? "bg-white shadow-md font-medium" : "text-gray-400"}`}
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
