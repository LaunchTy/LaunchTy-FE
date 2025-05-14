'use client'
import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject' // Adjust the import path as necessary
import YourProject from '@/public/YourProject.svg' // Adjust the import path as necessary
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import NavBar from '@/components/Launchpad/Explore-section/NavBar' // Adjust the import path as necessary
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard' // Adjust the import path as necessary
import { useState } from 'react' // Adjust the import path as necessary

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
		timeLeft: '12:00:00', // optional
	},
	// ... more projects
]

const MyProject = () => {
	const [activeTab, setActiveTab] = useState('all')
	return (
		<div className="min-h-screen font-exo">
			<ExploreProject
				title="Your Projects"
				backgroundImage={YourProject} // Use the imported image source
				searchPlaceholder="Search projects..." // optional
			/>
			<NavBar
				navItems={navItems}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>
			<ProjectRowCard
				projects={projects}
				showCountdown={true}
				countdownDuration={24} // optional, defaults to 12 hours
				className="custom-class" // optional /
			/>

			<div className="align-center flex flex-col justify-center items-center mt-10">
				<Button className="font-bold hidden lg:block bg-gradient text-white px-4 sm:px-5 py-2 hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300 text-sm sm:text-md">
					Show more
				</Button>
			</div>
		</div>
	)
}

export default MyProject
