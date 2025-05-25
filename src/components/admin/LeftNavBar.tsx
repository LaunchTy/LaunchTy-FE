'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '@/public/Logo.png'
import icon_rocket from '@/public/icon_rocket.png'
import icon_donate from '@/public/icon_donate.png'
import less_menu_icon from '@/public/less_menu_icon.png'

interface LeftMenuProps {
	activeMenu: string
	setActiveMenu: (menu: string) => void
}

const LeftMenu: React.FC<LeftMenuProps> = ({ activeMenu, setActiveMenu }) => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const toggleCollapse = () => setIsCollapsed(!isCollapsed)

	return (
		<div
			className={`glass-component-2 rounded-[40px] p-6 text-white transition-all duration-300 overflow-hidden ${
				isCollapsed ? 'w-[80px]' : 'w-full max-w-[300px]'
			}`}
		>
			{/* Header: Logo + Title + Toggle */}
			<div className="flex items-center justify-between mb-5">
				{/* Logo + Title */}
				{isCollapsed ? (
					<div className="pl-1">
						<button
							onClick={toggleCollapse}
							className="rounded-full transition"
						>
							<Image
								src={less_menu_icon.src}
								alt="toggle menu"
								width={19}
								height={19}
								className={`object-contain transition-transform duration-300 ${
									isCollapsed ? 'rotate-180' : ''
								}`}
							/>
						</button>
					</div>
				) : (
					<div className="">
						<div
							className={`flex items-center gap-3 transition-all duration-300 opacity-100 w-auto`}
						>
							<Image
								src={Logo.src}
								alt="Logo"
								width={35}
								height={35}
								className="w-7 h-7 object-contain"
							/>
							<span className="text-lg font-semibold whitespace-nowrap">
								LaunchTy
							</span>
							<button onClick={toggleCollapse} className="ml-1 transition">
								<Image
									src={less_menu_icon.src}
									alt="toggle menu"
									width={30}
									height={30}
									className={`object-contain transition-transform duration-300 ${
										isCollapsed ? 'rotate-180' : ''
									}`}
								/>
							</button>
						</div>

						{/* Toggle Button */}
					</div>
				)}
				{/*  */}
			</div>

			{/* Menu */}
			<ul className="flex flex-col gap-7">
				<li>
					<a
						href="/admin/launchpad"
						onClick={() => setActiveMenu('launchpad')}
						className={`flex items-center gap-3 text-sm transition duration-150 pt-2 ${
							activeMenu === 'launchpad'
								? 'text-[#F05550] font-semibold'
								: 'hover:text-[#8132a2]'
						}`}
					>
						<Image
							src={icon_rocket.src}
							alt="icon_rocket"
							width={28}
							height={28}
							className="w-7 h-7 object-contain"
						/>
						<span
							className={`transition-all duration-300 ${
								isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto pl-2'
							}`}
						>
							Launchpad
						</span>
					</a>
				</li>
				<li>
					<a
						href="/admin/charity"
						onClick={() => setActiveMenu('charity')}
						className={`flex items-center text-sm gap-3 transition duration-150 ${
							activeMenu === 'charity'
								? 'text-[#F05550] font-semibold'
								: 'hover:text-[#8132a2]'
						}`}
					>
						<Image
							src={icon_donate.src}
							alt="icon_donate"
							width={28}
							height={28}
							className="w-7 h-7 object-contain"
						/>
						<span
							className={`transition-all duration-300 ${
								isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto pl-2'
							}`}
						>
							Charity
						</span>
					</a>
				</li>
			</ul>
		</div>
	)
}

export default LeftMenu
