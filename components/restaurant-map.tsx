"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { mockRestaurants, DUBLIN_CENTER } from "@/lib/mock-data"

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  bio: string
}

interface RestaurantMapProps {
  searchQuery: string
}

export function RestaurantMap({ searchQuery }: RestaurantMapProps) {
  const [restaurants] = useState(mockRestaurants)
  const [loading] = useState(false)

  const filteredRestaurants = searchQuery
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : restaurants

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <Card className="p-6 bg-muted/50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Dublin Restaurant Map</h3>
            <p className="text-sm text-muted-foreground">
              Discover {filteredRestaurants.length} amazing restaurants across Dublin
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Centered at {DUBLIN_CENTER.lat.toFixed(4)}, {DUBLIN_CENTER.lng.toFixed(4)}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-left">
            {filteredRestaurants.slice(0, 5).map((restaurant) => (
              <div key={restaurant.id} className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground">{restaurant.address}</p>
                </div>
              </div>
            ))}
            {filteredRestaurants.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{filteredRestaurants.length - 5} more restaurants
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
