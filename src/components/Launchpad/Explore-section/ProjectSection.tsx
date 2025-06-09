'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { BaseProject } from '@/interface/interface'
import { useRouter } from 'next/navigation'
import { convertNumToOffChainFormat } from '@/app/utils/decimal'

// interface Project {
// 	id: string
// 	title: string
// 	image: string
// 	logo: string
// 	price: string
// 	raiseGoal: string
// 	min: string
// 	max: string
// 	timeLeft?: string
// 	endTime?: string
// }

interface ProjectSectionProps {
	projects: BaseProject[]
	pricePerToken?: number
	className?: string
	showCountdown?: boolean
	countdownDuration?: number // in hours
}

const ProjectSection = ({
	projects,
	className = '',
	showCountdown = true,
	countdownDuration = 12,
	pricePerToken = 0,
}: ProjectSectionProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})
	const route = useRouter()
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

			if (diff <= 0) return '00:00:00'

			const hours = Math.floor(diff / (1000 * 60 * 60))
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diff % (1000 * 60)) / 1000)

			return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		}

		const updateCountdowns = () => {
			const newCountdowns: { [key: string]: string } = {}
			projects.forEach((project) => {
				if (project.endDate) {
					if (project.id) {
						newCountdowns[project.id] = calculateTimeLeft(project.endDate)
					}
				} else {
					// Fallback to countdownDuration if no endTime is provided
					const end = new Date()
					end.setHours(end.getHours() + countdownDuration)
					if (project.id) {
						newCountdowns[project.id] = calculateTimeLeft(end.toISOString())
					}
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

	return (
		<section
			ref={sectionRef}
			className={`py-5 px-10 font-exo relative overflow-hidden min-h-auto max-w-[1300px] ${className}`}
		>
			<div className="w-full flex flex-col items-center justify-center gap-10 z-20 relative ">
				<div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 ">
					{projects.map((project) => (
						<motion.div
							key={project.id}
							onClick={() => {
								if (project.id) {
									route.push(`/launchpad/launchpad-detail/${project.id}`)
								} else {
									console.error('Launchpad ID is not defined')
								}
							}}
							className="p-5 border border-gray-300 rounded-xl shadow-md glass-component-1 h-[500px] w-96 flex flex-col hover:scale-105 duration-300"
						>
							{/* Image Section */}
							<div className="relative w-full h-[240px] rounded-xl bg-white ">
								<div className="relative w-full h-[200px] overflow-hidden">
									<Image
										src={project.images?.[0] || '/default-image-path.jpg'}
										alt={project.name || 'Default Project Name'}
										fill
										className="w-full h-48 object-cover  rounded-tr-xl rounded-tl-xl "
									/>
								</div>
								{showCountdown && (
									<div className="shadow flex items-center justify-center pt-1">
										<span className="font-mono font-bold text-red-500 tracking-widest text-2xl">
											{project.id
												? countdowns[project.id] || '00:00:00'
												: '00:00:00'}
										</span>
									</div>
								)}
							</div>
							{/* Project Name and Logo */}
							<div className="flex items-start justify-between py-5 ">
								<div className="flex flex-col w-3/4">
									<h4
										className="text-lg font-bold mb-1 truncate"
										title={project.name}
									>
										{project.name}
									</h4>
									<div className="text-sm text-gray-400">
										Price project token =
										{convertNumToOffChainFormat(
											(project.pricePerToken ?? 0).toString(),
											18
										)}
									</div>
								</div>
								<div className="relative w-12 h-12 rounded-full overflow-hidden">
									<Image
										src="https://s3.coinmarketcap.com/static-gravity/image/fecbf806c893460cbc5241d4e902b039.png"
										alt="Project Logo"
										fill
										className="object-cover"
									/>
								</div>
							</div>

							<div className="w-full h-1	 bg-gray-200 rounded-full overflow-hidden my-2">
								<div className="h-full bg-gradient"></div>
							</div>

							{/* Funding Information */}
							<div className="grid grid-cols-2 gap-8 mt-4">
								{/* Left column: labels */}
								<div className="flex flex-col gap-4 text-right pr-2">
									<p className="text-sm text-start">Price:</p>
									<p className="text-sm text-start">Raise Goal:</p>
									<div className="flex justify-between text-sm">
										<span>Min:</span>
										<span className="text-gray-400">
											${project.min_stake || '0'}
										</span>
									</div>
								</div>
								{/* Right column: values */}
								<div className="flex flex-col gap-4 text-left pl-2">
									<p className="text-sm text-gray-400 text-end">
										${project.price || 0}
									</p>
									<p className="text-sm text-gray-400 text-end">
										${project.soft_cap || '0.00'}
									</p>
									<div className="flex justify-between text-sm">
										<span>Max:</span>
										<span className="text-gray-400">
											${project.max_stake || '0'}
										</span>
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
