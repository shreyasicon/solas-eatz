"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Receipt, Ticket, User, Rss, Gamepad2, Settings } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Map, label: "Discover" },
  { href: "/feed", icon: Rss, label: "Feed" },
  { href: "/earn", icon: Gamepad2, label: "Earn" },
  { href: "/bills", icon: Receipt, label: "Bills" },
  { href: "/coupons", icon: Ticket, label: "Coupons" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Navigation - Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground hover:scale-105"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Navigation - Side Bar */}
      <nav className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-40 bg-card/95 backdrop-blur-lg border-r border-border shadow-xl">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Solas Eatz
              </h2>
              <p className="text-xs text-muted-foreground">Restaurant Rewards</p>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
