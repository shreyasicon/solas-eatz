"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Loader2, CheckCircle2, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BillReviewProps {
  billId: string
}

export function BillReview({ billId }: BillReviewProps) {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bill, setBill] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  useEffect(() => {
    async function fetchBill() {
      if (!connected || !publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("bills")
          .select(
            `
            *,
            restaurants (id, name)
          `,
          )
          .eq("id", billId)
          .eq("customer_wallet", publicKey.toString())
          .single()

        if (error) {
          console.error("[v0] Error fetching bill:", error)
          return
        }

        setBill(data)
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBill()
  }, [billId, connected, publicKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey || !bill) return

    setSubmitting(true)

    try {
      const supabase = getSupabase()

      // Update bill with rating and review
      const { error: billError } = await supabase
        .from("bills")
        .update({
          rating,
          review_text: reviewText,
        })
        .eq("id", billId)

      if (billError) {
        console.error("[v0] Error updating bill:", billError)
        alert("Failed to submit review. Please try again.")
        return
      }

      // Insert review
      const { error: reviewError } = await supabase.from("reviews").insert({
        restaurant_id: bill.restaurants.id,
        customer_wallet: publicKey.toString(),
        bill_id: billId,
        rating,
        review_text: reviewText,
      })

      if (reviewError) {
        console.error("[v0] Error creating review:", reviewError)
      }

      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/bills")
      }, 2000)
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Bill not found.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Review Submitted!</h3>
              <p className="text-muted-foreground">Thank you for sharing your experience.</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Info */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">{bill.restaurants.name}</h2>
            <p className="text-sm text-muted-foreground">
              ${bill.amount.toFixed(2)} • {new Date(bill.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label>Rating *</Label>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        starValue <= (hoveredRating || rating) ? "text-accent fill-accent" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your experience at this restaurant..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={submitting || rating === 0} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
