'use client'
import React from 'react'
import Button from '@/components/UI/button/Button'
import { useEffect, useState, useRef } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
} from 'framer-motion'
import Image from 'next/image'
import { BaseProject } from '@/interface/interface'
import { convertNumToOffChainFormat } from '@/app/utils/decimal'
// interface Project {
// 	id: string
// 	title: string
// 	image: string
// 	shortDescription: string
// 	tokenSymbol: string
// 	totalInvest: number
// 	endsInDays?: number
// 	endTime?: string // Optional end time for countdown
// 	status?: 'pending' | 'approve' | 'deny' | 'publish'
// }

interface ProjectSectionProps {
	projects: BaseProject[]
	className?: string
	onEdit?: (projectId: string) => void
	handlePublish?: (project: BaseProject) => void
	onWithdraw?: (projectId: string) => void
	showCountdown?: boolean
	countdownDuration?: number // in hours
	launchpadStatus?: 'pending' | 'approve' | 'deny' | 'publish'
	projectType: 'charity' | 'launchpad'
}

const ProjectSection = ({
	projects,
	className = '',
	showCountdown = true,
	countdownDuration = 12, // in hours
	onEdit,
	onWithdraw,
	handlePublish,
	launchpadStatus,
	projectType,
}: ProjectSectionProps) => {
	// const sectionRef = useRef<HTMLElement>(null)
	// const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	// const mouseX = useMotionValue(0)
	// const mouseY = useMotionValue(0)
	const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})

	// const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 })
	// const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 })

	// const { scrollYProgress } = useScroll({
	// 	target: sectionRef,
	// 	offset: ['start end', 'end start'],
	// })

	// const borderRadius = useTransform(
	// 	scrollYProgress,
	// 	[0, 0.2],
	// 	['0.375rem', '1rem']
	// )

	// const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
	// const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

	useEffect(() => {
		if (!showCountdown) return

		const calculateTimeLeft = (endTime: string) => {
			const end = new Date(endTime)
			const now = new Date()
			const diff = end.getTime() - now.getTime()

			if (diff <= 0) return 'Ended'

			const days = Math.floor(diff / (1000 * 60 * 60 * 24))
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			)
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diff % (1000 * 60)) / 1000)

			if (days >= 1) {
				return `${days}d ${hours}h`
			} else {
				return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
			}
		}

		const updateCountdowns = () => {
			const newCountdowns: { [key: string]: string } = {}
			projects.forEach((project) => {
				if (project.endDate) {
					newCountdowns[project.id || ''] = calculateTimeLeft(project.endDate)
				} else {
					// Fallback to countdownDuration if no endTime is provided
					const end = new Date()
					end.setHours(end.getHours() + countdownDuration)
					newCountdowns[project.id || ''] = calculateTimeLeft(end.toISOString())
				}
			})
			setCountdowns(newCountdowns)
		}

		// Initial update
		updateCountdowns()

		// Update every second
		const interval = setInterval(updateCountdowns, 1000)

		return () => clearInterval(interval)
	}, [showCountdown, countdownDuration, projects])

	// useEffect(() => {
	// 	const handleMouseMove = (e: MouseEvent) => {
	// 		const { clientX, clientY } = e
	// 		const sectionRect = sectionRef.current?.getBoundingClientRect()

	// 		if (sectionRect) {
	// 			const x = clientX - sectionRect.left
	// 			const y = clientY - sectionRect.top

	// 			setMousePosition({ x, y })
	// 			mouseX.set(x)
	// 			mouseY.set(y)
	// 		}
	// 	}

	// 	window.addEventListener('mousemove', handleMouseMove)
	// 	return () => window.removeEventListener('mousemove', handleMouseMove)
	// }, [mouseX, mouseY])

	return (
		<section
			// ref={sectionRef}
			className={`px-20 py-12 font-exo relative overflow-hidden min-h-auto ${className}`}
		>
			<div className="grid gap-6 z-20 relative">
				{projects.map((project, index) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
						className="relative z-20 px-5 py-4 border border-gray-300 shadow-md glass-component-2 rounded-[40px] grid grid-cols-5 items-center gap-8"
					>
						{/* Project Image */}
						<div className="flex gap-10">
							<div className="flex-shrink-0 w-[60px] h-[60px] rounded-full overflow-hidden">
								<Image
									src={
										project.logo || project.images?.[0] || '/default-project.png'
									}
									alt={project.name || 'Project Image'}
									width={4000}
									height={4000}
									className="object-cover w-full h-full"
								/>
							</div>
							{/* Project info */}
							{/* Cột 2: Tên + mô tả */}
							<div className="flex-1 flex flex-col max-w-[300px]">
								<h2 className="text-lg font-semibold text-white truncate whitespace-nowrap overflow-hidden text-ellipsis">
									{project.name || 'Unnamed Project'}
								</h2>
								<p className="text-white text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
									{project.shortDescription}
								</p>
							</div>
						</div>

						{/* Cột 3: Token */}
						<div className="text-white text-sm flex gap-1 justify-center ">
							<span className="font-medium">Token: </span>{' '}
							<span>
								{' '}
								{projectType === 'launchpad' ? (
									<>{project.launchpad_token || '--'}</>
								) : (
									<>{project.charity_token_symbol || '--'}</>
								)}
							</span>
						</div>
						{/* Cột 4: Total Invested/Donation */}
						<div className="text-white text-sm">
							<span className="font-medium">
								{projectType === 'launchpad'
									? 'Total Invested:'
									: 'Total Donated:'}
							</span>{' '}
							{projectType === 'launchpad'
								? `${convertNumToOffChainFormat(
										(project.totalAmount ?? 0).toString(),
										18
									)}
						${project.launchpad_token || ''}`
								: `${(project.totalDonationAmount ?? 0).toFixed(2)} ${project.charity_token_symbol || ''}`}
						</div>

						{/* <div className="text-white text-sm">
							<span className="font-medium">Total Invested:</span>{' '}
							{typeof project.totalInvest === 'number'
								? project.totalInvest.toLocaleString()
								: '--'}
							000 {''}
							{project.launchpad_token}
						</div> */}
						{/* Cột 5: Ends In */}
						<div className="text-white text-sm">
							<span className="font-medium">Ends In:</span>{' '}
							{showCountdown && countdowns[project.id || '']
								? countdowns[project.id || '']
								: '--'}
						</div>
						{/* Cột 6:  Button */}
						<div className="flex justify-end gap-4">
							{handlePublish &&
								(projectType === 'launchpad'
									? project.status_launchpad === 'approve'
									: project.status_charity === 'approve') && (
									<Button
										onClick={() => handlePublish(project)}
										className="bg-white transition-all duration-300 ease-in-out 
					hover:opacity-80 hover:shadow-lg hover:scale-105 
					active:scale-95 active:opacity-90 items-center px-3 py-2 h-auto border-border/50 hover:border-border"
									>
										<span className="text-gradient">Publish</span>
									</Button>
								)}
							{onWithdraw /*&& project.status_launchpad === 'approve'*/ && (
								<Button
									onClick={() => onWithdraw(project.id || '')}
									className="relative bg-gradient text-white py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 w-auto"
								>
									Withdraw
								</Button>
							)}
							{onEdit && (
								<Button
									onClick={() => onEdit(project.id || '')}
									className=" bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 w-auto"
								>
									Edit
								</Button>
							)}
						</div>
					</motion.div>
				))}
			</div>

			{/* Light effect */}
			{/* <motion.div
				className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none z-10"
				style={{
					x: smoothX,
					y: smoothY,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/> */}
		</section>
	)
}

export default ProjectSection
