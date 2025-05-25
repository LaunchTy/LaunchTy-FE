'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from './Button'
import { ChevronDown, Wallet, Network } from 'lucide-react'

const ConnectWalletButton = () => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openConnectModal,
				openChainModal,
				openAccountModal,
				mounted,
			}) => {
				const ready = mounted
				const connected = ready && account && chain

				return (
					<div
						{...(!ready && {
							'aria-hidden': true,
							style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
						})}
					>
						{!connected ? (
							<Button
								onClick={openConnectModal}
								className="hidden lg:block bg-gradient text-white px-4 sm:px-5 py-2 rounded-full shadow-[0_0_10px_rgba(192,74,241,0.6),0_0_20px_rgba(39,159,232,0.4)] hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 text-sm sm:text-md"
							>
								Connect Wallet
							</Button>
						) : chain.unsupported ? (
							<Button
								onClick={openChainModal}
								className="bg-red-500 text-white px-4 py-2 rounded-lg"
							>
								Wrong network
							</Button>
						) : (
							// <div className="flex items-center gap-3">
							// 	<Button
							// 		onClick={openChainModal}
							// 		className="bg-gray-200 px-3 py-1 rounded-lg"
							// 	>
							// 		{chain.name}
							// 	</Button>
							// 	<Button
							// 		onClick={openAccountModal}
							// 		className="bg-gray-800 text-white px-3 py-1 rounded-lg"
							// 	>
							// 		{account.displayName}
							// 	</Button>
							// </div>
							<div className="flex items-center gap-2">
								{/* Chain Selector */}
								<Button
									// variant="outline"
									onClick={openChainModal}
									className="flex bg-white items-center gap-2 px-3 py-2 h-auto border-border/50 hover:border-border transition-colors"
								>
									<Network className="w-4 h-4 text-blue-500" />
									<span className="text-sm font-medium text-gradient">
										{chain.name}
									</span>
									<ChevronDown className="w-3 h-3 text-muted-foreground text-blue-500" />
								</Button>

								{/* Account Display */}
								<Button
									// variant="default"
									onClick={openAccountModal}
									className="flex items-center gap-2 px-3 py-2 h-auto bg-gradient transition-all duration-200"
								>
									<Wallet className="w-4 h-4" />
									<span className="text-sm font-medium">
										{account.displayName}
									</span>
									<ChevronDown className="w-3 h-3" />
								</Button>
							</div>
						)}
					</div>
				)
			}}
		</ConnectButton.Custom>
	)
}

export default ConnectWalletButton
