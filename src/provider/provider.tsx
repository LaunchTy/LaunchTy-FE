'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia, polygon, anvil, moonbaseAlpha } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Định nghĩa Moonbase Alpha chain

export const config = getDefaultConfig({
	appName: 'LaunchTy',
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
	chains: [mainnet, sepolia, polygon, anvil, moonbaseAlpha],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[polygon.id]: http(),
		[anvil.id]: http('http://127.0.0.1:8545'),
		[moonbaseAlpha.id]: http(),
	},
	ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>{children}</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
