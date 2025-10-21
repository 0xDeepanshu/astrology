"use client"
import { useState } from "react"
import { ShootingStarsAndStarsBackgroundDemo } from "../Shootingstarsbg"


const ZODIAC_SIGILS = [
  { name: "Aries", rarity: "Common", count: 3, symbol: "♈" },
  { name: "Taurus", rarity: "Common", count: 2, symbol: "♉" },
  { name: "Gemini", rarity: "Rare", count: 1, symbol: "♊" },
  { name: "Cancer", rarity: "Common", count: 0, symbol: "♋" },
  { name: "Leo", rarity: "Epic", count: 5, symbol: "♌" },
  { name: "Virgo", rarity: "Common", count: 1, symbol: "♍" },
  { name: "Libra", rarity: "Rare", count: 0, symbol: "♎" },
  { name: "Scorpio", rarity: "Legendary", count: 2, symbol: "♏" },
  { name: "Sagittarius", rarity: "Common", count: 1, symbol: "♐" },
  { name: "Capricorn", rarity: "Common", count: 0, symbol: "♑" },
  { name: "Aquarius", rarity: "Rare", count: 4, symbol: "♒" },
  { name: "Pisces", rarity: "Epic", count: 2, symbol: "♓" },
]

const OCCULI_RECIPES = [
  {
    name: "Solar Occuli",
    description: "Harness the power of fire sigils",
    icon: "☀️",
    required: [
      { name: "Aries", count: 3 },
      { name: "Leo", count: 5 },
      { name: "Sagittarius", count: 1 },
    ],
  },
  {
    name: "Lunar Occuli",
    description: "Channel the power of water sigils",
    icon: "🌙",
    required: [
      { name: "Cancer", count: 0 },
      { name: "Scorpio", count: 2 },
      { name: "Pisces", count: 2 },
    ],
  },
  {
    name: "Stellar Occuli",
    description: "Command the winds of air sigils",
    icon: "⭐",
    required: [
      { name: "Gemini", count: 1 },
      { name: "Libra", count: 0 },
      { name: "Aquarius", count: 4 },
    ],
  },
  {
    name: "Cosmic Occuli",
    description: "Ground yourself with earth sigils",
    icon: "🌍",
    required: [
      { name: "Taurus", count: 2 },
      { name: "Virgo", count: 1 },
      { name: "Capricorn", count: 0 },
    ],
  },
]

interface BurnInterfaceProps {
  onNavigateToInventory?: () => void
}

export function BurnInterface({ onNavigateToInventory }: BurnInterfaceProps) {
  const [burnCount, setBurnCount] = useState(0)
  const totalNFTs = ZODIAC_SIGILS.reduce((sum, sigil) => sum + sigil.count, 0)

  const getSigilCount = (name: string) => {
    return ZODIAC_SIGILS.find((s) => s.name === name)?.count || 0
  }

  const getSigilRarity = (name: string) => {
    return ZODIAC_SIGILS.find((s) => s.name === name)?.rarity || "Common"
  }

  const canBurn = (recipe: (typeof OCCULI_RECIPES)[0]) => {
    return recipe.required.every((req) => getSigilCount(req.name) >= req.count)
  }

  const handleIncrement = () => {
    if (burnCount < totalNFTs) {
      setBurnCount(burnCount + 1)
    }
  }

  const handleDecrement = () => {
    if (burnCount > 0) {
      setBurnCount(burnCount - 1)
    }
  }

  const handleBurn = () => {
    if (burnCount > 0) {
      console.log(`Burning ${burnCount} NFTs...`)
      // Add your burn logic here
      setBurnCount(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ShootingStarsAndStarsBackgroundDemo />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-200 mb-2 drop-shadow-lg">Burn Interface</h1>
          <p className="text-lg text-blue-300/70 mb-4">Sacrifice zodiac sigils to forge powerful Occuli NFTs</p>
          <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-6">
            <span>⚠️</span>
            <span>Burning sigils is permanent and irreversible</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-red-200 mb-6 text-center">Burn Counter</h2>
          <div className="flex flex-col items-center gap-6">
            {/* Counter Display */}
            <div className="flex items-center gap-8">
              <button
                onClick={handleDecrement}
                disabled={burnCount === 0}
                className="w-12 h-12 rounded-full  hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl"
              >
                −
              </button>

              <div className="text-center">
                <div className="text-6xl font-bold text-red-300 drop-shadow-lg">{burnCount}</div>
                <p className="text-sm text-red-300/70 mt-2">of {totalNFTs} NFTs selected</p>
              </div>

              <button
                onClick={handleIncrement}
                disabled={burnCount === totalNFTs}
                className="w-12 h-12 rounded-full  hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl"
              >
                +
              </button>
            </div>

            {/* Burn Button */}
            <button
              onClick={handleBurn}
              disabled={burnCount === 0}
              className="w-full max-w-xs bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-lg transition-all duration-200"
            >
              🔥 Burn {burnCount} NFT{burnCount !== 1 ? "s" : ""}
            </button>
          </div>
        </div>

        {/* Your Sigil Inventory Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm mt-8">
          <h2 className="text-2xl font-bold text-blue-200 mb-6 text-center">Your Sigil Inventory</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ZODIAC_SIGILS.map((sigil) => (
              <div key={sigil.name} className="flex flex-col items-center">
                <div className="w-full mb-2">
                  <div className="text-3xl text-purple-300 drop-shadow-lg filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] text-center mb-2">
                    {sigil.symbol}
                  </div>
                </div>
                <p className="text-xs text-blue-200 text-center font-semibold">{sigil.name}</p>
                <p className="text-lg font-bold text-blue-300">{sigil.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
