'use client'
import React, { useState } from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import NavBar from '@/components/Launchpad/Explore-section/NavBar'
import ProjectSection from '@/components/Launchpad/Explore-section/ProjectSection'
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
	  timeLeft: '12:00:00' // optional
	},
	// ... more projects
  ]
const ExploreProjectPage = () => {
	const [activeTab, setActiveTab] = useState('all')
	return (
		<div className="min-h-screen font-exo">
			<ExploreProject 
			title="Explore Projects"
			backgroundImage="/Explore.svg"
			searchPlaceholder="Search projects..." // optional
			/>
			<NavBar
			navItems={navItems}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			/>
			<ProjectSection 
			projects={projects}
			showCountdown={true}
			countdownDuration={24} // optional, defaults to 12 hours
			className="custom-class" // optional
			/>
		</div>
	)
}

export default ExploreProjectPage
