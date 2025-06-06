'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from '@/public/Logo.png'
import { cn } from '@/lib/utils'
import Button from '../UI/button/Button'
import ConnectWalletButton from '../UI/button/ConnectWalletButton'

import { ConnectButton } from '@rainbow-me/rainbowkit'

const Navbar = ({
	navItems,
	className,
}: {
	navItems: {
		name: string
		link?: string
		icon?: JSX.Element
		subItems?: Array<{
			name: string
			link: string
			icon?: JSX.Element
		}>
	}[]
	className?: string
}) => {
	const [toggle, setToggle] = useState(false)
	const toggleNavbar = () => setToggle(!toggle)

	// const { scrollY } = useScroll()
	const [visible, setVisible] = useState(true)
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

	useEffect(() => {
		let lastScrollY = window.scrollY

		const handleScroll = () => {
			const currentScrollY = window.scrollY

			if (currentScrollY < 50) {
				setVisible(true)
			} else if (currentScrollY > lastScrollY) {
				setVisible(false)
			} else {
				setVisible(true)
			}

			lastScrollY = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 1, y: 0 }}
				animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
				transition={{ duration: 0.2 }}
				className={cn(
					'fixed top-0 inset-x-0 z-[100] mx-auto  max-w-fit rounded-full  shadow-lg px-5 py-2 space-x-4 mt-10 glass-component-1 flex-2 font-exo',
					className
				)}
			>
				<div className="flex justify-between items-center gap-10 lg:gap-36">
					<div className="flex items-center flex-shrink-0 transition-transform transform hover:-translate-y-1 duration-300 p-3">
						<Image src={Logo} alt="Logo" className="h-6 w-8 sm:w-10 mr-2" />{' '}
						{/* Adjusted logo size */}
						<Link href={'/'}>
							<span className="text-lg sm:text-xl tracking-tight text-white font-bold">
								LaunchTy
							</span>
						</Link>
					</div>
					<div className="hidden lg:flex items-center space-x-4 gap-3 sm:gap-5">
						{/* {navItems.map((navItem, idx) => (
							<Link
								key={`link=${idx}`}
								href={navItem.link}
								className="relative dark:text-neutral-50 flex items-center space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
							>
								<span className="hidden sm:block text-sm sm:text-md hover:text-[#8132a2] duration-150 text-white active:text-[#F05550] transform transition-transform hover:scale-105 active:scale-95">
									{navItem.name}
								</span>
							</Link>
						))} */}
						{navItems.map((navItem, idx) => (
							<div key={`link-${idx}`} className="relative group">
								{navItem.subItems ? (
									<div className="relative">
										<button
											onClick={() =>
												setActiveDropdown(
													activeDropdown === navItem.name ? null : navItem.name
												)
											}
											className="flex items-center gap-1 text-sm text-white hover:text-[#8132a2] duration-150 hover:scale-105"
										>
											{navItem.name}
											<ChevronDown size={14} />
										</button>

										{activeDropdown === navItem.name && (
											<div className="absolute mt-2 bg-[#0b0b1f] rounded-md shadow-lg py-2 w-48 z-50">
												{navItem.subItems.map((subItem, subIdx) => (
													<Link
														key={`sublink-${subIdx}`}
														href={subItem.link}
														className="block px-4 py-2 text-sm text-white hover:bg-[#8132a2] hover:text-white"
													>
														{subItem.name}
													</Link>
												))}
											</div>
										)}
									</div>
								) : (
									<Link
										href={navItem.link || '/'}
										className="text-sm sm:text-md text-white hover:text-[#8132a2] duration-150 transform transition-transform hover:scale-105 active:scale-95"
									>
										<span className="hidden sm:block text-sm sm:text-md hover:text-[#8132a2] duration-150 text-white active:text-[#F05550] transform transition-transform hover:scale-105 active:scale-95">
											{navItem.name}
										</span>
									</Link>
								)}
							</div>
						))}
					</div>
					<div className={`flex items-center gap-3 sm:gap-5 `}>
						<div className="relative hidden lg:block">
							<input
								type="text"
								placeholder="Search project"
								className="glass-component-2 rounded-full px-4 sm:px-7 py-2 text-sm sm:text-md font-orbitron focus:outline-none focus:ring-0"
							/>
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						{/* <Button className="hidden lg:block bg-gradient text-white px-4 sm:px-5 py-2 rounded-full shadow-[0_0_10px_rgba(192,74,241,0.6),0_0_20px_rgba(39,159,232,0.4)] hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 text-sm sm:text-md">
							Connect Wallet
						</Button> */}
						{/* <ConnectButton accountStatus="avatar" />{' '} */}
						<ConnectWalletButton />
					</div>
					<div className="lg:hidden flex flex-col justify-end">
						<button onClick={toggleNavbar}>
							{toggle ? (
								<X size={24} color="white" />
							) : (
								<Menu size={24} color="white" />
							)}
						</button>
					</div>
				</div>

				{toggle && (
					<div className="fixed right-0 top-20 z-20 bg-[#000626] w-full p-8 sm:p-12 flex flex-col justify-center items-center lg:hidden rounded-md">
						<div className="py-5 flex flex-col items-center space-y-3 sm:space-y-5">
							{navItems.map((navItem, idx) => (
								<Link
									key={`link=${idx}`}
									href={navItem.link || '/'}
									className="relative dark:text-neutral-50 flex items-center space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
								>
									<span className="text-sm sm:text-md hover:text-[#8132a2] duration-150 text-white active:text-[#F05550] transform transition-transform hover:scale-105 active:scale-95">
										{navItem.name}
									</span>
								</Link>
							))}
						</div>

						<div className="flex flex-col items-center gap-3 sm:gap-5">
							<div className="relative ">
								<input
									type="text"
									placeholder="Search project"
									className="glass-component-2  rounded-full px-4 sm:px-7 py-2 text-sm sm:text-md font-exo focus:outline-none focus:ring-0"
								/>
								<svg
									className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							{/* <Button className="bg-gradient text-white px-4 sm:px-5 py-2 rounded-full shadow-[0_0_10px_rgba(192,74,241,0.6),0_0_20px_rgba(39,159,232,0.4)] hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 text-sm sm:text-md">
								Connect Wallet
							</Button> */}
							<ConnectWalletButton />
						</div>
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	)
}

export default Navbar
