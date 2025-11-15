"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { WalletButton } from "@/components/wallet-button"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, MapPin, Gift, TrendingUp, Rss, Gamepad2, Zap, Star, Store } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen pb-20 lg:pl-64">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Solas Eatz
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/owner/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/50">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Owner Portal</span>
              </Button>
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-8 lg:pb-12 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Eat. Earn. Explore.
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground text-pretty">
            Turn every meal into rewards. Upload bills, collect NFT coupons, and discover amazing restaurants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/discover">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Discover Restaurants
              </Button>
            </Link>
            <Link href="/earn">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto hover:bg-accent/50 hover:scale-105 transition-all duration-200 bg-transparent"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play & Earn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
          <Card className="p-6 space-y-3 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Discover</h3>
              <p className="text-sm text-muted-foreground">Find restaurants near you</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Upload bills for points</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">NFT Coupons</h3>
              <p className="text-sm text-muted-foreground">Buy & redeem deals</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Monitor your loyalty</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Rss className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Social Feed</h3>
              <p className="text-sm text-muted-foreground">Share your experiences</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Play Games</h3>
              <p className="text-sm text-muted-foreground">Earn while you wait</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Instant Rewards</h3>
              <p className="text-sm text-muted-foreground">Redeem with QR codes</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Loyalty Tiers</h3>
              <p className="text-sm text-muted-foreground">Unlock exclusive perks</p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 max-w-7xl mx-auto">
        <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary via-accent to-primary text-white max-w-4xl mx-auto shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="space-y-6 text-center">
            <h3 className="text-3xl lg:text-4xl font-bold">Ready to start earning?</h3>
            <p className="text-white/90 text-lg lg:text-xl">
              Connect your Solana wallet and discover restaurants in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/discover">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto hover:scale-105 transition-transform duration-200"
                >
                  Explore Restaurants
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 hover:scale-105 transition-transform duration-200"
                >
                  View Feed
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 max-w-7xl mx-auto">
        <Card className="p-8 lg:p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white max-w-4xl mx-auto border-slate-700 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">Are you a restaurant owner?</h3>
              <p className="text-white/80 text-base lg:text-lg">
                Manage your menu, track analytics, and engage with customers through our owner portal.
              </p>
            </div>
            <Link href="/owner/dashboard">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 hover:scale-105 transition-all duration-200 font-semibold"
              >
                Access Owner Portal
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <Navigation />
    </div>
  )
}
