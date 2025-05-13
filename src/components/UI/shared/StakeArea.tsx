import Logo from '@/public/Logo.png'
import React from 'react'
import Image from 'next/image'
import Vector from '@/public/Vector.svg'

import { ModalTrigger } from '../modal/AnimatedModal'
import Button from '../button/Button'
const StakeArea = () => {
	return (
		<div className="mt-6">
			<div className="glass-component-1 p-4 text-white rounded-xl">
				<div className="glass-component-1 rounded-xl h-36">
					<div className="font-orbitron font-bold text-base mt-6 mb-7 ml-4 text-[#C2C6CC]">
						Number of staked token
					</div>

					<div className="flex flex-row items-center">
						<div className="ml-6 text-white text-2xl font-bold font-comfortaa">
							--USDT
						</div>
						{/* Token choosing */}
					</div>
				</div>

				<div className=" flex flex-row gap-2 mt-4 w-full">
					{/* stake button */}

					<Button
						className="w-full bg-gradient font-extrabold glass-component-1"
						onClick={() => {
							alert('Stake button clicked')
						}}
					>
						Deposit
					</Button>

					{/* <button
						onClick={() => {
							alert('Unstake button clicked')
						}}
						className={`
								px-4 py-2 glass-component-1 text-white rounded-full w-1/3 font-comfortaa font-extrabold
								transition-all duration-300 ease-in-out 
    				hover:opacity-80 hover:shadow-lg hover:scale-105 
    				active:scale-95 active:opacity-90 
        		`}
					>
						Unstake
					</button> */}
				</div>
			</div>
		</div>
	)
}

export default StakeArea
