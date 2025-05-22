'use client'
import React, { useState, useEffect } from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectSection from '@/components/Launchpad/Explore-section/ProjectSection'
import Button from '@/components/UI/button/Button'
import ApplySection from '@/components/Launchpad/Explore-section/ApplySection'
import exploreImage from '@/public/Explore.svg'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const projects = [
	{
		id: '1',
		title: 'Project 1',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'ongoing',
		endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
	},
	{
		id: '2',
		title: 'Project 2',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'upcoming',
		endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
	},
	{
		id: '3',
		title: 'Project 3',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'finished',
		endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
	},
	{
		id: '4',
		title: 'Project 4',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'ongoing',
		endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours from now
	},
	{
		id: '5',
		title: 'Project 5',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'upcoming',
		endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
	},
	{
		id: '6',
		title: 'Project 6',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'ongoing',
		endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
	},
	{
		id: '7',
		title: 'Project 7',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'finished',
		endTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
	},
	{
		id: '8',
		title: 'Project 8',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'upcoming',
		endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
	},
	{
		id: '9',
		title: 'Project 9',
		image: '/Project.png',
		logo: '/ProjectLogo.png',
		price: '100',
		raiseGoal: '1000000',
		min: '100',
		max: '1000',
		timeLeft: '12:00:00',
		status: 'ongoing',
		endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
	},
]

const ExploreProjectPage = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)
	const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 })
	const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX)
			mouseY.set(e.clientY)
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	const filteredProjects = projects.filter((project) => {
		if (activeTab === 'all') return true
		return project.status === activeTab
	})

	const displayedProjects = showAll
		? filteredProjects
		: filteredProjects.slice(0, 6)
	const hasMoreProjects = filteredProjects.length > 6

	return (
		<div className="min-h-screen font-exo relative">
			<motion.div
				className="fixed w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none"
				style={{
					x: smoothX,
					y: smoothY,
					translateX: '-50%',
					translateY: '-50%',
					zIndex: 50,
				}}
			/>
			<div className="relative z-20">
				<ExploreProject
					title="Explore Projects"
					backgroundImage={exploreImage.src}
					searchPlaceholder="Search projects..."
				/>
				<Tab
					navItems={navItems}
					activeTab={activeTab}
					onTabChange={(tab) => {
						setActiveTab(tab)
						setShowAll(false)
					}}
				/>
				<ProjectSection
					projects={displayedProjects}
					showCountdown={true}
					countdownDuration={24}
					className="custom-class pb-12"
				/>
				{hasMoreProjects && !showAll && (
					<div className="flex justify-center my-10">
						<Button
							className="bg-gradient text-white px-[5rem] py-3 rounded-full hover:opacity-90 transition-all duration-300"
							onClick={() => setShowAll(true)}
						>
							Show More
						</Button>
					</div>
				)}
				<ApplySection />
			</div>
		</div>
	)
}

export default ExploreProjectPage
