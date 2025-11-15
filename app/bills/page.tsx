"use client"

import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet-button"
import { BillUpload } from "@/components/bill-upload"
import { BillHistory } from "@/components/bill-history"
import { ScanAndPay } from "@/components/scan-and-pay"
import { Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BillsPage() {
  return (
    <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 bg-muted/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Bills</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="w-full grid grid-cols-3 max-w-2xl">
            <TabsTrigger value="scan">Scan & Pay</TabsTrigger>
            <TabsTrigger value="upload">Upload Bill</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-4 lg:mt-6">
            <ScanAndPay />
          </TabsContent>

          <TabsContent value="upload" className="mt-4 lg:mt-6">
            <BillUpload />
          </TabsContent>

          <TabsContent value="history" className="mt-4 lg:mt-6">
            <BillHistory />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  )
}
