'use client'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import exploreImage from '@/public/Explore.svg'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { charityDetail } from '@/constants/utils'
import { motion, AnimatePresence } from 'framer-motion'
import CharityCard from '@/components/charity/CharityCard'
import Button from '@/components/UI/button/Button'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import axios from 'axios'
import { BaseProject, Charity } from '@/interface/interface'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const convertCharityToProject = (charity: Charity): BaseProject => {
	const now = new Date()
	const startDate = new Date(charity.charity_start_date)
	const endDate = new Date(charity.charity_end_date)

	let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
	if (now < startDate) status = 'upcoming'
	else if (now >= startDate && now <= endDate) status = 'ongoing'

	return {
		id: charity.charity_id,
		name: charity.charity_name,
		shortDescription: charity.charity_short_des,
		longDescription: charity.charity_long_des,
		logo: charity.charity_logo,
		images:
			Array.isArray(charity.charity_img) && charity.charity_img.length > 0
				? charity.charity_img
				: ['/default-image.png'],
		startDate: charity.charity_start_date,
		endDate: charity.charity_end_date,
		facebook: charity.charity_fb,
		x: charity.charity_x,
		instagram: charity.charity_ig,
		website: charity.charity_website,
		whitepaper: charity.charity_whitepaper,
		type: 'charity',
		totalDonationAmount: charity.totalDonationAmount,
		status,
	}
}

const ExploreCharity = () => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)
	const [loading, setLoading] = useState(true)
	const [charity, setCharity] = useState<BaseProject[]>([])
	const [searchTerm, setSearchTerm] = useState('')

	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	const handleSearchChange = (searchTerm: string) => {
		setSearchTerm(searchTerm)
		setShowAll(false) // Reset show all when searching
	}

	const filteredProjects = charity.filter((project) => {
		// First filter by tab
		const tabFiltered = activeTab === 'all' ? true : project.status === activeTab
		
		// Then filter by search term
		const searchFiltered = searchTerm === '' || 
			project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.longDescription?.toLowerCase().includes(searchTerm.toLowerCase())
		
		return tabFiltered && searchFiltered
	})

	const displayedProjects = showAll
		? filteredProjects
		: filteredProjects.slice(0, 6)

	const hasMoreProjects = filteredProjects.length > 6

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(`/api/charity/explore-charity`)
				const charityData: Charity[] = response.data.data
				const projectsData: BaseProject[] = charityData.map(
					convertCharityToProject
				)
				setCharity(projectsData)
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
	}, [])
	return (
		<div className="flex flex-col justify-center items-center w-full gap-5 min-h-screen font-exo ">
			<AnimatedBlobs count={5} />
			{loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
					<div className="w-full">
						<ExploreProject
							title="Discover all projects"
							backgroundImage={exploreImage.src}
							searchPlaceholder="Search projects..."
							onSearchChange={handleSearchChange}
							initialSearchTerm={searchTerm}
							projectCount={filteredProjects.length}
							totalProjects={charity.length}
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
					<div className="max-w-[1300px] p-5">
						<AnimatePresence mode="wait">
							<div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 ">
								{displayedProjects.map((charity) => (
									<motion.div
										key={charity.id}
										variants={cardVariants}
										initial="hidden"
										animate="visible"
										exit="hidden"
										layout
										className="h-full hover:scale-105 duration-300 transition-transform"
									>
										<CharityCard charityDetail={charity} />
									</motion.div>
								))}
							</div>
						</AnimatePresence>
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
						<ApplySectionIcon
							titleLine1="LaunchTy Charity"
							titleLine2=""
							subtitle="Help build a better world by supporting these amazing charities. 100% of donations are sent directly to your charity of choice!"
							buttonText="Add Project"
							onButtonClick={() => router.push('/charity/create-charity')}
						/>
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
							const response = await axios.get(`/api/charity/explore-charity`)
							const charityData: Charity[] = response.data.data
							const projectsData: BaseProject[] = charityData.map(
								convertCharityToProject
							)
							setCharity(projectsData)
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

export default ExploreCharity
