"use client";

import { useState } from "react";
import Link from "next/link";
import { games } from "@/data/listGames";
import { type Category } from "@/types";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { Play } from "lucide-react";

const categories: Category[] = ["All", "Arcade", "Puzzle", "Strategy", "Action"];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredGames = selectedCategory === "All" ? games : games.filter((game) => game.category === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-[#c9dfac] dark:bg-[#2d2a2e] text-[#2d2a2e] dark:text-[#fdf6e3] p-8 font-pixel">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="bg-white text-black mb-2">
            PROJECT BY RILLAH
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest leading-relaxed text-shadow-sm">
            Mini Games Arcade
          </h1>
          <p className="text-sm uppercase tracking-wider opacity-75">Select a cartridge to start</p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="uppercase text-xs"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredGames.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id} className="group block h-full">
              <Card className="h-full hover:-translate-y-1 transition-transform cursor-pointer flex flex-col relative bg-white dark:bg-black">
              
                <div className="absolute -top-3 -right-2 z-10">
                  {game.status && (
                    <Badge
                      variant={game.status === "maintance" ? "destructive" : "default"}
                      className="text-[10px] uppercase shadow-none"
                    >
                      {game.status === "maintance" ? "Maint" : game.status}
                    </Badge>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 border-2 border-current ${game.color} bg-opacity-20`}>
                      <game.icon className="w-6 h-6" />
                    </div>
                    <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <CardTitle className="text-sm md:text-base mb-2 uppercase leading-tight">{game.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2 font-sans opacity-80">
                     
                      {game.description}
                    </CardDescription>
                  </div>

                  <div className="mt-auto pt-4">
                    <span className="text-[10px] border border-current px-2 py-1 uppercase opacity-60">
                      {game.category}
                    </span>
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
