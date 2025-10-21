"use client"
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
  const getSigilCount = (name: string) => {
    return ZODIAC_SIGILS.find((s) => s.name === name)?.count || 0
  }

  const getSigilRarity = (name: string) => {
    return ZODIAC_SIGILS.find((s) => s.name === name)?.rarity || "Common"
  }

  const canBurn = (recipe: (typeof OCCULI_RECIPES)[0]) => {
    return recipe.required.every((req) => getSigilCount(req.name) >= req.count)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ShootingStarsAndStarsBackgroundDemo/>
      
      

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

        {/* Occuli Recipes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {OCCULI_RECIPES.map((recipe) => {
            const canBurnRecipe = canBurn(recipe)
            return (
              <div
                key={recipe.name}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm"
              >
                {/* Recipe Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{recipe.icon}</span>
                      <h3 className="text-2xl font-bold text-blue-200">{recipe.name} NFT</h3>
                    </div>
                    <p className="text-sm text-blue-300/70">{recipe.description}</p>
                  </div>
                </div>

                {/* Required Sigils */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-blue-300 uppercase">Required Sigils:</p>
                  {recipe.required.map((req) => {
                    const owned = getSigilCount(req.name)
                    const rarity = getSigilRarity(req.name)
                    const isSufficient = owned >= req.count
                    const rarityConfig = {
                      Common: "bg-purple-900/60 text-purple-200",
                      Rare: "bg-blue-900/60 text-blue-200",
                      Epic: "bg-pink-900/60 text-pink-200",
                      Legendary: "bg-cyan-900/60 text-cyan-200",
                    }

                    return (
                      <div
                        key={req.name}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isSufficient ? "bg-slate-700/30 border-green-500/30" : "bg-slate-700/20 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-2 py-1 rounded text-xs font-semibold ${rarityConfig[rarity as keyof typeof rarityConfig]}`}
                          >
                            {rarity}
                          </div>
                          <span className="text-blue-200">{req.name}</span>
                        </div>
                        <div className={`font-bold ${isSufficient ? "text-green-400" : "text-red-400"}`}>
                          {owned}/{req.count}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Burn Button */}
                <button
                  disabled={!canBurnRecipe}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    canBurnRecipe
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer"
                      : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {canBurnRecipe ? "Burn Sigils" : "Insufficient Sigils"}
                </button>
              </div>
            )
          })}
        </div>

        {/* Your Sigil Inventory Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
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
