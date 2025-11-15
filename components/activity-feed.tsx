"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Ticket, Star, Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getSupabase } from "@/lib/supabase"
import { mockActivities } from "@/lib/mock-data"

interface Activity {
  id: string
  type: "bill" | "coupon" | "review"
  title: string
  description: string
  timestamp: string
  status?: string
}

export function ActivityFeed() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    async function fetchActivities() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        const wallet = publicKey.toString()
        const allActivities: Activity[] = []

        // Fetch recent bills
        const { data: bills } = await supabase
          .from("bills")
          .select("id, amount, status, created_at, restaurants(name)")
          .eq("customer_wallet", wallet)
          .order("created_at", { ascending: false })
          .limit(5)

        bills?.forEach((bill: any) => {
          allActivities.push({
            id: bill.id,
            type: "bill",
            title: "Bill Uploaded",
            description: `$${bill.amount.toFixed(2)} at ${bill.restaurants.name}`,
            timestamp: bill.created_at,
            status: bill.status,
          })
        })

        // Fetch recent coupons
        const { data: coupons } = await supabase
          .from("user_coupons")
          .select("id, status, created_at, coupons(type, restaurants(name))")
          .eq("user_wallet", wallet)
          .order("created_at", { ascending: false })
          .limit(5)

        coupons?.forEach((coupon: any) => {
          allActivities.push({
            id: coupon.id,
            type: "coupon",
            title: "Coupon Purchased",
            description: `${coupon.coupons.type} at ${coupon.coupons.restaurants.name}`,
            timestamp: coupon.created_at,
            status: coupon.status,
          })
        })

        // Fetch recent reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("id, rating, created_at, restaurants(name)")
          .eq("customer_wallet", wallet)
          .order("created_at", { ascending: false })
          .limit(5)

        reviews?.forEach((review: any) => {
          allActivities.push({
            id: review.id,
            type: "review",
            title: "Review Posted",
            description: `${review.rating} stars for ${review.restaurants.name}`,
            timestamp: review.created_at,
          })
        })

        if (!bills && !coupons && !reviews) {
          setActivities(
            mockActivities.map((a) => ({
              id: a.id,
              type: a.type as any,
              title: a.description,
              description: a.amount ? `$${a.amount}` : a.rating ? `${a.rating} stars` : "",
              timestamp: a.date,
              status: a.status,
            })),
          )
          setLoading(false)
          return
        }

        // Sort by timestamp
        allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        setActivities(allActivities.slice(0, 10))
      } catch (error) {
        console.error("[v0] Error fetching activities:", error)
        setActivities(
          mockActivities.map((a) => ({
            id: a.id,
            type: a.type as any,
            title: a.description,
            description: a.amount ? `$${a.amount}` : a.rating ? `${a.rating} stars` : "",
            timestamp: a.date,
            status: a.status,
          })),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
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

  if (activities.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold px-1">Recent Activity</h3>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No activity yet. Start exploring restaurants!</p>
        </Card>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "bill":
        return Receipt
      case "coupon":
        return Ticket
      case "review":
        return Star
      default:
        return Receipt
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold px-1">Recent Activity</h3>
      <Card className="p-4">
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type)
            return (
              <div key={activity.id}>
                {index > 0 && <div className="border-t my-3" />}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      </div>
                      {activity.status && (
                        <Badge
                          variant={
                            activity.status === "approved" || activity.status === "active"
                              ? "default"
                              : activity.status === "redeemed"
                                ? "secondary"
                                : "outline"
                          }
                          className="shrink-0"
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
