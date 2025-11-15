"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Loader2, CheckCircle2, Wallet, ArrowRight } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { mockRestaurants } from "@/lib/mock-data"

export function ScanAndPay() {
  const { publicKey, connected } = useWallet()
  const [step, setStep] = useState<"scan" | "confirm" | "success">("scan")
  const [loading, setLoading] = useState(false)
  const [scannedData, setScannedData] = useState<{
    restaurantId: string
    restaurantName: string
    amount: number
    tableNumber: string
  } | null>(null)

  // Simulate QR code scanning
  const handleScanQR = () => {
    setLoading(true)
    // Simulate scanning delay
    setTimeout(() => {
      // Mock scanned data from a restaurant
      const restaurant = mockRestaurants[0]
      setScannedData({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        amount: 45.5,
        tableNumber: "12",
      })
      setStep("confirm")
      setLoading(false)
    }, 1500)
  }

  // Simulate manual QR code entry
  const handleManualEntry = () => {
    const restaurant = mockRestaurants[1]
    setScannedData({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      amount: 32.0,
      tableNumber: "8",
    })
    setStep("confirm")
  }

  const handlePayment = async () => {
    if (!connected || !publicKey || !scannedData) {
      alert("Please connect your wallet first")
      return
    }

    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setStep("success")
      setLoading(false)

      // Reset after 3 seconds
      setTimeout(() => {
        setStep("scan")
        setScannedData(null)
      }, 3000)
    }, 2000)
  }

  if (!connected) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-sm">Please connect your wallet to scan and pay at restaurants.</p>
          </div>
        </div>
      </Card>
    )
  }

  if (step === "success") {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment of ${scannedData?.amount.toFixed(2)} has been processed.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You earned {Math.floor((scannedData?.amount || 0) * 10)} reward points!
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (step === "confirm" && scannedData) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Confirm Payment</h3>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Restaurant</span>
                  <span className="font-semibold">{scannedData.restaurantName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Table Number</span>
                  <span className="font-semibold">#{scannedData.tableNumber}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">${scannedData.amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Rewards Earned</span>
                  <span className="font-semibold text-accent">+{Math.floor(scannedData.amount * 10)} points</span>
                </div>
              </div>
            </Card>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium">Payment Method</h4>
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">USDC Payment via Solana</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStep("scan")
                setScannedData(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ${scannedData.amount.toFixed(2)}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Scan & Pay</h3>
          <p className="text-sm text-muted-foreground">Scan the QR code at your table to pay your bill instantly</p>
        </div>

        <div className="space-y-4">
          {/* Scan QR Button */}
          <Button
            onClick={handleScanQR}
            disabled={loading}
            className="w-full h-auto py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Scanning...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Scan className="w-8 h-8" />
                <span className="text-lg font-semibold">Scan QR Code</span>
              </div>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Manual Entry */}
          <Button variant="outline" onClick={handleManualEntry} className="w-full bg-transparent">
            <QrCode className="w-4 h-4 mr-2" />
            Enter Code Manually
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Scan the QR code displayed at your restaurant table</li>
            <li>• Review your bill details and total amount</li>
            <li>• Confirm payment with your connected wallet</li>
            <li>• Earn reward points automatically</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
