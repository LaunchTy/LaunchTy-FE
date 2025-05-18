'use client'
import { StaticImageData } from 'next/image'
import React from 'react'

interface ExploreProjectProps {
	title: string
	backgroundImage: string | { src: string } // Supports both URL and imported image/SVG
	searchPlaceholder?: string
}

const ExploreProject = ({
	title,
	backgroundImage,
	searchPlaceholder = 'Search projects...',
}: ExploreProjectProps) => {
	// Handle imported images with `src` property
	const resolvedBackgroundImage =
		typeof backgroundImage === 'string' ? backgroundImage : backgroundImage.src

	return (
		<div
			className="w-full relative min-h-[300px] bg-cover bg-center bg-no-repeat mt-44"
			style={{
				backgroundImage: `url("${resolvedBackgroundImage}")`,
				zIndex: 1,
			}}
		>
			<div className="relative z-30 flex items-center justify-between px-16 py-32">
				{/* Left Side - Title */}
				<div className="flex-1">
					<h1 className="text-[45px] font-bold text-white pl-10">{title}</h1>
				</div>

				{/* Right Side - Search */}
				<div className="flex-1 flex justify-end">
					<div className="w-full max-w-xl">
						<div className="relative">
							<input
								type="text"
								placeholder={searchPlaceholder}
								className="w-full px-6 py-4 rounded-[20px] bg-transparent backdrop-blur-sm border border-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:border-[#8132a2] transition-all duration-300"
								style={{
									backgroundColor: 'rgba(255, 255, 255, 0.13)',
									border: '1px solid rgba(255, 255, 255, 0.37)',
								}}
							/>
							<div className="absolute right-6 top-1/2 -translate-y-1/2">
								<svg
									className="w-5 h-5 text-gray-400"
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
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ExploreProject
