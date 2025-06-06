'use client'
import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import YourProject from '@/public/YourProject.svg'
import Button from '@/components/UI/button/Button'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Charity } from '@/interface/interface'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const MyCharity = () => {
	const wallet_address = useAccount()
	const params = useParams()
	const project_owner_id = params['project-owner-id']
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)
	const [projects, setProjects] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(
					`/api/charity/my-charity?project_owner_id=${project_owner_id}`
				)
				// Transform charity data to match ProjectRowCard format
				const transformedProjects = response.data.data.map((charity: Charity) => ({
					id: charity.charity_id,
					title: charity.charity_name,
					image: charity.charity_logo,
					shortDescription: charity.charity_short_des,
					tokenSymbol: charity.charity_token_symbol,
					totalInvest: charity.totalDonationAmount || 0,
					endTime: charity.charity_end_date
				}))
				setProjects(transformedProjects)
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [project_owner_id])

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}

	const visibleProjects = projects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen font-exo">
			<ExploreProject
				title="Your Charities"
				backgroundImage={YourProject}
				searchPlaceholder="Search charities..."
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
					console.log('Edit charity:', projectId)
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

export default MyCharity 