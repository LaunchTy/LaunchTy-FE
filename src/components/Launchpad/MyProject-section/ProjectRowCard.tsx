'use client'
import { useEffect, useState, useRef } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
} from 'framer-motion'
import Image from 'next/image'

interface Project {
	id: string
	title: string
	image: string
	logo: string
	price: string
	raiseGoal: string
	min: string
	max: string
	timeLeft?: string
}

interface ProjectSectionProps {
	projects: Project[]
	className?: string
	showCountdown?: boolean
	countdownDuration?: number // in hours
}

const ProjectSection = ({
	projects,
	className = '',
	showCountdown = true,
	countdownDuration = 12,
}: ProjectSectionProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 })
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 })

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
		if (!showCountdown) return

		const end = new Date()
		end.setHours(end.getHours() + countdownDuration)

		const interval = setInterval(() => {
			const now = new Date()
			const diff = end.getTime() - now.getTime()
			if (diff <= 0) {
				setTimeLeft('00:00:00')
				clearInterval(interval)
				return
			}
			const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
			const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
				2,
				'0'
			)
			const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
			setTimeLeft(`${hours}:${minutes}:${seconds}`)
		}, 1000)

		return () => clearInterval(interval)
	}, [showCountdown, countdownDuration])

	return (
		<section
			ref={sectionRef}
			className={`px-20 font-exo relative overflow-hidden min-h-auto ${className}`}
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

			<div className="w-full flex flex-row gap-10 z-20 relative overflow-x-auto pb-4">
				{projects.map((project, index) => (
					<motion.div
						key={project.id}
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
						className="p-5 border border-gray-300 shadow-md glass-component-1 h-[500px] w-[350px] flex-shrink-0 flex flex-col"
					>
						<Image
							src={project.image}
							alt={project.title}
							width={320}
							height={180}
							className="object-cover rounded-lg mb-4"
						/>
						<div className="flex items-center mb-2">
							<Image
								src={project.logo}
								alt="Logo"
								width={40}
								height={40}
								className="mr-2 rounded-full"
							/>
							<h3 className="text-xl font-bold">{project.title}</h3>
						</div>
						<p className="text-sm">Price: ${project.price}</p>
						<p className="text-sm">Raise Goal: ${project.raiseGoal}</p>
						<p className="text-sm">Min: ${project.min}</p>
						<p className="text-sm">Max: ${project.max}</p>
						{showCountdown && (
							<p className="mt-auto text-md font-semibold text-red-500">
								Time Left: {timeLeft}
							</p>
						)}
					</motion.div>
				))}
			</div>
		</section>
	)
}

export default ProjectSection
