'use client'

import React, { useState, useEffect } from 'react'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectSectionWithdraw from '@/components/Launchpad/Explore-section/ProjectSectionWithdraw'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import Button from '@/components/UI/button/Button'
import ExploreProjectWithdraw from '@/public/ExploreProjectWithdraw.svg'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import axios from 'axios'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const ExploreProjectPage = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)
	// Update Project type to match the one expected by ProjectSectionWithdraw
	type Project = {
		id: string
		title: string
		image: string
		logo: string
		price: string
		raiseGoal: string
		min: string
		max: string
		launchpad_start_date?: string
		launchpad_end_date?: string
		[key: string]: any
	}
	const [projects, setProjects] = useState<Project[]>([])
	const [loading, setLoading] = useState(false)

	// const { address: walletAddress } = useAccount()
	const params = useParams()
	const account = useAccount()

	useEffect(() => {
		console.log('Fetching projects for wallet:', account.address)
		const fetchProjects = async () => {
			if (!account.address) return
			try {
				const response = await axios.post(
					`/api/launchpad/explore-launchpad-withdraw`,
					{ wallet_address: account.address }
				)

				const mappedProjects = (response.data.data || []).map((item: any) => ({
					id: item.id,
					title: item.title || 'Untitled',
					image: item.image || '/default-image.jpg',
					logo: item.logo || '/default-logo.png',
					price: item.price || '0.00',
					raiseGoal: item.raiseGoal || '0',
					min: item.min || '0',
					max: item.max || '0',
					amount: item.amount || '0',
					endTime: item.endTime || item.launchpad_end_date || '',
					launchpad_start_date: item.launchpad_start_date || '',
					launchpad_end_date: item.launchpad_end_date || '',
					wallet_address: account.address,
				}))

				setProjects(mappedProjects)
			} catch (err) {
				console.error('Failed to fetch deposited projects:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [account.address])

	const getStatus = (project: Project): 'upcoming' | 'ongoing' | 'finished' => {
		const start = project.launchpad_start_date
			? new Date(project.launchpad_start_date)
			: null
		const end = project.launchpad_end_date
			? new Date(project.launchpad_end_date)
			: null
		const now = new Date()

		if (!start || !end || now < start) return 'upcoming'
		if (now >= start && now <= end) return 'ongoing'
		return 'finished'
	}

	// Sau đó filter dựa theo status
	const filteredProjects = projects.filter((project) => {
		if (activeTab === 'all') return true
		return getStatus(project) === activeTab
	})

	const displayedProjects = showAll
		? filteredProjects
		: filteredProjects.slice(0, 6)
	const hasMoreProjects = filteredProjects.length > 6

	return (
		<div className="min-h-screen font-exo">
			<ExploreProject
				title="Explore Projects"
				backgroundImage={ExploreProjectWithdraw.src}
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
			<ProjectSectionWithdraw
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
			<ApplySectionIcon
				titleLine1="Apply for project"
				titleLine2="incubation"
				subtitle="If you want to start your project, it will be your perfect choice"
				buttonText="Add Project"
				onButtonClick={() => {}}
			/>
		</div>
	)
}

export default ExploreProjectPage
