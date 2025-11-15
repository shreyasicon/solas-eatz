"use client"

import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet-button"
import { CouponMarketplace } from "@/components/coupon-marketplace"
import { MyCoupons } from "@/components/my-coupons"
import { Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CouponsPage() {
  return (
    <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 bg-muted/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Coupons</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="w-full grid grid-cols-2 max-w-md">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-coupons">My Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-4 lg:mt-6">
            <CouponMarketplace />
          </TabsContent>

          <TabsContent value="my-coupons" className="mt-4 lg:mt-6">
            <MyCoupons />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  )
}
