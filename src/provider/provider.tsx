'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia, polygon, anvil } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const config = getDefaultConfig({
	appName: 'LaunchTy',
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
	chains: [mainnet, sepolia, polygon, anvil],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[polygon.id]: http(),
		[anvil.id]: http('http://127.0.0.1:8545'),
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
