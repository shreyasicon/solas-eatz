"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronLeft, Store, Calendar, Ticket, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

interface UserCoupon {
  id: string
  coupon_id: string
  nft_mint_address: string
  status: string
  created_at: string
  coupons: {
    type: string
    description: string
    price_usdc: number
    expiration_date: string
    restaurant_id: string
    restaurants: {
      name: string
      address: string
      phone: string
    }
  }
}

interface CouponRedemptionProps {
  couponId: string
}

export function CouponRedemption({ couponId }: CouponRedemptionProps) {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [coupon, setCoupon] = useState<UserCoupon | null>(null)

  useEffect(() => {
    async function fetchCoupon() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("user_coupons")
          .select(
            `
            *,
            coupons (
              *,
              restaurants (name, address, phone)
            )
          `,
          )
          .eq("id", couponId)
          .eq("user_wallet", publicKey.toString())
          .single()

        if (error) {
          console.error("[v0] Error fetching coupon:", error)
          return
        }

        setCoupon(data)
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupon()
  }, [couponId, connected, publicKey])

  if (!connected) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Card className="p-6">
          <p className="text-muted-foreground">Please connect your wallet to view this coupon.</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!coupon) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Card className="p-6">
          <p className="text-muted-foreground">Coupon not found.</p>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(coupon.coupons.expiration_date) < new Date()
  const isRedeemed = coupon.status === "redeemed"
  const isValid = !isExpired && !isRedeemed

  // Generate QR code data
  const qrData = JSON.stringify({
    couponId: coupon.id,
    userWallet: publicKey?.toString(),
    nftMint: coupon.nft_mint_address,
    restaurantId: coupon.coupons.restaurant_id,
    timestamp: Date.now(),
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <div className="space-y-4">
        {/* Coupon Details */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h2 className="text-xl font-bold">{coupon.coupons.type}</h2>
                <p className="text-muted-foreground">{coupon.coupons.restaurants.name}</p>
              </div>
              <Badge variant={isValid ? "default" : isRedeemed ? "secondary" : "destructive"}>
                {isRedeemed ? "Redeemed" : isExpired ? "Expired" : "Active"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{coupon.coupons.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{coupon.coupons.restaurants.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Expires {new Date(coupon.coupons.expiration_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Value: {coupon.coupons.price_usdc} USDC</span>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code */}
        {isValid ? (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Show this QR code at the restaurant</h3>
                <p className="text-sm text-muted-foreground">The staff will scan it to redeem your coupon</p>
              </div>

              <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                <QRCodeSVG value={qrData} size={240} level="H" includeMargin />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium">Instructions:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>1. Visit {coupon.coupons.restaurants.name}</li>
                  <li>2. Show this QR code to the staff</li>
                  <li>3. They will scan it to apply your discount</li>
                  <li>4. Enjoy your meal!</li>
                </ul>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">
                  {isRedeemed ? "Coupon Already Redeemed" : "Coupon Expired"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRedeemed
                    ? "This coupon has already been used and cannot be redeemed again."
                    : "This coupon has expired and is no longer valid."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Restaurant Contact */}
        <Card className="p-4 bg-muted/30">
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Need help?</p>
            <p className="text-sm text-muted-foreground">Call {coupon.coupons.restaurants.phone}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
