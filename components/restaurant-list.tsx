"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { RestaurantCard } from "@/components/restaurant-card"
import { Loader2 } from "lucide-react"
import { mockRestaurants } from "@/lib/mock-data"

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  bio: string
  menu_url: string | null
  owner_wallet: string
  created_at: string
}

interface RestaurantListProps {
  searchQuery: string
}

export function RestaurantList({ searchQuery }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const supabase = getSupabase()
        let query = supabase.from("restaurants").select("*").order("created_at", { ascending: false })

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`)
        }

        const { data, error } = await query

        if (error) {
          console.error("[v0] Error fetching restaurants:", error)
          const filtered = searchQuery
            ? mockRestaurants.filter(
                (r) =>
                  r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.address.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : mockRestaurants
          setRestaurants(filtered as any)
          setLoading(false)
          return
        }

        setRestaurants(data || [])
      } catch (error) {
        console.error("[v0] Error:", error)
        setRestaurants(mockRestaurants as any)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">
          {searchQuery ? "No restaurants found matching your search." : "No restaurants available yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
