"use client"

import { Navigation } from "@/components/navigation"
import { FeedList } from "@/components/feed-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreatePostDialog } from "@/components/create-post-dialog"

export default function FeedPage() {
  const [showCreatePost, setShowCreatePost] = useState(false)

  return (
    <div className="min-h-screen pb-20 lg:pl-64">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Feed
          </h1>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FeedList />
      </main>

      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
      <Navigation />
    </div>
  )
}
