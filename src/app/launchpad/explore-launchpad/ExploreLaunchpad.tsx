'use client'
import { LaunchpadABI } from '@/app/abi'
import ApplySection from '@/components/Launchpad/Explore-section/ApplySection'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import ProjectSection from '@/components/Launchpad/Explore-section/ProjectSection'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import { BaseProject, Launchpad } from '@/interface/interface'
import { config } from '@/provider/provider'
import exploreImage from '@/public/Explore.svg'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { readContract } from 'wagmi/actions'
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
		min_stake: launchpad.min_stake,
		max_stake: launchpad.max_stake,
		price: launchpad.price,
		soft_cap: launchpad.soft_cap,
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
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const route = useRouter()

	const handleAddProject = () => {
		route.push('/launchpad/create-launchpad')
	}

	useEffect(() => {
		const fetchProjectsWithPrice = async () => {
			try {
				const response = await axios.get(`/api/launchpad/explore-launchpad`)
				const launchpadsData: Launchpad[] = response.data.data

				const projectsWithPrice = await Promise.all(
					launchpadsData.map(async (launchpad) => {
						const id = launchpad.launchpad_id
						console.log('Fetching data for ID:', id)

						try {
							const price = await readContract(config, {
								address: id as Address,
								abi: LaunchpadABI,
								functionName: 'getPricePerToken',
							})
							console.log('Price per token:', price)

							return {
								...convertLaunchpadToProject(launchpad),
								launchpadAddress: id as Address,
								pricePerToken: parseFloat((price as string).toString()),
							}
						} catch (err) {
							console.error(`Error fetching data for ID ${id}`, err)
							return {
								...convertLaunchpadToProject(launchpad),
								launchpadAddress: '0x0',
								pricePerToken: 0,
							}
						}
					})
				)

				setLaunchpads(projectsWithPrice)
			} catch (err: any) {
				console.error('Failed to load projects:', err)
				setErrorCode(err?.response?.status?.toString() || '500')
				setErrorMessage(
					err?.response?.data?.message ||
						'Failed to fetch projects. Please try again later.'
				)
				setErrorModalOpen(true)
			} finally {
				setLoading(false)
			}
		}

		fetchProjectsWithPrice()
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
		<div className="flex flex-col justify-center items-center w-full gap-5 min-h-screen font-exo ">
			<AnimatedBlobs />
			{/* <motion.div className="fixed w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none" /> */}
			{loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
					<div className="w-full">
						<ExploreProject
							title="Explore Projects"
							backgroundImage={exploreImage.src}
							searchPlaceholder="Search projects..."
						/>
					</div>
					<div className="w-full">
						<Tab
							navItems={navItems}
							activeTab={activeTab}
							onTabChange={(tab) => {
								setActiveTab(tab)
								setShowAll(false)
							}}
						/>
					</div>
					<div className="w-full flex items-center justify-center">
						<ProjectSection
							projects={displayedProjects}
							showCountdown={true}
							countdownDuration={24}
							// className="custom-class pb-12"
						/>
					</div>

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
					<div className="w-full">
						<ApplySection handleAddProject={handleAddProject} />
					</div>
				</>
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
					const fetchProjects = async () => {
						try {
							const response = await axios.get(
								`/api/launchpad/explore-launchpad`
							)
							const launchpadsData: Launchpad[] = response.data.data
							const projectsData: BaseProject[] = launchpadsData.map(
								convertLaunchpadToProject
							)
							setLaunchpads(projectsData)
							console.log('Fetched projects:', projectsData)
						} catch (err: any) {
							console.error('Failed to load projects:', err)
							setErrorCode(err?.response?.status?.toString() || '500')
							setErrorMessage(
								err?.response?.data?.message ||
									'Failed to fetch projects. Please try again later.'
							)
							setErrorModalOpen(true)
						} finally {
							setLoading(false)
						}
					}
					fetchProjects()
				}}
			/>
		</div>
	)
}

export default ExploreProjectPage
