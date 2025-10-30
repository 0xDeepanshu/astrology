"use client"
import { useState, useEffect } from 'react'
import { ShootingStarsAndStarsBackgroundDemo } from "../Shootingstarsbg"
import { SigilCard } from "./sigil-card"
import { StatsCard } from "./stats-card"
import { useAccount, usePublicClient } from 'wagmi'
import { ZODIACS } from '@/lib/zodiacs'
import { ASTROSIGILS_CONTRACT_ADDRESS } from '@/contracts'
import astrosigilsAbi from '@/abi/astrosigils.json'

export function SigilInventory() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [sigilBalances, setSigilBalances] = useState<number[]>(Array(ZODIACS.length).fill(0))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch all token balances when wallet is connected
  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setSigilBalances(Array(ZODIACS.length).fill(0));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Create array of promises to fetch all balances
    const balancePromises = ZODIACS.map(async (zodiac) => {
      try {
        const result = await publicClient.readContract({
          address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
          abi: astrosigilsAbi,
          functionName: 'balanceOf',
          args: [address, BigInt(zodiac.index)],
        });
        return Number(result);
      } catch (err) {
        console.error(`Error fetching balance for ${zodiac.name}:`, err);
        return 0;
      }
    });

    Promise.all(balancePromises)
      .then(balances => {
        setSigilBalances(balances);
      })
      .catch(err => {
        console.error('Error fetching balances:', err);
        setError(err.message || 'Error fetching balances');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, isConnected, publicClient]);

  // Calculate stats
  const totalSigils = sigilBalances.reduce((sum, balance) => sum + balance, 0)  // Total number of NFTs owned
  const uniqueTypes = sigilBalances.filter(count => count > 0).length  // Number of unique types owned (types with count > 0)
  const totalTypes = ZODIACS.length  // Total possible types (12 in this case)

  // Create formatted sigil data
  const zodiacSigils = ZODIACS.map((zodiac, index) => ({
    name: zodiac.name,
    count: sigilBalances[index] || 0,
    symbol: zodiac.symbol
  }))

  return (
    <div className="min-h-screen relative overflow-hidden">
     <ShootingStarsAndStarsBackgroundDemo/>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-200 mb-2 drop-shadow-lg">symbol Inventory</h1>
          <p className="text-lg text-blue-300/70">Your collection of mystical zodiac Symbols</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <StatsCard label="Total Symbols owned by user" value={totalSigils} />
          <StatsCard label="Unique Types Owned" value={uniqueTypes} />
        </div>

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

        {/* symbol Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {zodiacSigils.map((sigil) => (
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
