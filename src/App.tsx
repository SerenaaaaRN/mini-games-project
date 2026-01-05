import { useState } from "react";
import "./App.css";
import { type GameType, type Category } from "./types";
import { Button } from "./components/ui/button";
import { games } from "./data/dataGame";
import { Card, CardDescription, CardTitle } from "./components/ui/card";
import { Play } from "lucide-react";

const categories: Category[] = ["All", "Arcade", "Puzzle", "Strategy", "Action"];

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");
  const [selectedCategory, setselectedCategory] = useState<Category>("All");

  const filteredGames = selectedCategory === "All" ? games : games.filter((game) => game.category === selectedCategory);

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
              variant={"ghost"}
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
              {game.isNew && (
                <div className="absolute top-3 right-3 bg-black text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                  NEW
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
