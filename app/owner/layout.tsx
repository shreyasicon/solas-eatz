import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { OwnerNavigation } from "@/components/owner-navigation"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${geistSans.className} min-h-screen bg-background`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        <OwnerNavigation />
        <main className="flex-1 pb-20 md:pb-0 md:ml-64">{children}</main>
      </div>
    </div>
  )
}
