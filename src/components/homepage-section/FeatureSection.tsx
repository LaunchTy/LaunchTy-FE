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
// import AnimatedBlobs from '../UI/background/AnimatedBlobs'

const FeatureSection = () => {
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

	return (
		<section
			ref={sectionRef}
			className="p-20 font-exo relative overflow-hidden min-h-auto"
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
					Key features
				</motion.span>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-full max-w-4xl">
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
							className="p-5 border border-gray-300 shadow-md glass-component-1 h-[350px]"
						>
							<h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
							<p className="text-lg text-gray-300">{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default FeatureSection
