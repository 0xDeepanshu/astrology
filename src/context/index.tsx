'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { bscTestnet } from '@reown/appkit/networks'
import React, { type ReactNode, useEffect } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  useEffect(() => {
    // Set up metadata
    const metadata = {
      name: 'AstroLOLogy',
      description: 'Mint mystical zodiac Symbols as the cosmic wheel turns',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com', // dynamically determine URL or use default
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    }

    // Check if projectId exists before creating the modal
    if (projectId) {
      const modal = createAppKit({
        adapters: [wagmiAdapter],
        projectId,
        networks: [bscTestnet],
        defaultNetwork: bscTestnet,
        metadata: metadata,
        features: {
          analytics: true // Optional - defaults to your Cloud configuration
        }
      })
    } else {
      console.warn('NEXT_PUBLIC_PROJECT_ID is not defined. Wallet connection features may not work properly.');
    }
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider