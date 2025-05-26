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
import { useRouter } from 'next/navigation'
interface Project {
	id: string
	title: string
	image: string
	shortDescription: string
	tokenSymbol: string
	endsInDays?: number
	endTime?: string // Optional end time for countdown
}

interface AdminRowCardProps {
	adminprojects: Project[]
	className?: string
	onEdit?: (projectId: string, action: 'approve' | 'deny') => void
	showCountdown?: boolean
	countdownDuration?: number
	path?: string
}

const AdminRowCard = ({
	adminprojects,
	className = '',
	showCountdown = true,
	countdownDuration = 12,
	onEdit,
	path,
}: AdminRowCardProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})
	const router = useRouter()

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
			adminprojects.forEach((project) => {
				if (project.endTime) {
					newCountdowns[project.id] = calculateTimeLeft(project.endTime)
				} else {
					// Fallback to countdownDuration if no endTime is provided
					const end = new Date()
					end.setHours(end.getHours() + countdownDuration)
					newCountdowns[project.id] = calculateTimeLeft(end.toISOString())
				}
			})
			setCountdowns(newCountdowns)
		}

		// Initial update
		updateCountdowns()

		// Update every second
		const interval = setInterval(updateCountdowns, 1000)

		return () => clearInterval(interval)
	}, [showCountdown, countdownDuration, adminprojects])

	return (
		<section
			ref={sectionRef}
			className={`pr-20 font-exo relative overflow-hidden min-h-auto ${className}`}
		>
			<div className="flex flex-col gap-5 z-20 relative">
				{adminprojects.map((project, index) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
						className="relative z-20 px-6 py-[7px] border border-gray-300 shadow-md glass-component-2 rounded-[40px] flex items-center gap-4 cursor-pointer"
						onClick={() => router.push(`${path}/${project.id}`)}
					>
						{/* Project Image */}
						<div className="w-[60px] h-[60px] flex-shrink-0 rounded-full overflow-hidden">
							<Image
								src={project.image}
								alt={project.title}
								width={4000}
								height={4000}
								className="object-cover w-full h-full"
							/>
						</div>

						{/* Project Info Grid */}
						<div
							className="grid w-full items-center gap-6"
							style={{ gridTemplateColumns: '1fr 3fr' }}
						>
							{/* Tên + mô tả */}
							<div>
								<h2 className="text-lg font-semibold text-white">
									{project.title}
								</h2>
								<p className="text-white text-sm line-clamp-2">
									{project.shortDescription}
								</p>
							</div>

							<div className="grid grid-cols-3 gap-6 items-center">
								{/* Token */}
								<div className="text-white text-sm">
									<span className="font-medium">Token:</span>{' '}
									{project.tokenSymbol}
								</div>

								{/* Ends In */}
								<div className="text-white text-sm">
									<span className="font-medium">Ends In:</span>{' '}
									{showCountdown && countdowns[project.id]
										? countdowns[project.id]
										: '--'}
								</div>

								{/* Approve & Deny Buttons */}
								<div className="flex justify-end gap-4">
									{onEdit && (
										<>
											<Button
												onClick={() => onEdit?.(project.id, 'approve')}
												className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
											>
												Approve
											</Button>

											<Button
												onClick={() => onEdit?.(project.id, 'deny')}
												className="bg-red-600 text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
											>
												Deny
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	)
}

export default AdminRowCard
