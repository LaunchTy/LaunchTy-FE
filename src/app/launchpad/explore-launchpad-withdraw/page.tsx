'use client'

import React, { useState, useEffect } from 'react'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectSectionWithdraw from '@/components/Launchpad/Explore-section/ProjectSectionWithdraw'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import Button from '@/components/UI/button/Button'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'
import ExploreProjectWithdraw from '@/public/ExploreProjectWithdraw.svg'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'
import { BaseProject, Launchpad } from '@/interface/interface'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import axios from 'axios'
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
		// shortDescription: launchpad.launchpad_short_des,
		// longDescription: launchpad.launchpad_long_des,
		launchpad_token: launchpad.launchpad_token,
		logo: launchpad.launchpad_logo,
		images:
			launchpad.launchpad_img.length > 0
				? launchpad.launchpad_img
				: ['/default-image.png'],
		startDate: launchpad.launchpad_start_date,
		endDate: launchpad.launchpad_end_date,
		// facebook: launchpad.launchpad_fb,
		// x: launchpad.launchpad_x,
		// instagram: launchpad.launchpad_ig,
		// website: launchpad.launchpad_website,
		// whitepaper: launchpad.launchpad_whitepaper,
		min_stake: launchpad.min_stake,
		max_stake: launchpad.max_stake,
		soft_cap: launchpad.soft_cap,
		price: launchpad.price,
		type: 'launchpad',
		status,
	}
}

const ExploreProjectPage = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)
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
	const [projects, setProjects] = useState<BaseProject[]>([])
	const [loading, setLoading] = useState(false)
	const [lockOpen, setLockOpen] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const params = useParams()
	const account = useAccount()

	const fetchProjects = async () => {
		if (!account.address) return
		setLoading(true)
		try {
			const response = await axios.post(
				`/api/launchpad/explore-launchpad-withdraw`,
				{ wallet_address: account.address }
			)
			console.log('Response data:', response.data)

			// const mappedProjects = (response.data.data || []).map((item: BaseProject) => ({
			// 	id: item.id,
			// 	title: item.name || 'Untitled',
			// 	image: item.images || '/default-image.jpg',
			// 	logo: item.logo || '/default-logo.png',
			// 	price: item. || '0.00',
			// 	raiseGoal: item.raiseGoal || '0',
			// 	min: item.min || '0',
			// 	max: item.max || '0',
			// 	amount: item.amount || '0',
			// 	endTime: item.endTime || item.launchpad_end_date || '',
			// 	launchpad_start_date: item.launchpad_start_date || '',
			// 	launchpad_end_date: item.launchpad_end_date || '',
			// 	wallet_address: account.address,
			// }))
			const launchpadsData: Launchpad[] = response.data.data
			console.log('Launchpads data:', launchpadsData)
			const projectsData: BaseProject[] = launchpadsData.map(
				convertLaunchpadToProject
			)
			// console.log('Mapped projects:', mappedProjects)
			console.log('Projects data:', projectsData)
			setProjects(projectsData)

			// setProjects(mappedProjects)
		} catch (error: any) {
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(
				error?.response?.data?.message ||
					'Something went wrong while fetching your projects.'
			)
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!account.address) {
			setLockOpen(true)
			return
		}
		setLockOpen(false)
		fetchProjects()
	}, [account.address])

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
			<AnimatedBlobs count={6} />
			{lockOpen ? (
				<LockModal
					open={lockOpen}
					onUnlock={() => setLockOpen(false)}
					canClose={true}
					message="Please connect your wallet to view your projects."
				/>
			) : loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
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
					<ErrorModal
						open={errorModalOpen}
						onOpenChange={setErrorModalOpen}
						errorCode={errorCode}
						errorMessage={errorMessage}
						onRetry={() => {
							setErrorModalOpen(false)
							setLoading(true)
							// gọi lại API
							const refetch = async () => {
								try {
									const response = await axios.post(
										`/api/launchpad/explore-launchpad-withdraw`,
										{ wallet_address: account.address }
									)

									const mappedProjects = (response.data.data || []).map(
										(item: any) => ({
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
										})
									)

									setProjects(mappedProjects)
								} catch (error: any) {
									setErrorCode(error?.response?.status?.toString() || '500')
									setErrorMessage(
										error?.response?.data?.message ||
											'Something went wrong while fetching your projects.'
									)
									setErrorModalOpen(true)
								} finally {
									setLoading(false)
								}
							}
							refetch()
						}}
					/>
				</>
			)}
		</div>
	)
}

export default ExploreProjectPage
