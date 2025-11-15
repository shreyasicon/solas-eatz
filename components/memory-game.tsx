"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface MemoryGameProps {
  onBack: () => void
  onWin: (points: number) => void
}

const emojis = ["🍕", "🍔", "🍣", "🍜", "🍰", "☕", "🥗", "🌮"]

export function MemoryGame({ onBack, onWin }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped])
        setFlipped([])

        if (matched.length + 2 === cards.length) {
          const points = Math.max(200 - moves * 10, 50)
          setGameWon(true)
          onWin(points)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </Button>

      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Memory Match</h2>
          <div className="text-sm font-semibold">Moves: {moves}</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${
                flipped.includes(index) || matched.includes(index)
                  ? "bg-gradient-to-br from-primary to-accent text-white scale-105"
                  : "bg-muted hover:bg-muted/80 hover:scale-105"
              }`}
            >
              {flipped.includes(index) || matched.includes(index) ? emoji : "?"}
            </button>
          ))}
        </div>

        {gameWon && (
          <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
            <h3 className="text-2xl font-bold text-green-500 mb-2">You Won!</h3>
            <p className="text-sm text-muted-foreground mb-4">Completed in {moves} moves</p>
            <Button onClick={initGame} className="bg-gradient-to-r from-primary to-accent">
              Play Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
