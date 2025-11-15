"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"

export function BillUpload() {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const [step, setStep] = useState<"upload" | "details" | "success">("upload")
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [restaurants, setRestaurants] = useState<any[]>([])

  const [formData, setFormData] = useState({
    restaurantId: "",
    amount: "",
    items: "",
    notes: "",
  })

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Fetch restaurants for the form
    const supabase = getSupabase()
    const { data } = await supabase.from("restaurants").select("id, name").order("name")
    setRestaurants(data || [])

    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()

      // In a real app, you would upload the image to storage and get a URL
      // For now, we'll use a placeholder
      const billImageUrl = imagePreview || ""

      // Calculate rewards (10 points per dollar)
      const amount = Number.parseFloat(formData.amount)
      const rewardsEarned = Math.floor(amount * 10)

      // Insert bill
      const { data, error } = await supabase
        .from("bills")
        .insert({
          customer_wallet: publicKey.toString(),
          restaurant_id: formData.restaurantId,
          amount: amount,
          bill_image_url: billImageUrl,
          ocr_data: {
            items: formData.items.split("\n").filter((item) => item.trim()),
            notes: formData.notes,
          },
          rewards_earned: rewardsEarned,
          status: "pending",
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error submitting bill:", error)
        alert("Failed to submit bill. Please try again.")
        return
      }

      setStep("success")

      // Reset after 2 seconds
      setTimeout(() => {
        setStep("upload")
        setImageFile(null)
        setImagePreview(null)
        setFormData({ restaurantId: "", amount: "", items: "", notes: "" })
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Please connect your wallet to upload bills.</p>
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
            <h3 className="text-xl font-semibold mb-2">Bill Submitted!</h3>
            <p className="text-muted-foreground">Your bill is being verified. You'll earn rewards once approved.</p>
          </div>
        </div>
      </Card>
    )
  }

  if (step === "details") {
    return (
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Bill preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Restaurant Selection */}
          <div className="space-y-2">
            <Label htmlFor="restaurant">Restaurant *</Label>
            <Select
              value={formData.restaurantId}
              onValueChange={(value) => setFormData({ ...formData, restaurantId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount (USD) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="25.50"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            {formData.amount && (
              <p className="text-xs text-muted-foreground">
                You'll earn {Math.floor(Number.parseFloat(formData.amount) * 10)} reward points
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <Label htmlFor="items">Items (one per line)</Label>
            <Textarea
              id="items"
              placeholder="Burger&#10;Fries&#10;Soda"
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              rows={4}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("upload")
                setImageFile(null)
                setImagePreview(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.restaurantId || !formData.amount} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Bill"
              )}
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Upload Your Bill</h3>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image of your receipt to earn rewards
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Camera Input */}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
            <Card className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Take Photo</span>
              </div>
            </Card>
          </label>

          {/* File Upload */}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <Card className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Upload File</span>
              </div>
            </Card>
          </label>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium">Tips for best results:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Ensure the bill is clearly visible and well-lit</li>
            <li>• Include the restaurant name and total amount</li>
            <li>• Make sure the image is not blurry</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
