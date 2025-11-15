"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Star } from "lucide-react"
import { mockFeedPosts } from "@/lib/mock-data"

export function OwnerFeedMentions() {
  const [posts, setPosts] = useState(mockFeedPosts)

  // Filter posts that mention "Dublin Pizza" (the owner's restaurant)
  const mentions = posts.filter(
    (post) => post.restaurantName === "Dublin Pizza" || post.caption.toLowerCase().includes("dublin pizza"),
  )

  const handleReply = (postId: string) => {
    console.log("[v0] Reply to post:", postId)
    // In a real app, this would open a reply dialog
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Customer Mentions</h1>
        <p className="text-muted-foreground">See what customers are saying about your restaurant</p>
      </div>

      <div className="space-y-4">
        {mentions.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar || "/placeholder.svg"}
                  alt={post.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{post.userName}</h3>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
                {post.rating && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-sm">{post.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="font-medium text-primary mb-1">📍 {post.restaurantName}</p>
                <p className="text-foreground">{post.caption}</p>
              </div>
              <div className="flex items-center gap-6 pt-2 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className={`h-5 w-5 ${post.liked ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">{post.shares}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto bg-transparent"
                  onClick={() => handleReply(post.id)}
                >
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
