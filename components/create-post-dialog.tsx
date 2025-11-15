"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Camera } from "lucide-react"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Restaurant</Label>
            <Input placeholder="Which restaurant did you visit?" />
          </div>
          <div className="space-y-2">
            <Label>Your Experience</Label>
            <Textarea placeholder="Tell us about your meal..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Photo</Label>
            <Button variant="outline" className="w-full bg-transparent">
              <Camera className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>
          </div>
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg">Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
