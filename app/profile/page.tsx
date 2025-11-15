"use client"

import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet-button"
import { UserProfile } from "@/components/user-profile"
import { LoyaltyProgress } from "@/components/loyalty-progress"
import { UserStats } from "@/components/user-stats"
import { ActivityFeed } from "@/components/activity-feed"
import { Sparkles } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 bg-muted/30">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Profile</h1>
            </div>
            <WalletButton />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-6 lg:p-8 text-center">
            <p className="text-muted-foreground lg:text-lg">Please connect your wallet to view your profile.</p>
          </Card>
        </div>

        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 bg-muted/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-4 lg:space-y-6">
            <UserProfile />
            <LoyaltyProgress />
          </div>
          <div className="space-y-4 lg:space-y-6">
            <UserStats />
            <ActivityFeed />
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
