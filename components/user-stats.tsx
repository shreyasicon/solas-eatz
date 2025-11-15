"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Receipt, Ticket, Star, DollarSign, Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getSupabase } from "@/lib/supabase"
import { mockUserStats } from "@/lib/mock-data"

interface Stats {
  totalBills: number
  totalSpent: number
  totalCoupons: number
  totalReviews: number
}

export function UserStats() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalBills: 0,
    totalSpent: 0,
    totalCoupons: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        const wallet = publicKey.toString()

        // Fetch bills
        const { data: bills } = await supabase.from("bills").select("amount").eq("customer_wallet", wallet)

        // Fetch coupons
        const { data: coupons } = await supabase.from("user_coupons").select("id").eq("user_wallet", wallet)

        // Fetch reviews
        const { data: reviews } = await supabase.from("reviews").select("id").eq("customer_wallet", wallet)

        if (!bills && !coupons && !reviews) {
          setStats({
            totalBills: mockUserStats.total_bills,
            totalSpent: mockUserStats.total_spent,
            totalCoupons: mockUserStats.coupons_owned,
            totalReviews: mockUserStats.reviews_written,
          })
          setLoading(false)
          return
        }

        const totalSpent = bills?.reduce((sum, bill) => sum + bill.amount, 0) || 0

        setStats({
          totalBills: bills?.length || 0,
          totalSpent,
          totalCoupons: coupons?.length || 0,
          totalReviews: reviews?.length || 0,
        })
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
        setStats({
          totalBills: mockUserStats.total_bills,
          totalSpent: mockUserStats.total_spent,
          totalCoupons: mockUserStats.coupons_owned,
          totalReviews: mockUserStats.reviews_written,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

  const statItems = [
    {
      icon: Receipt,
      label: "Bills Uploaded",
      value: stats.totalBills,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Ticket,
      label: "Coupons Owned",
      value: stats.totalCoupons,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Star,
      label: "Reviews Written",
      value: stats.totalReviews,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-semibold px-1">Your Activity</h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
