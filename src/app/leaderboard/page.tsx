"use client"

import { useEffect, useState } from "react"
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

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
    setCurrentPage(1)
  }, [searchTerm, owners])

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOwners = filteredOwners.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">NFT Owners</h1>
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
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Wallet Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Orbs</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {paginatedOwners.map((owner, index) => (
                    <tr
                      key={`${owner.wallet}-${index}`}
                      className="border-b border-border transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm text-foreground">
                          {owner.wallet}
                        </code>
                      </td>
                      <td className="px-10 py-4 text-sm text-foreground">{owner.balance}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredOwners.length)} of {filteredOwners.length}{" "}
                  owners
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
