'use client'
import { useEffect, useState, useRef } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
} from 'framer-motion'
import { features } from '@/constants/utils'
import Image from 'next/image'
// import AnimatedBlobs from '../UI/background/AnimatedBlobs'

const ProjectSection = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 })
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 })

	// Scroll animation setup
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start end', 'end start'],
	})

	const borderRadius = useTransform(
		scrollYProgress,
		[0, 0.2],
		['0.375rem', '1rem']
	)

	const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

	const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

	const [timeLeft, setTimeLeft] = useState('12:00:04')

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e
			const sectionRect = sectionRef.current?.getBoundingClientRect()

			if (sectionRect) {
				const x = clientX - sectionRect.left
				const y = clientY - sectionRect.top

				setMousePosition({ x, y })
				mouseX.set(x)
				mouseY.set(y)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	useEffect(() => {
		// Example: countdown from 12 hours
		const end = new Date()
		end.setHours(end.getHours() + 12)

		const interval = setInterval(() => {
			const now = new Date()
			const diff = end.getTime() - now.getTime()
			if (diff <= 0) {
				setTimeLeft('00:00:00')
				clearInterval(interval)
				return
			}
			const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
			const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0')
			const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
			setTimeLeft(`${hours}:${minutes}:${seconds}`)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<section
			ref={sectionRef}
			className="px-20 font-exo relative overflow-hidden min-h-auto"
		>
			<motion.div
				className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none z-10"
				style={{
					x: smoothX,
					y: smoothY,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>

			<div className="w-full flex flex-col items-center justify-center gap-10 z-20 relative">
				<motion.span
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="text-[45px] font-bold"
				>
				</motion.span>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-full">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 1,
								delay: index * 0.3,
								ease: 'easeOut',
							}}
							viewport={{ once: true, margin: '-200px' }}
							style={{
								borderRadius,
								opacity,
								scale,
							}}
							className="p-5 border border-gray-300 shadow-md glass-component-1 h-[500px] flex flex-col"
						>
							{/* Image Section */}
							<div className='relative w-full h-[240px] rounded-[3.2rem] bg-white '>
								<div className="relative w-full h-[200px] rounded-tr-xl rounded-tl-xl overflow-hidden">
									<Image
										src={feature.image}
										alt={feature.title}
										fill
										className="object-cover"
									/>
								</div>
								<div className=" shadow flex items-center justify-center pt-1">
									<span className="font-mono font-bold text-red-500 tracking-widest text-2xl">{timeLeft}</span>
								</div>

							</div>	
							{/* Project Name and Logo */}
							<div className="flex items-start justify-between py-5 border-b">
								<div className="flex flex-col w-3/4">
									<h4 className="text-lg font-bold mb-1 truncate" title={feature.title}>
										{feature.title}
									</h4>
									<div className="text-sm text-gray-400">Price project token = 19999999 vDot</div>
								</div>
								<div className="relative w-12 h-12 rounded-full overflow-hidden">
									<Image
										src={feature.logo}
										alt="Project Logo"
										fill
										className="object-cover"
									/>
								</div>
							</div>

							{/* Funding Information */}
							<div className="grid grid-cols-2 gap-8 mt-4">
								{/* Left column: labels */}
								<div className="flex flex-col gap-4 text-right pr-2">
									<p className="text-sm text-start">Price:</p>
									<p className="text-sm text-start">Raise Goal:</p>
									<div className="flex justify-between text-sm">
										<span>Min:</span>
										<span className="text-gray-400">${feature.min || '0'}</span>
									</div>
								</div>
								{/* Right column: values */}
								<div className="flex flex-col gap-4 text-left pl-2">
									<p className="text-sm text-gray-400 text-end">${feature.price || '0.00'}</p>
									<p className="text-sm text-gray-400 text-end">${feature.raiseGoal || '0'}</p>
									<div className="flex justify-between text-sm">
										<span>Max:</span>
										<span className="text-gray-400">${feature.max || '0'}</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default ProjectSection
