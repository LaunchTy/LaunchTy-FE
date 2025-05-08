'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedGridBackgroundProps {
	className?: string
}

export default function AnimatedGridBackground({
	className,
}: AnimatedGridBackgroundProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Create a grid
	const rows = 12
	const cols = 12
	const gridItems = Array.from({ length: rows * cols }, (_, i) => i)

	if (!mounted) return null

	return (
		<div className={` ${className}`}>
			<div className="absolute inset-0 ">
				<div
					className="grid h-full w-full"
					style={{
						gridTemplateColumns: `repeat(${cols}, 1fr)`,
						gridTemplateRows: `repeat(${rows}, 1fr)`,
					}}
				>
					{gridItems.map((item) => {
						const row = Math.floor(item / cols)
						const col = item % cols

						// Create wave-like animations with different phases
						const phaseX = (col / cols) * Math.PI * 2
						const phaseY = (row / rows) * Math.PI * 2
						const delay = ((col + row) / (cols + rows)) * 2

						return (
							<motion.div
								key={item}
								className="border border-slate-800/30 relative"
								initial={{ opacity: 0.1 }}
								animate={{
									opacity: [0.1, 0.3, 0.1],
									scale: [1, 1.05, 1],
									backgroundColor: [
										'rgba(100, 116, 139, 0.05)',
										'rgba(100, 116, 139, 0.15)',
										'rgba(100, 116, 139, 0.05)',
									],
								}}
								transition={{
									duration: 8,
									delay: delay,
									repeat: Number.POSITIVE_INFINITY,
									ease: 'easeInOut',
								}}
							>
								{/* Pulsing cell effect */}
								<motion.div
									className="absolute inset-0 bg-cyan-500/10 rounded-md"
									initial={{ scale: 0, opacity: 0 }}
									animate={{
										scale: [0, 1, 0],
										opacity: [0, 0.5, 0],
									}}
									transition={{
										duration: 4,
										delay: delay + (Math.sin(phaseX) + Math.cos(phaseY)) * 2,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'easeInOut',
									}}
								/>
							</motion.div>
						)
					})}
				</div>
			</div>

			{/* Floating lines that move across the grid */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 8 }).map((_, i) => {
					const isHorizontal = i % 2 === 0
					const size = Math.random() * 2 + 1

					return (
						<motion.div
							key={i}
							className="absolute bg-gradient-to-r from-transparent via-slate-400/10 to-transparent"
							style={{
								height: isHorizontal ? `${size}px` : '100%',
								width: isHorizontal ? '100%' : `${size}px`,
							}}
							initial={{
								x: isHorizontal ? 0 : Math.random() * window.innerWidth,
								y: isHorizontal ? Math.random() * window.innerHeight : 0,
								opacity: 0,
							}}
							animate={{
								x: isHorizontal
									? 0
									: [
											Math.random() * window.innerWidth,
											Math.random() * window.innerWidth,
										],
								y: isHorizontal
									? [
											Math.random() * window.innerHeight,
											Math.random() * window.innerHeight,
										]
									: 0,
								opacity: [0, 0.5, 0],
							}}
							transition={{
								duration: Math.random() * 10 + 15,
								repeat: Number.POSITIVE_INFINITY,
								ease: 'linear',
								delay: Math.random() * 5,
							}}
						/>
					)
				})}
			</div>

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 30 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full"
						style={{
							width: `${Math.random() * 4 + 1}px`,
							height: `${Math.random() * 4 + 1}px`,
							backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
						}}
						initial={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
							scale: Math.random() * 1 + 0.5,
						}}
						animate={{
							x: [
								Math.random() * window.innerWidth,
								Math.random() * window.innerWidth,
								Math.random() * window.innerWidth,
							],
							y: [
								Math.random() * window.innerHeight,
								Math.random() * window.innerHeight,
								Math.random() * window.innerHeight,
							],
							opacity: [0.2, 0.6, 0.2],
						}}
						transition={{
							duration: Math.random() * 30 + 20,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</div>
		</div>
	)
}
