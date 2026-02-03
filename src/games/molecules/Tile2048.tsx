const TILE_COLORS: Record<number, string> = {
  2: "bg-gray-100 text-gray-800",
  4: "bg-gray-200 text-gray-800",
  8: "bg-orange-200 text-orange-800",
  16: "bg-orange-300 text-orange-900",
  32: "bg-orange-400 text-white",
  64: "bg-orange-500 text-white",
  128: "bg-yellow-400 text-white",
  256: "bg-yellow-500 text-white",
  512: "bg-yellow-600 text-white",
  1024: "bg-red-400 text-white",
  2048: "bg-red-500 text-white",
};

export const Tile = ({ value }: { value: number | null }) => {
  const colorClass = value ? TILE_COLORS[value] || "bg-purple-500 text-white" : "bg-gray-200 scale-95";
  const sizeClass =
    value && value >= 1024
      ? "text-xs sm:text-sm"
      : value && value >= 128
      ? "text-sm sm:text-base"
      : "text-base sm:text-lg";

  return (
    <div
      className={`aspect-square rounded-lg flex items-center justify-center font-bold transition-all duration-200 transform ${colorClass} ${sizeClass}`}
    >
      {value || ""}
    </div>
  );
};
