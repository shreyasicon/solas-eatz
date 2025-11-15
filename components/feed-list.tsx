"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { mockFeedPosts } from "@/lib/mock-data"

export function FeedList() {
  const [posts, setPosts] = useState(mockFeedPosts)

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Post Header */}
          <div className="p-4 flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                {post.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{post.userName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{post.restaurantName}</span>
                <span>•</span>
                <span>{post.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="relative w-full h-80 bg-muted">
              <Image src={post.image || "/placeholder.svg"} alt={post.restaurantName} fill className="object-cover" />
            </div>
          )}

          {/* Post Content */}
          <div className="p-4 space-y-3">
            <p className="text-sm">{post.content}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`gap-2 hover:scale-110 transition-transform duration-200 ${
                  post.isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                <span className="font-semibold">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 hover:scale-110 transition-transform duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 hover:scale-110 transition-transform duration-200">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
