import { useState } from 'react'
import Button from '../button/Button'
import useLaunchpadTokenAmountStore from '@/store/launchpad/LaunchpadDetailStore'
import Image from 'next/image'

interface StakeAreaProps {
	handleDeposit: () => void
}
const StakeArea: React.FC<StakeAreaProps> = ({ handleDeposit }) => {
	const { setTokenAmount } = useLaunchpadTokenAmountStore()
	return (
		<div className="mt-6">
			<div className="glass-component-1 p-4 text-white rounded-xl">
				<div className="glass-component-1 rounded-xl h-36">
					<div className="font-orbitron font-bold text-base mt-6 mb-7 ml-4 text-[#C2C6CC]">
						Number of staked token
					</div>

					<div className="flex flex-row items-center justify-between pr-5">
						<input
							type="number"
							className="ml-6 text-white text-2xl font-bold bg-transparent outline-none w-2/3
							[&::-webkit-inner-spin-button]:appearance-none 
    						[&::-webkit-outer-spin-button]:appearance-none"
							placeholder="--USDT"
							onChange={(e) => {
								setTokenAmount(parseInt(e.target.value))
							}}
						/>
						<div className="w-1/3 flex flex-row items-center justify-end">
							<div className="relative w-12 h-12 rounded-full overflow-hidden">
								<Image
									src="https://s3.coinmarketcap.com/static-gravity/image/fecbf806c893460cbc5241d4e902b039.png"
									alt="Project Logo"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className=" flex flex-row gap-2 mt-4 w-full">
					{/* stake button */}

					<Button
						className="w-full bg-gradient font-extrabold glass-component-1"
						onClick={handleDeposit}
					>
						Deposit
					</Button>
				</div>
			</div>
		</div>
	)
}

export default StakeArea
