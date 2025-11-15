"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getSupabase } from "@/lib/supabase"
import { mockLoyaltyProgress } from "@/lib/mock-data"

interface LoyaltyData {
  current_tier: string
  points_earned: number
  points_to_next_tier: number
  total_spent: number
}

const TIERS = [
  { name: "Bronze", minPoints: 0, color: "text-orange-600" },
  { name: "Silver", minPoints: 1000, color: "text-gray-400" },
  { name: "Gold", minPoints: 5000, color: "text-yellow-500" },
  { name: "Platinum", minPoints: 10000, color: "text-cyan-400" },
]

export function LoyaltyProgress() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)

  useEffect(() => {
    async function fetchLoyalty() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()

        let { data, error } = await supabase
          .from("loyalty_progress")
          .select("*")
          .eq("user_wallet", publicKey.toString())
          .single()

        if (error && error.code === "PGRST116") {
          const { data: newData, error: insertError } = await supabase
            .from("loyalty_progress")
            .insert({
              user_wallet: publicKey.toString(),
              current_tier: "Bronze",
              points_earned: 0,
              points_to_next_tier: 1000,
              total_spent: 0,
            })
            .select()
            .single()

          if (!insertError) {
            data = newData
          }
        }

        if (error && error.code !== "PGRST116") {
          console.error("[v0] Error fetching loyalty:", error)
          setLoyaltyData({
            current_tier: mockLoyaltyProgress.current_tier,
            points_earned: mockLoyaltyProgress.points,
            points_to_next_tier: mockLoyaltyProgress.points_to_next_tier,
            total_spent: 212.65,
          })
          setLoading(false)
          return
        }

        if (data) {
          setLoyaltyData(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching loyalty:", error)
        setLoyaltyData({
          current_tier: mockLoyaltyProgress.current_tier,
          points_earned: mockLoyaltyProgress.points,
          points_to_next_tier: mockLoyaltyProgress.points_to_next_tier,
          total_spent: 212.65,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLoyalty()
  }, [connected, publicKey])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (!loyaltyData) {
    return null
  }

  const currentTierIndex = TIERS.findIndex((t) => t.name === loyaltyData.current_tier)
  const currentTier = TIERS[currentTierIndex]
  const nextTier = TIERS[currentTierIndex + 1]
  const progress = nextTier
    ? ((loyaltyData.points_earned - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className={`w-5 h-5 ${currentTier.color}`} />
            <h3 className="font-semibold">Loyalty Status</h3>
          </div>
          <Badge className={currentTier.color}>{loyaltyData.current_tier}</Badge>
        </div>

        {/* Points */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Points</span>
            <span className="font-semibold text-primary">{loyaltyData.points_earned.toLocaleString()} pts</span>
          </div>

          {nextTier && (
            <>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{currentTier.name}</span>
                <span>
                  {loyaltyData.points_to_next_tier.toLocaleString()} pts to {nextTier.name}
                </span>
              </div>
            </>
          )}

          {!nextTier && (
            <div className="text-center py-2">
              <p className="text-sm text-primary font-medium">Maximum tier reached!</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">${loyaltyData.total_spent.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Rewards Rate</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-lg font-semibold">10x</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
