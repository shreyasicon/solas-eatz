"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Gamepad2, Trophy, Zap, Star, Gift } from "lucide-react"
import { useState } from "react"
import { SpinWheelGame } from "@/components/spin-wheel-game"
import { MemoryGame } from "@/components/memory-game"

export default function EarnPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)

  return (
    <div className="min-h-screen pb-20 lg:pl-64">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Earn Rewards
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{totalPoints} pts</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!selectedGame ? (
          <>
            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Play While You Wait</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn reward points by playing mini-games while waiting for your food. Redeem points for exclusive
                    coupons!
                  </p>
                </div>
              </div>
            </Card>

            {/* Games Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card
                className="p-6 space-y-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedGame("spin")}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Spin the Wheel</h3>
                  <p className="text-sm text-muted-foreground mb-4">Spin daily for instant rewards</p>
                  <div className="flex items-center justify-center gap-2 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">10-100 pts</span>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 space-y-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedGame("memory")}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Memory Match</h3>
                  <p className="text-sm text-muted-foreground mb-4">Match food items to win points</p>
                  <div className="flex items-center justify-center gap-2 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">50-200 pts</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 opacity-50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Daily Quiz</h3>
                  <p className="text-sm text-muted-foreground mb-4">Test your food knowledge</p>
                  <span className="text-xs font-semibold text-muted-foreground">Coming Soon</span>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 opacity-50">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Speed Tap</h3>
                  <p className="text-sm text-muted-foreground mb-4">Tap as fast as you can</p>
                  <span className="text-xs font-semibold text-muted-foreground">Coming Soon</span>
                </div>
              </Card>
            </div>
          </>
        ) : selectedGame === "spin" ? (
          <SpinWheelGame
            onBack={() => setSelectedGame(null)}
            onWin={(points) => setTotalPoints((prev) => prev + points)}
          />
        ) : (
          <MemoryGame
            onBack={() => setSelectedGame(null)}
            onWin={(points) => setTotalPoints((prev) => prev + points)}
          />
        )}
      </main>

      <Navigation />
    </div>
  )
}
