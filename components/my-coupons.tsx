"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Ticket, QrCode } from "lucide-react"
import Link from "next/link"
import { mockUserCoupons } from "@/lib/mock-data"

interface UserCoupon {
  id: string
  coupon_id: string
  nft_mint_address: string
  status: string
  redeemed_at: string | null
  created_at: string
  coupons: {
    type: string
    description: string
    price_usdc: number
    expiration_date: string
    restaurant_id: string
    restaurants: {
      name: string
    }
  }
}

export function MyCoupons() {
  const { publicKey, connected } = useWallet()
  const [coupons, setCoupons] = useState<UserCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "redeemed">("active")

  useEffect(() => {
    async function fetchCoupons() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        let query = supabase
          .from("user_coupons")
          .select(
            `
            *,
            coupons (
              *,
              restaurants (name)
            )
          `,
          )
          .eq("user_wallet", publicKey.toString())
          .order("created_at", { ascending: false })

        if (filter === "active") {
          query = query.eq("status", "active")
        } else if (filter === "redeemed") {
          query = query.eq("status", "redeemed")
        }

        const { data, error } = await query

        if (error) {
          console.error("[v0] Error fetching user coupons:", error)
          const filteredMock = mockUserCoupons
            .filter((c) => filter === "all" || c.status === filter)
            .map((c) => ({
              ...c,
              coupons: {
                type: c.type,
                description: c.description,
                price_usdc: 0,
                expiration_date: c.expiration_date,
                restaurant_id: "1",
                restaurants: { name: c.restaurant_name },
              },
            })) as any
          setCoupons(filteredMock)
          setLoading(false)
          return
        }

        setCoupons(data || [])
      } catch (error) {
        console.error("[v0] Error:", error)
        setCoupons(
          mockUserCoupons.map((c) => ({
            ...c,
            coupons: {
              type: c.type,
              description: c.description,
              price_usdc: 0,
              expiration_date: c.expiration_date,
              restaurant_id: "1",
              restaurants: { name: c.restaurant_name },
            },
          })) as any,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [connected, publicKey, filter])

  if (!connected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Please connect your wallet to view your coupons.</p>
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

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className="flex-1"
        >
          Active
        </Button>
        <Button
          variant={filter === "redeemed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("redeemed")}
          className="flex-1"
        >
          Redeemed
        </Button>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Coupons Yet</h3>
              <p className="text-sm text-muted-foreground">
                {filter === "active"
                  ? "Purchase coupons from the marketplace to get started!"
                  : "No coupons in this category."}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {coupons.map((userCoupon) => {
            const isExpired = new Date(userCoupon.coupons.expiration_date) < new Date()
            const isActive = userCoupon.status === "active" && !isExpired

            return (
              <Card key={userCoupon.id} className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{userCoupon.coupons.type}</h3>
                      <p className="text-sm text-muted-foreground">{userCoupon.coupons.restaurants.name}</p>
                    </div>
                    <Badge
                      variant={userCoupon.status === "redeemed" ? "secondary" : isExpired ? "destructive" : "default"}
                    >
                      {userCoupon.status === "redeemed" ? "Redeemed" : isExpired ? "Expired" : "Active"}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{userCoupon.coupons.description}</p>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Value: {userCoupon.coupons.price_usdc} USDC</span>
                    <span>
                      {isExpired
                        ? "Expired"
                        : `Expires ${new Date(userCoupon.coupons.expiration_date).toLocaleDateString()}`}
                    </span>
                  </div>

                  {/* Action */}
                  {isActive && (
                    <Link href={`/coupons/${userCoupon.id}/redeem`}>
                      <Button size="sm" className="w-full">
                        <QrCode className="w-4 h-4 mr-2" />
                        Redeem Coupon
                      </Button>
                    </Link>
                  )}

                  {userCoupon.status === "redeemed" && userCoupon.redeemed_at && (
                    <p className="text-xs text-muted-foreground text-center">
                      Redeemed on {new Date(userCoupon.redeemed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
