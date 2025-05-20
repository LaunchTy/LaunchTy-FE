'use client'
import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject' // Adjust the import path as necessary
import YourProject from '@/public/YourProject.svg' // Adjust the import path as necessary
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import Tab from '@/components/Launchpad/Explore-section/Tab' // Adjust the import path as necessary
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard' // Adjust the import path as necessary
import { useState } from 'react' // Adjust the import path as necessary
import Myproject from '@/public/MyProject.svg' // Adjust the import path as necessary

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const projects = [
	{
		id: '1',
		title: 'Name 1',
		image: Myproject,
		shortDescription: 'Short description 1',
		tokenSymbol: 'BNB',
		totalInvest: 692.182,
		endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '2',
		title: 'Name 2',
		image: Myproject,
		shortDescription: 'Short description 2',
		tokenSymbol: 'BNB',
		totalInvest: 123.456,
		endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '3',
		title: 'Name 3',
		image: Myproject,
		shortDescription: 'Short description 3',
		tokenSymbol: 'BNB',
		totalInvest: 789.101,
		endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '4',
		title: 'Name 4',
		image: Myproject,
		shortDescription: 'Short description 4',
		tokenSymbol: 'BNB',
		totalInvest: 250.789,
		endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '5',
		title: 'Name 5',
		image: Myproject,
		shortDescription: 'Short description 5',
		tokenSymbol: 'BNB',
		totalInvest: 321.123,
		endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '6',
		title: 'Name 6',
		image: Myproject,
		shortDescription: 'Short description 6',
		tokenSymbol: 'BNB',
		totalInvest: 654.987,
		endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '7',
		title: 'Name 7',
		image: Myproject,
		shortDescription: 'Short description 7',
		tokenSymbol: 'BNB',
		totalInvest: 111.222,
		endTime: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
	},
	// Add more if needed
]

const MyProject = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}

	const visibleProjects = projects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length
	return (
		<div className="min-h-screen font-exo">
			<ExploreProject
				title="Your Projects"
				backgroundImage={YourProject} // Use the imported image source
				searchPlaceholder="Search projects..." // optional
			/>
			<Tab
				navItems={navItems}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>
			<ProjectRowCard
				projects={visibleProjects} // ✅ truyền đúng số lượng cần hiển thị
				showCountdown={true}
				countdownDuration={24}
				className="custom-class"
				onEdit={(projectId) => {
					console.log('Edit project:', projectId)
				}}
			/>

			{hasMore && (
				<div className="align-center flex flex-col justify-center items-center p-8">
					<Button
						onClick={handleShowMore}
						className="font-bold bg-gradient text-white px-9 py-2.5 hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
					>
						Show more
					</Button>
				</div>
			)}
		</div>
	)
}

export default MyProject
