'use client'
import React, { useState, useEffect } from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectSection from '@/components/Launchpad/Explore-section/ProjectSection'
import Button from '@/components/UI/button/Button'
import ApplySection from '@/components/Launchpad/Explore-section/ApplySection'
import exploreImage from '@/public/Explore.svg'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import axios from 'axios'
import { BaseProject, Launchpad } from '@/interface/interface'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const convertLaunchpadToProject = (launchpad: Launchpad): BaseProject => {
	const now = new Date()
	const startDate = new Date(launchpad.launchpad_start_date)
	const endDate = new Date(launchpad.launchpad_end_date)
	let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
	if (now < startDate) status = 'upcoming'
	else if (now >= startDate && now <= endDate) status = 'ongoing'

	return {
		id: launchpad.launchpad_id,
		name: launchpad.launchpad_name,
		shortDescription: launchpad.launchpad_short_des,
		longDescription: launchpad.launchpad_long_des,
		logo: launchpad.launchpad_logo,
		images:
			launchpad.launchpad_img.length > 0
				? launchpad.launchpad_img
				: ['/default-image.png'],
		startDate: launchpad.launchpad_start_date,
		endDate: launchpad.launchpad_end_date,
		facebook: launchpad.launchpad_fb,
		x: launchpad.launchpad_x,
		instagram: launchpad.launchpad_ig,
		website: launchpad.launchpad_website,
		whitepaper: launchpad.launchpad_whitepaper,
		type: 'launchpad',
		status,
	}
}

const ExploreProjectPage = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)
	const [loading, setLoading] = useState(true)
	const [launchpads, setLaunchpads] = useState<BaseProject[]>([])

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(`/api/launchpad/explore-launchpad`)
				const launchpadsData: Launchpad[] = response.data.data
				const projectsData: BaseProject[] = launchpadsData.map(
					convertLaunchpadToProject
				)
				setLaunchpads(projectsData)
				console.log('Fetched projects:', projectsData)
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [])

	const filteredProjects = launchpads.filter((project) => {
		if (activeTab === 'all') return true
		return project.status === activeTab
	})

	const displayedProjects = showAll
		? filteredProjects
		: filteredProjects.slice(0, 6)
	const hasMoreProjects = filteredProjects.length > 6

	return (
		<div className="min-h-screen font-exo relative">
			<AnimatedBlobs />
			<motion.div className="fixed w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none" />
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
