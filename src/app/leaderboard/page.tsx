"use client"

import { useEffect, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { ShootingStarsAndStarsBackgroundDemo } from "@/components/Shootingstarsbg"
interface Owner {
  wallet: string
  balance: string
  tokenId: string
}

export default function NFTOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch("/api/nft-owners")
        const data = await res.json()
        if (data.owners) {
          setOwners(data.owners)
          setFilteredOwners(data.owners)
        }
      } catch (error) {
        console.error("Failed to fetch owners:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOwners()
  }, [])

  useEffect(() => {
    const filtered = owners.filter((owner) => owner.wallet.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredOwners(filtered)
  }, [searchTerm, owners])

  return (
    
    <main className="min-h-screen relative bg-black overflow-hidden">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-3xl text-orange-400 font-bold tracking-tight ">NFT Owners</h1>
            <p className="text-muted-foreground">View all wallet addresses and their NFT holdings</p>
      
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading NFT owners...</p>
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "No owners found matching your search." : "No NFT owners found."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border border-orange-300 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border border-orange-300 bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Wallet Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Balance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Token ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((owner, index) => (
                    <tr
                      key={`${owner.wallet}-${index}`}
                      className="border-b border-border border-orange-300 transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm text-foreground">
                          {owner.wallet}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{owner.balance}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{owner.tokenId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOwners.length} of {owners.length} owners
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
