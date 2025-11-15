"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { CouponCard } from "@/components/coupon-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Loader2, Search, Ticket } from "lucide-react"
import { mockCoupons } from "@/lib/mock-data"

interface Coupon {
  id: string
  restaurant_id: string
  type: string
  description: string
  price_usdc: number
  expiration_date: string
  quantity_available: number
  restaurants: {
    name: string
  }
}

function fetchCoupons() {
  // Function implementation here
}

export function CouponMarketplace() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const supabase = getSupabase()
        let query = supabase
          .from("coupons")
          .select(
            `
            *,
            restaurants (name)
          `,
          )
          .gt("quantity_available", 0)
          .gte("expiration_date", new Date().toISOString())

        if (sortBy === "newest") {
          query = query.order("created_at", { ascending: false })
        } else if (sortBy === "price-low") {
          query = query.order("price_usdc", { ascending: true })
        } else if (sortBy === "price-high") {
          query = query.order("price_usdc", { ascending: false })
        }

        const { data, error } = await query

        if (error) {
          console.error("[v0] Error fetching coupons:", error)
          let filteredData = mockCoupons.map((c) => ({
            ...c,
            restaurants: { name: c.restaurant_name },
          })) as any

          if (searchQuery) {
            filteredData = filteredData.filter(
              (coupon: any) =>
                coupon.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coupon.restaurants.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          }

          if (sortBy === "price-low") {
            filteredData.sort((a: any, b: any) => a.price_usdc - b.price_usdc)
          } else if (sortBy === "price-high") {
            filteredData.sort((a: any, b: any) => b.price_usdc - a.price_usdc)
          }

          setCoupons(filteredData)
          setLoading(false)
          return
        }

        let filteredData = data || []
        if (searchQuery) {
          filteredData = filteredData.filter(
            (coupon) =>
              coupon.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coupon.restaurants.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        setCoupons(filteredData)
      } catch (error) {
        console.error("[v0] Error:", error)
        setCoupons(
          mockCoupons.map((c) => ({
            ...c,
            restaurants: { name: c.restaurant_name },
          })) as any,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [searchQuery, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Coupons Available</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search." : "Check back later for new deals!"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onPurchaseComplete={() => fetchCoupons()} />
          ))}
        </div>
      )}
    </div>
  )
}
