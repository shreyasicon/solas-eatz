"use client"

import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet-button"
import { RestaurantList } from "@/components/restaurant-list"
import { RestaurantMap } from "@/components/restaurant-map"
import { SearchBar } from "@/components/search-bar"
import { Sparkles, List, MapIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 bg-muted/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Discover</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-background border-b border-border">
          <div className="max-w-2xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* View Toggle */}
            <div className="flex gap-2 mt-3">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1 sm:flex-none sm:px-6"
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="flex-1 sm:flex-none sm:px-6"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <RestaurantList searchQuery={searchQuery} />
        ) : (
          <RestaurantMap searchQuery={searchQuery} />
        )}
      </div>

      <Navigation />
    </div>
  )
}
