"use client"

interface SigilCardProps {
  sigil: {
    name: string
    rarity: string
    count: number
    symbol: string
  }
}

const rarityConfig = {
  Common: {
    bg: "from-purple-900/40 to-purple-800/20",
    border: "border-purple-500/30",
    badge: "bg-purple-900/60 text-purple-200",
    glow: "shadow-lg shadow-purple-500/20",
  },
  Rare: {
    bg: "from-blue-900/40 to-blue-800/20",
    border: "border-blue-500/30",
    badge: "bg-blue-900/60 text-blue-200",
    glow: "shadow-lg shadow-blue-500/20",
  },
  Epic: {
    bg: "from-pink-900/40 to-pink-800/20",
    border: "border-pink-500/30",
    badge: "bg-pink-900/60 text-pink-200",
    glow: "shadow-lg shadow-pink-500/20",
  },
  Legendary: {
    bg: "from-cyan-900/40 to-cyan-800/20",
    border: "border-cyan-500/30",
    badge: "bg-cyan-900/60 text-cyan-200",
    glow: "shadow-lg shadow-cyan-500/20",
  },
}

export function SigilCard({ sigil }: SigilCardProps) {
  const config = rarityConfig[sigil.rarity as keyof typeof rarityConfig]
  const isOwned = sigil.count > 0

  return (
    <div
      className={`
        relative rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105
        ${config.bg} ${config.border} ${config.glow}
        ${isOwned ? "opacity-100" : "opacity-60"}
      `}
    >
      <div className="p-6 flex flex-col items-center text-center">
        {/* Zodiac Symbol */}
        <div className="mb-4 relative">
          <div className="text-6xl text-purple-300 drop-shadow-lg filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            {sigil.symbol}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white mb-2">{sigil.name}</h3>

        {/* Rarity Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 ${config.badge}`}>{sigil.rarity}</div>

        {/* Count */}
        <div className="text-3xl font-bold text-blue-200 mb-1">{sigil.count}</div>
        <p className="text-sm text-blue-300/60">
          {sigil.count === 0 ? "Not owned" : `${sigil.count} sigil${sigil.count !== 1 ? "s" : ""} owned`}
        </p>
      </div>
    </div>
  )
}
