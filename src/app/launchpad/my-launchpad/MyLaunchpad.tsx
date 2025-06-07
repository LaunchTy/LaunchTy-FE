'use client'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject' // Adjust the import path as necessary
import Tab from '@/components/Launchpad/Explore-section/Tab' // Adjust the import path as necessary
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard' // Adjust the import path as necessary
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'
import { BaseProject, Launchpad } from '@/interface/interface'
import YourProject from '@/public/YourProject.svg' // Adjust the import path as necessary
import axios from 'axios' // Adjust the import path as necessary
import { useEffect, useState } from 'react' // Adjust the import path as necessary
import { useAccount } from 'wagmi'

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
		launchpad_token: launchpad.launchpad_token,
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

const MyProject = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)
	const [projects, setProjects] = useState<BaseProject[]>([])
	const [loading, setLoading] = useState(true)
	const [lockOpen, setLockOpen] = useState(false)

	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	const { address } = useAccount()

	useEffect(() => {
		if (!address) {
			setLockOpen(true)
		} else {
			setLockOpen(false)
		}

		const fetchProjects = async () => {
			try {
				const response = await axios.post('/api/launchpad/my-launchpad', {
					wallet_address: address,
				})
				const launchpadsData: Launchpad[] = response.data.data
				const projectsData: BaseProject[] = launchpadsData.map(
					convertLaunchpadToProject
				)
				setProjects(projectsData)
			} catch (error: any) {
				console.error('Failed to load projects:', error)

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

		fetchProjects()
	}, [address])

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}

	const filteredProjects = projects.filter((project) => {
		if (activeTab === 'all') return true
		return project.status === activeTab
	})

	const visibleProjects = filteredProjects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length
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
						title="Your Projects"
						backgroundImage={YourProject}
						searchPlaceholder="Search projects..."
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
										'/api/launchpad/my-launchpad',
										{
											wallet_address: address,
										}
									)
									const launchpadsData: Launchpad[] = response.data.data
									const projectsData: BaseProject[] = launchpadsData.map(
										convertLaunchpadToProject
									)
									setProjects(projectsData)
								} catch (err: any) {
									setErrorCode(err?.response?.status?.toString() || '500')
									setErrorMessage(
										err?.response?.data?.message ||
											'Retry failed. Please try again later.'
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

export default MyProject
