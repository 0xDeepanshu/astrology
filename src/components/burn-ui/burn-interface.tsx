"use client"
import { useState, useEffect } from "react"
import { ShootingStarsAndStarsBackgroundDemo } from "../Shootingstarsbg"
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { ZODIACS } from "@/lib/zodiacs"
import { ASTROSIGILS_CONTRACT_ADDRESS } from "@/contracts"
import astrosigilsAbi from "@/abi/astrosigils.json"

interface SacrificeInterfaceProps {
  onNavigateToInventory?: () => void
}

export function SacrificeInterface({ onNavigateToInventory }: SacrificeInterfaceProps) {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [symbolBalances, setSymbolBalances] = useState<number[]>(Array(ZODIACS.length).fill(0))
  const [orbBalance, setOrbBalance] = useState(0)
  const [totalSymbols, setTotalSymbols] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Fetch all token balances when wallet is connected
  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setSymbolBalances(Array(ZODIACS.length).fill(0))
      setTotalSymbols(0)
      setOrbBalance(0)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Create array of promises to fetch all balances
    const balancePromises = ZODIACS.map(async (zodiac) => {
      try {
        const result = await publicClient.readContract({
          address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
          abi: astrosigilsAbi,
          functionName: "balanceOf",
          args: [address, BigInt(zodiac.index)],
        })
        return Number(result)
      } catch (err) {
        console.error(`Error fetching balance for ${zodiac.name}:`, err)
        return 0
      }
    })

    Promise.all(balancePromises)
      .then((balances) => {
        setSymbolBalances(balances)
        const total = balances.reduce((sum, balance) => sum + balance, 0)
        setTotalSymbols(total)
        setOrbBalance(0)
      })
      .catch((err) => {
        console.error("Error fetching balances:", err)
        const errorMessage = err instanceof Error ? err.message : "Error fetching balances"
        setError(errorMessage)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [address, isConnected, publicClient])

  const handleSacrifice = () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    if (totalSymbols < 12) {
      alert("You need at least 12 Symbols to perform a Sacrifice")
      return
    }

    // Prepare arrays of token IDs and amounts to sacrifice
    const tokenIdsToSacrifice: bigint[] = []
    const amountsToSacrifice: bigint[] = []
    let remaining = 12

    // Collect symbols from each zodiac until we have 12
    for (let index = 0; index < symbolBalances.length && remaining > 0; index++) {
      if (symbolBalances[index] > 0) {
        const amountToTake = Math.min(symbolBalances[index], remaining)
        tokenIdsToSacrifice.push(BigInt(index))
        amountsToSacrifice.push(BigInt(amountToTake))
        remaining -= amountToTake
      }
    }

    try {
      writeContract({
        address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
        abi: astrosigilsAbi,
        functionName: "burnBatch",
        args: [address, tokenIdsToSacrifice, amountsToSacrifice],
      })
    } catch (error) {
      console.error("Error sacrificing NFTs:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      alert(`Error sacrificing NFTs: ${errorMessage}`)
    }
  }

  // Reset state after successful sacrifice
  useEffect(() => {
    if (isConfirmed) {
      setTotalSymbols(Math.max(0, totalSymbols - 12))
      setOrbBalance(orbBalance + 1)
    }
  }, [isConfirmed])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ShootingStarsAndStarsBackgroundDemo />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-200 mb-2 drop-shadow-lg">Sacrifice Interface</h1>
          <p className="text-lg text-blue-300/70">Transform your Symbols into powerful Orbs</p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="text-center mb-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <p className="text-yellow-300">Connect your wallet to view your inventory</p>
          </div>
        )}

        {/* Loading State */}
        {loading && isConnected && (
          <div className="text-center mb-8">
            <p className="text-blue-300">Loading your collection...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300">Error loading inventory: {error}</p>
            <p className="text-red-400 text-sm mt-2">
              Please check if the contract address is correct and you're on the right network
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && isConnected && (
          <div className="space-y-8">
            {/* Inventory Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Symbols Card */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-blue-300/70 mb-2">Your Sets</p>
                  <p className="text-5xl font-bold text-blue-200 mb-2">{totalSymbols}</p>
                  <p className="text-xs text-blue-300/50">NFTs in your collection</p>
                </div>
              </div>

              {/* Orbs Card */}
              <div className="bg-gradient-to-br from-purple-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-purple-300/70 mb-2">Your Orbs</p>
                  <p className="text-5xl font-bold text-purple-200 mb-2">{orbBalance}</p>
                  <p className="text-xs text-purple-300/50">Minted from Sacrifices</p>
                </div>
              </div>
            </div>

            {/* Sacrifice Information */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-blue-200 mb-6">How Sacrifice Works</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-200 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-blue-200 font-semibold">Every Sacrifice consumes 12 Symbol NFTs</p>
                    <p className="text-blue-300/70 text-sm">in exchange for minting an Orb NFT</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-200 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-blue-200 font-semibold">The Leaderboard ranks users</p>
                    <p className="text-blue-300/70 text-sm">on the number of Orbs collected</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-200 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-blue-200 font-semibold">No limit to ownership</p>
                    <p className="text-blue-300/70 text-sm">There is no limit to the number of Symbols or Orbs you can mint/own.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-200 font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-blue-200 font-semibold">One at a time</p>
                    <p className="text-blue-300/70 text-sm">You can only mint one Orb at a time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacrifice Button */}
            <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold text-red-200 mb-2">Ready to Sacrifice?</h3>
                  <p className="text-red-300/80">
                    {totalSymbols >= 12
                      ? `You have enough Symbols to perform ${Math.floor(totalSymbols / 12)} Sacrifice${Math.floor(totalSymbols / 12) !== 1 ? "s" : ""}`
                      : `You need ${12 - totalSymbols} more Symbols to perform a Sacrifice`}
                  </p>
                </div>

                <button
                  onClick={handleSacrifice}
                  disabled={totalSymbols < 12 || isPending || isConfirming}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  {isPending || isConfirming ? "Sacrificing..." : "🔥 Sacrifice Now"}
                </button>
              </div>

              {writeError && <p className="text-red-500 text-sm mt-4">Error: {writeError.message}</p>}

              {isConfirming && <p className="text-yellow-400 text-sm mt-4 text-center">Waiting for confirmation...</p>}
              {isConfirmed && (
                <p className="text-green-500 text-sm mt-4 text-center">
                  Successfully sacrificed 12 Symbols for 1 Orb! 🎉
                </p>
              )}
            </div>
          </div>
        )}
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
