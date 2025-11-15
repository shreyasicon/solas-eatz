"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Loader2, CheckCircle2, XCircle, Camera } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"

export function QRScanner() {
  const { publicKey, connected } = useWallet()
  const [qrData, setQrData] = useState("")
  const [processing, setProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    couponDetails?: any
  } | null>(null)

  const handleScan = async () => {
    if (!qrData.trim()) {
      alert("Please enter QR code data")
      return
    }

    setProcessing(true)

    try {
      // Parse QR data
      const data = JSON.parse(qrData)
      const { couponId, userWallet, nftMint, restaurantId } = data

      const supabase = getSupabase()

      // Fetch coupon details
      const { data: couponData, error: fetchError } = await supabase
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
        .eq("id", couponId)
        .eq("user_wallet", userWallet)
        .single()

      if (fetchError || !couponData) {
        setResult({
          success: false,
          message: "Invalid coupon. Please check the QR code.",
        })
        setShowResult(true)
        return
      }

      // Validate coupon
      const isExpired = new Date(couponData.coupons.expiration_date) < new Date()
      const isRedeemed = couponData.status === "redeemed"

      if (isRedeemed) {
        setResult({
          success: false,
          message: "This coupon has already been redeemed.",
          couponDetails: couponData,
        })
        setShowResult(true)
        return
      }

      if (isExpired) {
        setResult({
          success: false,
          message: "This coupon has expired.",
          couponDetails: couponData,
        })
        setShowResult(true)
        return
      }

      // Redeem coupon
      const { error: updateError } = await supabase
        .from("user_coupons")
        .update({
          status: "redeemed",
          redeemed_at: new Date().toISOString(),
        })
        .eq("id", couponId)

      if (updateError) {
        console.error("[v0] Error redeeming coupon:", updateError)
        setResult({
          success: false,
          message: "Failed to redeem coupon. Please try again.",
        })
        setShowResult(true)
        return
      }

      setResult({
        success: true,
        message: "Coupon redeemed successfully!",
        couponDetails: couponData,
      })
      setShowResult(true)
      setQrData("")
    } catch (error) {
      console.error("[v0] Error:", error)
      setResult({
        success: false,
        message: "Invalid QR code format. Please try again.",
      })
      setShowResult(true)
    } finally {
      setProcessing(false)
    }
  }

  if (!connected) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Please connect your wallet to scan QR codes.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <div className="space-y-4">
        {/* Scanner Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Scan Customer QR Code</h2>
              <p className="text-sm text-muted-foreground">
                For restaurant staff: Scan customer coupons to redeem them
              </p>
            </div>

            {/* Manual Input (Camera scanning would require additional libraries) */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="qr-data">QR Code Data</Label>
                <Input
                  id="qr-data"
                  placeholder="Paste QR code data here..."
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  disabled={processing}
                />
                <p className="text-xs text-muted-foreground">
                  In a production app, this would use camera scanning. For now, paste the QR data manually.
                </p>
              </div>

              <Button onClick={handleScan} disabled={processing || !qrData.trim()} className="w-full">
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Verify & Redeem
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-muted/30">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">How to use:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1. Ask customer to show their coupon QR code</li>
              <li>2. Scan or paste the QR code data</li>
              <li>3. Verify the coupon details</li>
              <li>4. Apply the discount to their order</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{result?.success ? "Success" : "Error"}</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="text-center space-y-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  result?.success ? "bg-primary/10" : "bg-destructive/10"
                }`}
              >
                {result?.success ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
              </div>

              <div>
                <p className={`font-semibold ${result?.success ? "text-primary" : "text-destructive"}`}>
                  {result?.message}
                </p>
              </div>
            </div>

            {result?.couponDetails && (
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coupon:</span>
                    <span className="font-medium">{result.couponDetails.coupons.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Restaurant:</span>
                    <span className="font-medium">{result.couponDetails.coupons.restaurants.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium">{result.couponDetails.coupons.price_usdc} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={result.success ? "default" : "destructive"}>{result.couponDetails.status}</Badge>
                  </div>
                </div>
              </Card>
            )}

            <Button onClick={() => setShowResult(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
