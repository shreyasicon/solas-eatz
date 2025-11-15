"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockRestaurants } from "@/lib/mock-data"

export function OwnerSettings() {
  // Using Dublin Pizza as the owner's restaurant
  const restaurant = mockRestaurants[0]

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Restaurant Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant details and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your restaurant's basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input id="name" defaultValue={restaurant.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Description</Label>
            <Textarea id="bio" defaultValue={restaurant.bio} rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={restaurant.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@dublinpizza.ie" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue={restaurant.address} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set your restaurant's opening hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-24 font-medium">{day}</span>
              <Input type="time" defaultValue="11:00" className="flex-1" />
              <span className="text-muted-foreground">to</span>
              <Input type="time" defaultValue="22:00" className="flex-1" />
            </div>
          ))}
          <Button>Update Hours</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Settings</CardTitle>
          <CardDescription>Manage your Solana wallet for receiving payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input id="wallet" defaultValue={restaurant.owner_wallet} readOnly />
            <p className="text-xs text-muted-foreground">This is where you'll receive payments from coupon sales</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu & Photos</CardTitle>
          <CardDescription>Update your menu and restaurant photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="menu-url">Menu URL</Label>
            <Input id="menu-url" defaultValue={restaurant.menu_url} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Restaurant Photos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {restaurant.photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Button variant="outline">Upload New Photos</Button>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
