"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Wheel", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Burn", href: "/burn" },
  ]

  return (
    <header className=" bg-gradient-to-r from-purple-600 to-blue-600  border-slate-800 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
           <Image
           src='/images/logo/logo.png'
           alt=""
           height={100}
           width={200}
           />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive ? "bg-orange-300 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Connect Wallet Button */}
            <button className="flex-shrink-0">
              <appkit-button />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2 border-t border-slate-800 pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors block ${
                    isActive ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}