"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Ticket, Calendar, Store, Loader2, CheckCircle2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getSupabase } from "@/lib/supabase"

interface Coupon {
  id: string
  restaurant_id: string
  type: string
  description: string
  price_usdc: number
  expiration_date: string
  quantity_available: number
  restaurants: {
    name: string
  }
}

interface CouponCardProps {
  coupon: Coupon
  onPurchaseComplete?: () => void
}

export function CouponCard({ coupon, onPurchaseComplete }: CouponCardProps) {
  const { publicKey, connected } = useWallet()
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    setPurchasing(true)

    try {
      const supabase = getSupabase()

      // Simulate USDC payment (in real app, this would be a Solana transaction)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate NFT metadata
      const nftMetadata = {
        name: `${coupon.type} - ${coupon.restaurants.name}`,
        description: coupon.description,
        image: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(coupon.type)}`,
        attributes: [
          { trait_type: "Restaurant", value: coupon.restaurants.name },
          { trait_type: "Type", value: coupon.type },
          { trait_type: "Value", value: `${coupon.price_usdc} USDC` },
        ],
      }

      // Create user coupon
      const { error: userCouponError } = await supabase.from("user_coupons").insert({
        user_wallet: publicKey.toString(),
        coupon_id: coupon.id,
        nft_mint_address: `NFT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Simulated NFT address
        nft_metadata: nftMetadata,
        status: "active",
      })

      if (userCouponError) {
        console.error("[v0] Error creating user coupon:", userCouponError)
        alert("Failed to purchase coupon. Please try again.")
        return
      }

      // Decrease quantity
      const { error: updateError } = await supabase
        .from("coupons")
        .update({ quantity_available: coupon.quantity_available - 1 })
        .eq("id", coupon.id)

      if (updateError) {
        console.error("[v0] Error updating quantity:", updateError)
      }

      setPurchaseSuccess(true)

      // Close dialog and refresh after 2 seconds
      setTimeout(() => {
        setShowPurchaseDialog(false)
        setPurchaseSuccess(false)
        onPurchaseComplete?.()
      }, 2000)
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex gap-4">
          {/* Coupon Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shrink-0">
            <Ticket className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-tight">{coupon.type}</h3>
                <p className="text-sm text-muted-foreground">{coupon.restaurants.name}</p>
              </div>
              <Badge variant="secondary">{coupon.quantity_available} left</Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{coupon.description}</p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Expires {new Date(coupon.expiration_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xl font-bold text-primary">{coupon.price_usdc} USDC</div>
              <Button size="sm" onClick={() => setShowPurchaseDialog(true)}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          {purchaseSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Purchase Successful!</h3>
                <p className="text-muted-foreground">Your NFT coupon has been minted to your wallet.</p>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Purchase Coupon</DialogTitle>
                <DialogDescription>Confirm your purchase to mint this NFT coupon to your wallet.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Coupon Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Ticket className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{coupon.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Store className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{coupon.restaurants.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Valid until {new Date(coupon.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{coupon.price_usdc} USDC</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPurchaseDialog(false)}
                    className="flex-1"
                    disabled={purchasing}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handlePurchase} className="flex-1" disabled={purchasing}>
                    {purchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Purchase"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
