import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet-button"
import { CouponRedemption } from "@/components/coupon-redemption"
import { Sparkles } from "lucide-react"

export default function CouponRedeemPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Redeem Coupon</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <CouponRedemption couponId={params.id} />

      <Navigation />
    </div>
  )
}
