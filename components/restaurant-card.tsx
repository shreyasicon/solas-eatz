"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Phone, ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  bio: string
  menu_url: string | null
  rating?: number
  review_count?: number
  cuisine?: string
  price_range?: string
  image?: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {restaurant.image && (
          <div className="relative h-40 w-full bg-muted">
            <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Restaurant Name & Cuisine */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">{restaurant.name}</h3>
              {restaurant.cuisine && (
                <p className="text-sm text-muted-foreground">
                  {restaurant.cuisine} {restaurant.price_range && `• ${restaurant.price_range}`}
                </p>
              )}
            </div>
            {restaurant.rating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold text-sm">{restaurant.rating}</span>
                {restaurant.review_count && (
                  <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Bio */}
          {restaurant.bio && <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.bio}</p>}

          {/* Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{restaurant.address}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{restaurant.phone}</span>
          </div>

          {/* Menu Link */}
          {restaurant.menu_url && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">View Menu</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
