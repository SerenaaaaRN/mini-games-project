"use client";

import { useState } from "react";
import Link from "next/link";
import { games } from "@/data/listGames";
import { type Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

const categories: Category[] = ["All", "Arcade", "Puzzle", "Strategy", "Action"];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredGames = selectedCategory === "All" ? games : games.filter((game) => game.category === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-4">
            created by{" "}
            <a href="#" className="font-medium text-black underline underline-offset-2">
              rillah
            </a>
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">Mini Games Arcade</h1>
          <p className="text-gray-600 text-lg">Simple games</p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id} className="group">
              <Card className="relative h-full hover:border-gray-500 transition-all duration-200 cursor-pointer hover:shadow-lg">
                {/* Status Badge */}
                {game.status && (
                  <div
                    className={`absolute top-3 right-3 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full z-10 ${
                      game.status === "maintance"
                        ? "bg-red-100 text-red-600"
                        : game.status === "soon"
                        ? "bg-black text-white"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {game.status === "maintance"
                      ? "Under Maintenance"
                      : game.status === "soon"
                      ? "Coming Soon"
                      : "Ready"}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${game.color} text-white`}>
                      <game.icon className="w-5 h-5" />
                    </div>

                    {/* play icon ketika di hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Play className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-lg font-semibold">{game.title}</CardTitle>

                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {game.category}
                      </span>
                    </div>

                    <CardDescription className="text-gray-600 text-sm">{game.description}</CardDescription>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
