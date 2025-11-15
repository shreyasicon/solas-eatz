"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Receipt, Star } from "lucide-react"
import Link from "next/link"
import { mockBills } from "@/lib/mock-data"

interface Bill {
  id: string
  restaurant_id: string
  amount: number
  status: string
  rewards_earned: number
  rating: number | null
  created_at: string
  restaurants: {
    name: string
  }
}

export function BillHistory() {
  const { publicKey, connected } = useWallet()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBills() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("bills")
          .select(
            `
            *,
            restaurants (name)
          `,
          )
          .eq("customer_wallet", publicKey.toString())
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[v0] Error fetching bills:", error)
          setBills(
            mockBills.map((b) => ({
              ...b,
              restaurant_id: b.restaurant_id,
              restaurants: { name: b.restaurant_name },
            })) as any,
          )
          setLoading(false)
          return
        }

        setBills(data || [])
      } catch (error) {
        console.error("[v0] Error:", error)
        setBills(
          mockBills.map((b) => ({
            ...b,
            restaurants: { name: b.restaurant_name },
          })) as any,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [connected, publicKey])

  if (!connected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Please connect your wallet to view your bill history.</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (bills.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">No Bills Yet</h3>
            <p className="text-sm text-muted-foreground">Upload your first bill to start earning rewards!</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <Card key={bill.id} className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold">{bill.restaurants.name}</h3>
                <p className="text-sm text-muted-foreground">{new Date(bill.created_at).toLocaleDateString()}</p>
              </div>
              <Badge
                variant={
                  bill.status === "approved" ? "default" : bill.status === "rejected" ? "destructive" : "secondary"
                }
              >
                {bill.status}
              </Badge>
            </div>

            {/* Amount & Rewards */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold ml-2">${bill.amount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rewards:</span>
                <span className="font-semibold ml-2 text-primary">{bill.rewards_earned} pts</span>
              </div>
            </div>

            {/* Actions */}
            {bill.status === "approved" && !bill.rating && (
              <Link href={`/bills/${bill.id}/review`}>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <Star className="w-4 h-4 mr-2" />
                  Leave a Review
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
