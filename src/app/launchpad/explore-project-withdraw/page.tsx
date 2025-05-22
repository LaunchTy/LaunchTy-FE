'use client'
import React, { useState } from 'react'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectSectionWithdraw from '@/components/Launchpad/Explore-section/ProjectSectionWithdraw'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import Button from '@/components/UI/button/Button'
import ExploreProjectWithdraw from '@/public/ExploreProjectWithdraw.svg'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'

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
		amount: '10000',
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
		amount: '10000',
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
		endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		amount: '10000', // 24 hours ago
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
		endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
		amount: '10000', // 36 hours from now
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
		amount: '10000',
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
		amount: '10000',
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

	const filteredProjects = projects.filter((project) => {
		if (activeTab === 'all') return true
		return project.status === activeTab
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
