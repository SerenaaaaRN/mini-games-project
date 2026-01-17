import { useState } from "react";
import "./App.css";
import { type Category, type GameType } from "./types";
import { Button } from "./components/ui/button";
import { games } from "./data/listGames";
import { Card, CardDescription, CardTitle } from "./components/ui/card";
import { ArrowLeft, Play } from "lucide-react";
import TicTacToeGame from "./games/TicTacToe/TicTacToeGame";
import Puzzle2048Game from "./games/Puzzle2048Game";
import MemoryMatchGame from "./games/MemoryMatchGame";
import TriangleGame from "./games/TriangleGame";
import SnakeGame from "./games/SnakeGame";
import PongGame from "./games/PongGame";
import TypingSpeedGame from "./games/TypingSpeedGame";

const categories: Category[] = ["All", "Arcade", "Puzzle", "Strategy", "Action"];

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");
  const [selectedCategory, setselectedCategory] = useState<Category>("All");

  const filteredGames = selectedCategory === "All" ? games : games.filter((game) => game.category === selectedCategory);

  const renderGame = () => {
    const gameData = games.find((g) => g.id === currentGame);
    const commonProps = {
      onBack: () => setCurrentGame("menu"),
      themeColor: gameData ? gameData.themeColor : "#000000",
    };
    switch (currentGame) {
      case "tic-tac-to":
        return <TicTacToeGame {...commonProps} />;
      case "snake":
        return <SnakeGame {...commonProps} />;
      case "memory-match":
        return <MemoryMatchGame {...commonProps} />;
      case "2048":
        return <Puzzle2048Game {...commonProps} />;
      case "typing-speed":
        return <TypingSpeedGame />;

      case "flappy":
        return <TriangleGame />;
      case "pong":
        return <PongGame />;
      default:
        return null;
    }
  };

  if (currentGame !== "menu") {
    return (
      <div>
        <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Home
        </Button>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-4">
            crated by{" "}
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black underline underline-offset-2"
            >
              rillah
            </a>
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">Mini Games Arcade</h1>
          <p className="text-gray-600 text-lg">Simple games</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setselectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="relative hover:border-gray-500 transition-all duration-200 cursor-pointer hover:shadow-lg"
              onClick={() => setCurrentGame(game.id)}
            >
              {game.status && (
                <div
                  className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full z-10 ${
                    game.status === "maintance"
                      ? "bg-red-100 text-red-600"
                      : game.status === "soon"
                      ? "bg-black text-white"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {game.status === "maintance" ? "Under Maintenance" : game.status === "soon" ? "Coming Soon" : "Ready"}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${game.color} text-white`}>
                    <game.icon className="w-5 h-5" />
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="items-center justify-between mb-4">
                    <CardTitle className="text-lg font-semibold">{game.title}</CardTitle>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{game.category}</span>
                  </div>

                  <CardDescription className="text-gray-600 text-sm">{game.description}</CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
