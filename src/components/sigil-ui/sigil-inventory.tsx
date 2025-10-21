"use client"
import { ShootingStarsAndStarsBackgroundDemo } from "../Shootingstarsbg"
import { SigilCard } from "./sigil-card"
import { StatsCard } from "./stats-card"
const ZODIAC_SIGILS = [
  { name: "Aries", count: 3, symbol: "♈" },
  { name: "Taurus",  count: 2, symbol: "♉" },
  { name: "Gemini",  count: 1, symbol: "♊" },
  { name: "Cancer",  count: 0, symbol: "♋" },
  { name: "Leo",  count: 5, symbol: "♌" },
  { name: "Virgo",  count: 1, symbol: "♍" },
  { name: "Libra",  count: 0, symbol: "♎" },
  { name: "Scorpio",  count: 2, symbol: "♏" },
  { name: "Sagittarius",  count: 1, symbol: "♐" },
  { name: "Capricorn",  count: 0, symbol: "♑" },
  { name: "Aquarius",  count: 4, symbol: "♒" },
  { name: "Pisces",  count: 2, symbol: "♓" },
]

export function SigilInventory() {
  const totalSigils = ZODIAC_SIGILS.reduce((sum, sigil) => sum + sigil.count, 0)
  const uniqueTypes = ZODIAC_SIGILS.filter((sigil) => sigil.count > 0).length
  const totalTypes = ZODIAC_SIGILS.length

  return (
    <div className="min-h-screen relative overflow-hidden">
     <ShootingStarsAndStarsBackgroundDemo/>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-200 mb-2 drop-shadow-lg">Sigil Inventory</h1>
          <p className="text-lg text-blue-300/70">Your collection of mystical zodiac sigils</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <StatsCard label="Total Sigils owner by user" value={totalSigils} />
          
          <StatsCard label="Total Types of NFT" value={totalTypes} />
        </div>

        {/* Sigil Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ZODIAC_SIGILS.map((sigil) => (
            <SigilCard key={sigil.name} sigil={sigil} />
          ))}
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
