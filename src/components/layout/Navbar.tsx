'use client'
import { cn } from '@/lib/utils'
import Logo from '@/public/Logo.png'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import ConnectWalletButton from '../UI/button/ConnectWalletButton'

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
	const [finalNavItems, setFinalNavItems] = useState(navItems)
	const { address } = useAccount()
	const [isAdmin, setIsAdmin] = useState(false)
	// const { scrollY } = useScroll()
	const [visible, setVisible] = useState(true)
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setActiveDropdown(null) // Tắt dropdown
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	useEffect(() => {
		if (!address) return setFinalNavItems(navItems)

		const checkAdmin = async () => {
			try {
				const res = await axios.get(`/api/admin/check-admin?address=${address}`)
				const isAdmin = res.data.isAdmin

				if (isAdmin) {
					// Thêm option Admin vào navItems
					setFinalNavItems([
						...navItems,
						{
							name: 'Admin',
							link: '/admin/dashboard',
						},
					])
				} else {
					setFinalNavItems(navItems)
				}
			} catch (err) {
				console.error('Failed to check admin:', err)
				setFinalNavItems(navItems)
			}
		}

		checkAdmin()
	}, [address])

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
						{finalNavItems.map((navItem, idx) => (
							<div
								key={`link-${idx}`}
								className="relative group"
								ref={navItem.subItems ? dropdownRef : null}
							>
								{navItem.subItems ? (
									<div className="relative">
										<button
											onClick={() =>
												setActiveDropdown(
													activeDropdown === navItem.name ? null : navItem.name
												)
											}
											className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
												activeDropdown === navItem.name
													? 'text-[#8132a2] bg-[#8132a2]/10'
													: 'text-white hover:text-[#8132a2]'
											}`}
										>
											{navItem.name}
											<ChevronDown
												size={14}
												className={`transition-all duration-300 ${
													activeDropdown === navItem.name
														? 'rotate-180 text-[#8132a2]'
														: ''
												}`}
											/>
										</button>

										<div
											className={`absolute top-full left-0 mt-2 transition-all duration-300 ease-out ${
												activeDropdown === navItem.name
													? 'opacity-100 translate-y-0 scale-100'
													: 'opacity-0 translate-y-[-20px] scale-95 pointer-events-none'
											}`}
										>
											<div className="relative">
												{/* Backdrop blur effect */}
												<div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl"></div>

												{/* Main dropdown container */}
												<div className="relative bg-gradient-to-br from-[#0f0f23]/95 via-[#1a1a2e]/95 to-[#16213e]/95 border border-[#8132a2]/30 rounded-2xl shadow-2xl py-4 w-64 z-50 overflow-hidden">
													{/* Animated background gradient */}
													<div className="absolute inset-0 bg-gradient-to-br from-[#8132a2]/5 via-transparent to-[#a855f7]/5 animate-pulse"></div>

													{/* Header */}
													<div className="px-4 pb-2 mb-2 border-b border-[#8132a2]/20">
														<p className="text-xs font-semibold text-[#8132a2] uppercase tracking-wider">
															{navItem.name}
														</p>
													</div>

													{navItem.subItems.map((subItem, subIdx) => (
														<Link
															key={`sublink-${subIdx}`}
															href={subItem.link}
															onClick={() => setActiveDropdown(null)}
															className="relative flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-200 group/item hover:bg-gradient-to-r hover:from-[#8132a2]/10 hover:to-transparent"
														>
															<div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#8132a2]/20 to-[#a855f7]/20 flex items-center justify-center group-hover/item:from-[#8132a2]/40 group-hover/item:to-[#a855f7]/40 transition-all duration-200">
																<div className="w-2 h-2 rounded-full bg-[#8132a2] group-hover/item:scale-125 transition-transform duration-200"></div>
															</div>

															<span className="flex-1 group-hover/item:translate-x-1 transition-transform duration-200 font-medium">
																{subItem.name}
															</span>

															<ChevronDown
																size={12}
																className="rotate-[-90deg] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-200 text-[#8132a2]"
															/>

															<div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#8132a2] to-[#a855f7] transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200 origin-center rounded-r-full"></div>
														</Link>
													))}

													<div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#8132a2]/50 to-transparent"></div>
												</div>
											</div>
										</div>
									</div>
								) : (
									<Link
										href={navItem.link || '/'}
										className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-[#8132a2]  duration-300 transform transition-all hover:scale-105 active:scale-95"
									>
										<span className="hidden sm:block">{navItem.name}</span>
									</Link>
								)}
							</div>
						))}
					</div>
					<div className={`flex items-center gap-3 sm:gap-5 `}>
						{/* <div className="relative hidden lg:block">
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
						</div> */}
						{/* <Button className="hidden lg:block bg-gradient text-white px-4 sm:px-5 py-2 rounded-full shadow-[0_0_10px_rgba(192,74,241,0.6),0_0_20px_rgba(39,159,232,0.4)] hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 text-sm sm:text-md">
							Connect Wallet
						</Button> */}
						{/* <ConnectButton accountStatus="avatar" />{' '} */}
						<div className="hidden lg:block">
							<ConnectWalletButton />
						</div>
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
							{finalNavItems.map((navItem, idx) => (
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
								{/* <input
									type="text"
									placeholder="Search project"
									className="glass-component-2  rounded-full px-4 sm:px-7 py-2 text-sm sm:text-md font-exo focus:outline-none focus:ring-0"
								/> */}
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
