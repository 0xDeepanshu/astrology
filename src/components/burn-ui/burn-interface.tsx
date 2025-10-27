"use client"
import { useState, useEffect } from "react"
import { ShootingStarsAndStarsBackgroundDemo } from "../Shootingstarsbg"
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ZODIACS } from '@/lib/zodiacs'
import { ASTROSIGILS_CONTRACT_ADDRESS } from '@/contracts'
import astrosigilsAbi from '@/abi/astrosigils.json'

interface BurnInterfaceProps {
  onNavigateToInventory?: () => void
}

export function BurnInterface({ onNavigateToInventory }: BurnInterfaceProps) {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [sigilBalances, setSigilBalances] = useState<number[]>(Array(ZODIACS.length).fill(0))
  const [burnCounters, setBurnCounters] = useState<number[]>(Array(ZODIACS.length).fill(0))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Fetch all token balances when wallet is connected
  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setSigilBalances(Array(ZODIACS.length).fill(0))
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
          functionName: 'balanceOf',
          args: [address, BigInt(zodiac.index)],
        })
        return Number(result)
      } catch (err) {
        console.error(`Error fetching balance for ${zodiac.name}:`, err)
        return 0
      }
    })

    Promise.all(balancePromises)
      .then(balances => {
        setSigilBalances(balances)
        // Initialize burn counters to 0
        setBurnCounters(Array(balances.length).fill(0))
      })
      .catch(err => {
        console.error('Error fetching balances:', err)
        const errorMessage = err instanceof Error ? err.message : 'Error fetching balances';
        setError(errorMessage)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [address, isConnected, publicClient])

  // Handle burn counter increment
  const incrementBurnCount = (index: number) => {
    setBurnCounters(prev => {
      const newCounters = [...prev]
      // Prevent going beyond the available balance
      if (newCounters[index] < sigilBalances[index]) {
        newCounters[index] += 1
      }
      return newCounters
    })
  }

  // Handle burn counter decrement
  const decrementBurnCount = (index: number) => {
    setBurnCounters(prev => {
      const newCounters = [...prev]
      if (newCounters[index] > 0) {
        newCounters[index] -= 1
      }
      return newCounters
    })
  }

  // Handle burning the selected NFTs
  const handleBurn = () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    // Prepare arrays of token IDs and amounts to burn
    const tokenIdsToBurn: bigint[] = []
    const amountsToBurn: bigint[] = []

    burnCounters.forEach((count, index) => {
      if (count > 0) {
        tokenIdsToBurn.push(BigInt(index))
        amountsToBurn.push(BigInt(count))
      }
    })

    if (tokenIdsToBurn.length === 0) {
      alert('Please select at least one NFT to burn')
      return
    }

    try {
      writeContract({
        address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
        abi: astrosigilsAbi,
        functionName: 'burnBatch',
        args: [address, tokenIdsToBurn, amountsToBurn],
      })
    } catch (error) {
      console.error('Error burning NFTs:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error burning NFTs: ${errorMessage}`)
    }
  }

  // Reset burn counters after successful burn
  useEffect(() => {
    if (isConfirmed) {
      setBurnCounters(Array(ZODIACS.length).fill(0))
    }
  }, [isConfirmed])

  // Calculate total NFTs to burn
  const totalToBurn = burnCounters.reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ShootingStarsAndStarsBackgroundDemo />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-200 mb-2 drop-shadow-lg">Burn Interface</h1>
          <p className="text-lg text-blue-300/70 mb-4">Sacrifice zodiac symbols to forge powerful orbs NFTs</p>
          <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-6">
            <span>⚠️</span>
            <span>Burning symbols is permanent and irreversible</span>
          </div>
        </div>

        {/* Your symbol Inventory Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm mt-8">
          <h2 className="text-2xl font-bold text-blue-200 mb-6 text-center">Your symbol Inventory</h2>
          
          {/* Connection Status */}
          {!isConnected && (
            <div className="text-center mb-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-yellow-300">Connect your wallet to view your symbol inventory</p>
            </div>
          )}

          {/* Loading State */}
          {loading && isConnected && (
            <div className="text-center mb-8">
              <p className="text-blue-300">Loading your symbol collection...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300">Error loading symbol inventory: {error}</p>
              <p className="text-red-400 text-sm mt-2">Please check if the contract address is correct and you're on the right network</p>
            </div>
          )}

          {/* Burn Controls */}
          {!loading && isConnected && (
            <div className="mb-8 p-6 bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-red-200">Selected for Burn</h3>
                  <p className="text-red-300/80">{totalToBurn} NFT{totalToBurn !== 1 ? "s" : ""} selected</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleBurn}
                    disabled={totalToBurn === 0 || isPending || isConfirming}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200"
                  >
                    {isPending || isConfirming ? 'Burning...' : '🔥 Burn NFTs'}
                  </button>
                  
                  {writeError && (
                    <p className="text-red-500 text-sm mt-2">
                      {writeError.message}
                    </p>
                  )}
                </div>
              </div>
              
              {isConfirming && (
                <p className="text-yellow-400 text-sm mt-2 text-center">
                  Waiting for confirmation...
                </p>
              )}
              {isConfirmed && (
                <p className="text-green-500 text-sm mt-2 text-center">
                  Successfully burned {totalToBurn} NFT{totalToBurn !== 1 ? "s" : ""}! 🎉
                </p>
              )}
            </div>
          )}

          {/* symbol Grid with Burn Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {ZODIACS.map((zodiac, index) => (
              <div 
                key={zodiac.name} 
                className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 flex flex-col items-center"
              >
                <div className="text-3xl text-purple-300 drop-shadow-lg filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] text-center mb-2">
                  {zodiac.symbol}
                </div>
                
                <p className="text-xs text-blue-200 text-center font-semibold mb-2">{zodiac.name}</p>
                
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-400">Owned</p>
                  <p className="text-lg font-bold text-blue-300">{sigilBalances[index] || 0}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-400">Burn</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => decrementBurnCount(index)}
                      disabled={burnCounters[index] <= 0}
                      className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold"
                    >
                      −
                    </button>
                    
                    <span className="text-lg font-bold min-w-[30px] text-center">
                      {burnCounters[index]}
                    </span>
                    
                    <button
                      onClick={() => incrementBurnCount(index)}
                      disabled={burnCounters[index] >= (sigilBalances[index] || 0)}
                      className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
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
