"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function WalletButton() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton className="!bg-primary !text-primary-foreground !rounded-xl !h-10 !px-4 !text-sm !font-medium hover:!bg-primary/90 transition-colors" />
    </div>
  )
}
