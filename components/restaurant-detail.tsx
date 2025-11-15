"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, ExternalLink, Loader2, Star, Ticket, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { mockRestaurants, mockCoupons, mockReviews } from "@/lib/mock-data"

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  bio: string
  menu_url: string | null
  owner_wallet: string
  photos?: string[]
}

interface Coupon {
  id: string
  type: string
  description: string
  price_usdc: number
  expiration_date: string
  quantity_available: number
}

interface Review {
  id: string
  rating: number
  review_text: string
  created_at: string
}

interface RestaurantDetailProps {
  restaurantId: string
}

export function RestaurantDetail({ restaurantId }: RestaurantDetailProps) {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabase()

        // Fetch restaurant
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", restaurantId)
          .single()

        if (restaurantError) {
          console.log("[v0] Using mock data for restaurant")
          const mockRestaurant = mockRestaurants.find((r) => r.id === restaurantId)
          if (mockRestaurant) {
            setRestaurant(mockRestaurant as any)

            // Get mock coupons for this restaurant
            const restaurantCoupons = mockCoupons.filter((c) => c.restaurant_id === restaurantId)
            setCoupons(restaurantCoupons as any)

            // Get mock reviews for this restaurant
            const restaurantReviews = mockReviews.filter((r) => r.restaurant_id === restaurantId)
            setReviews(restaurantReviews as any)
          }
          setLoading(false)
          return
        }

        setRestaurant(restaurantData)

        // Fetch coupons
        const { data: couponsData } = await supabase
          .from("coupons")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .gt("quantity_available", 0)
          .order("created_at", { ascending: false })

        setCoupons(couponsData || [])

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false })
          .limit(10)

        setReviews(reviewsData || [])
      } catch (error) {
        console.log("[v0] Error, using mock data:", error)
        const mockRestaurant = mockRestaurants.find((r) => r.id === restaurantId)
        if (mockRestaurant) {
          setRestaurant(mockRestaurant as any)
          const restaurantCoupons = mockCoupons.filter((c) => c.restaurant_id === restaurantId)
          setCoupons(restaurantCoupons as any)
          const restaurantReviews = mockReviews.filter((r) => r.restaurant_id === restaurantId)
          setReviews(restaurantReviews as any)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Restaurant not found.</p>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "N/A"

  return (
    <div className="max-w-lg mx-auto">
      {/* Back Button */}
      <div className="px-4 py-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Photo Gallery Section */}
      {restaurant.photos && restaurant.photos.length > 0 && (
        <div className="px-4 pb-4">
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {restaurant.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative w-64 h-48 shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`${restaurant.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Header */}
      <div className="px-4 pb-4">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <Badge variant="secondary">Active</Badge>
            </div>

            {restaurant.bio && <p className="text-muted-foreground">{restaurant.bio}</p>}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-medium">{averageRating}</span>
              </div>
              <span className="text-muted-foreground">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{restaurant.phone}</span>
              </div>
            </div>

            {restaurant.menu_url && (
              <Link href={restaurant.menu_url} target="_blank">
                <Button variant="outline" className="w-full bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Menu
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <Tabs defaultValue="coupons" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="coupons" className="flex-1">
              Coupons ({coupons.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="space-y-3 mt-4">
            {coupons.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No coupons available at the moment.</p>
              </Card>
            ) : (
              coupons.map((coupon) => (
                <Card key={coupon.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{coupon.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{coupon.quantity_available} available</span>
                        <span>•</span>
                        <span>Expires {new Date(coupon.expiration_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{coupon.price_usdc} USDC</div>
                      <Button size="sm" className="mt-2">
                        Buy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-3 mt-4">
            {reviews.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-accent fill-accent" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.review_text && <p className="text-sm text-muted-foreground">{review.review_text}</p>}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
