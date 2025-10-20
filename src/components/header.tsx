"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { label: "Wheel", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Burn", href: "/burn" },
  ]

  return (
    <header className="bg-slate-900 border-b border-slate-800 ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">☀️</span>
          <span className="text-white font-semibold text-lg">AstroLOGy</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Connect Wallet Button */}
        <button className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors">
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
