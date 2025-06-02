'use client'
import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject' // Adjust the import path as necessary
import YourProject from '@/public/YourProject.svg' // Adjust the import path as necessary
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import Tab from '@/components/Launchpad/Explore-section/Tab' // Adjust the import path as necessary
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard' // Adjust the import path as necessary
import { useState } from 'react' // Adjust the import path as necessary
import Myproject from '@/public/MyProject.svg' // Adjust the import path as necessary
import { useEffect } from 'react' // Adjust the import path as necessary
import axios from 'axios' // Adjust the import path as necessary

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const MyProject = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)
	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Load data from API
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get('/api/launchpad/my-launchpad')
				setProjects(response.data.data)
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [])
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
				projects={visibleProjects}
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
