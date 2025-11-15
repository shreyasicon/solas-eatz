"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@solana/wallet-adapter-react"
import { Wallet, Copy, Check } from "lucide-react"
import { useState } from "react"

export function UserProfile() {
  const { publicKey } = useWallet()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortAddress = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : ""

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
          <Wallet className="w-8 h-8 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Solas Eatz Member</h2>
            <Badge variant="secondary">Active</Badge>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono">{shortAddress}</span>
            {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          </button>

          <p className="text-xs text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  )
}
