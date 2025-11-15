"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useState } from "react"

interface SpinWheelGameProps {
  onBack: () => void
  onWin: (points: number) => void
}

export function SpinWheelGame({ onBack, onWin }: SpinWheelGameProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const prizes = [10, 25, 50, 75, 100]

  const handleSpin = () => {
    setSpinning(true)
    setResult(null)

    setTimeout(() => {
      const won = prizes[Math.floor(Math.random() * prizes.length)]
      setResult(won)
      setSpinning(false)
      onWin(won)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </Button>

      <Card className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Spin the Wheel</h2>
          <p className="text-muted-foreground">Spin once per day for rewards!</p>
        </div>

        {/* Wheel */}
        <div className="flex justify-center">
          <div
            className={`w-64 h-64 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl ${
              spinning ? "animate-spin" : ""
            }`}
          >
            <div className="w-56 h-56 rounded-full bg-background flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {result && (
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <h3 className="text-3xl font-bold text-yellow-500 mb-2">+{result} Points!</h3>
            <p className="text-sm text-muted-foreground">Come back tomorrow for another spin</p>
          </div>
        )}

        <Button
          onClick={handleSpin}
          disabled={spinning || result !== null}
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg disabled:opacity-50"
          size="lg"
        >
          {spinning ? "Spinning..." : result ? "Come Back Tomorrow" : "Spin Now"}
        </Button>
      </Card>
    </div>
  )
}
