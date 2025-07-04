'use client'
import React, { useState } from 'react'
import SplitText from '@/components/UI/text-effect/SplitText'
import LeftNavBar from '@/components/admin/LeftNavBar'
import LaunchpadList from '@/components/admin/LaunchpadList'
import CharityList from '@/components/admin/CharityList'
import LockModal from '@/components/UI/modal/LockModal'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { useEffect } from 'react'
import CardWithChart from '@/components/admin/CardWithChart'
import UserCard from '@/components/admin/UserCard'
import ProjectEvidenceCard from '@/components/admin/ProjectEvidenceCard'
import EvidenceDetailModal from '@/components/admin/EvidenceDetailModal'
import Button from '@/components/UI/button/Button'
import ProjectProfitCard from '@/components/admin/ProjectProfitCard'
import { useRouter } from 'next/navigation'
import LoadingModal from '@/components/UI/modal/LoadingModal'

const AdminDashboard = () => {
	const [activeMenu, setActiveMenu] = useState('dashboard')
	const { address, isConnected } = useAccount()
	const [isAdmin, setIsAdmin] = useState(false)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const [evidenceProjects, setEvidenceProjects] = useState([])
	const initialVisible = 5
	const [visibleCountEvidence, setVisibleCountEvidence] =
		useState(initialVisible)
	const [visibleCountProfit, setVisibleCountProfit] = useState(initialVisible)

	const [profitProjects, setProfitProjects] = useState<Project[]>([])
	const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null)
	const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)
	const [isLoadingData, setIsLoadingData] = useState(false)
	const [dashboardStats, setDashboardStats] = useState({
		launchpads: { pending: 0, approved: 0, denied: 0, published: 0, total: 0 },
		charities: { pending: 0, approved: 0, denied: 0, published: 0, total: 0 },
		users: { total: 0, launchpadUsers: 0, charityUsers: 0 }
	})

	const visibleEvidenceProjects = evidenceProjects.slice(
		0,
		visibleCountEvidence
	)
	const hasMoreEvidence = evidenceProjects.length > visibleCountEvidence

	const visibleProfitProjects = profitProjects.slice(0, visibleCountProfit)
	const hasMoreProfit = profitProjects.length > visibleCountProfit

	const handleViewEvidence = (charityId: string) => {
		setSelectedCharityId(charityId)
		setIsEvidenceModalOpen(true)
	}

	const handleEvidenceAction = () => {
		// Refresh the evidence projects list after an action
		const fetchEvidenceProjects = async () => {
			setIsLoadingData(true)
			try {
				const response = await axios.get(
					'/api/admin/dashboard/project-evidence'
				)
				setEvidenceProjects(response.data.projects)
			} catch (error) {
				console.error('Error loading evidence projects:', error)
			} finally {
				setIsLoadingData(false)
			}
		}
		fetchEvidenceProjects()
	}

	const handleDashboardClick = async () => {
		setIsLoadingData(true)
		try {
			// Fetch dashboard statistics
			const statsResponse = await axios.get('/api/admin/dashboard/statistics')
			console.log('Dashboard statistics response:', statsResponse.data)
			setDashboardStats(statsResponse.data.data)
			
			// Fetch evidence projects
			const evidenceResponse = await axios.get(
				'/api/admin/dashboard/project-evidence'
			)
			console.log('Dashboard evidence projects response:', evidenceResponse.data)
			setEvidenceProjects(evidenceResponse.data.projects)
			
			// Fetch profit projects
			const profitResponse = await axios.get(
				'/api/admin/dashboard/project-profit'
			)
			console.log('Dashboard profit projects response:', profitResponse.data)
			setProfitProjects(profitResponse.data.projects)
		} catch (error) {
			console.error('Error fetching dashboard data:', error)
		} finally {
			setIsLoadingData(false)
		}
	}

	const handleLaunchpadClick = async () => {
		setIsLoadingData(true)
		try {
			// Fetch launchpad data
			const response = await axios.get('/api/admin/launchpad')
			console.log('Launchpad data response:', response.data)
			// You can add state for launchpad data here if needed
		} catch (error) {
			console.error('Error fetching launchpad data:', error)
		} finally {
			setIsLoadingData(false)
		}
	}

	const handleCharityClick = async () => {
		setIsLoadingData(true)
		try {
			// Fetch charity data
			const response = await axios.get('/api/admin/charity')
			console.log('Charity data response:', response.data)
			// You can add state for charity data here if needed
		} catch (error) {
			console.error('Error fetching charity data:', error)
		} finally {
			setIsLoadingData(false)
		}
	}

	type Project = {
		id: string
		title: string
		image: string
		shortDescription: string
		tokenSymbol: string
		endsInDays?: number
		endTime?: string
		profit: number
	}

	useEffect(() => {
		const checkAdmin = async () => {
			if (!isConnected || !address) {
				setIsAdmin(false)
				setLoading(false)
				return
			}

			try {
				const res = await axios.get(`/api/admin/check-admin?address=${address}`)
				setIsAdmin(res.data.isAdmin)
			} catch (err) {
				console.error('Failed to check admin:', err)
				setIsAdmin(false)
			} finally {
				setLoading(false)
			}
		}

		checkAdmin()
	}, [address, isConnected])

	useEffect(() => {
		const fetchEvidenceProjects = async () => {
			setIsLoadingData(true)
			try {
				const response = await axios.get(
					'/api/admin/dashboard/project-evidence'
				)
				console.log('Evidence projects response:', response.data)
				setEvidenceProjects(response.data.projects)
			} catch (error) {
				console.error('Error loading evidence projects:', error)
			} finally {
				setIsLoadingData(false)
			}
		}

		fetchEvidenceProjects()
	}, [])

	useEffect(() => {
		const fetchProfitProjects = async () => {
			setIsLoadingData(true)
			try {
				const res = await axios.get('/api/admin/dashboard/project-profit')
				console.log('Profit projects response:', res.data)
				setProfitProjects(res.data.projects)
			} catch (err) {
				console.error('Failed to load profit projects:', err)
			} finally {
				setIsLoadingData(false)
			}
		}

		fetchProfitProjects()
	}, [])

	useEffect(() => {
		const fetchDashboardStats = async () => {
			setIsLoadingData(true)
			try {
				const response = await axios.get('/api/admin/dashboard/statistics')
				console.log('Dashboard stats response:', response.data)
				setDashboardStats(response.data.data)
			} catch (error) {
				console.error('Error loading dashboard statistics:', error)
			} finally {
				setIsLoadingData(false)
			}
		}

		fetchDashboardStats()
	}, [])

	if (loading) return <LoadingModal open={loading} onOpenChange={setLoading} />

	if (!isConnected || !isAdmin) {
		return (
			<LockModal
				open={true}
				title="Restricted Access"
				description="Only admin wallets can view this page."
				message="Please connect with an admin wallet to access the dashboard."
				showUnlockButton={false}
				canClose={false}
			/>
		)
	}
	return (
		<div className="min-h-screen font-exo w-full">
			<div className="text-center z-20 pt-40">
				<SplitText
					text="Admin Page"
					className="text-[64px] font-bold text-white"
					delay={70}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="text-center z-20 pt-5 px-56">
				<SplitText
					text="Approve the Project if the charity provides clear and verifiable information about its purpose, ensuring transparency and credibility. Additionally, the fundraising goal and allocation of funds should be explicitly stated to guarantee proper use of donations."
					className="text-sm text-white"
					delay={2}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="flex flex-row py-10 w-full gap-10">
				<div className="pl-20 h-full flex flex-col sticky top-6">
					<LeftNavBar
						activeMenu={activeMenu}
						setActiveMenu={(menu) => {
							setActiveMenu(menu)
							if (menu === 'dashboard') {
								handleDashboardClick()
							} else if (menu === 'launchpad') {
								handleLaunchpadClick()
							} else if (menu === 'charity') {
								handleCharityClick()
							}
						}}
					/>
				</div>
				
				{/* Content Area */}
				<div className="flex flex-col gap-6 w-full pr-20">
					{activeMenu === 'launchpad' && (
						<div className="flex flex-col gap-6">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-white mb-4">Launchpad Management</h2>
								<p className="text-gray-300">Manage launchpad projects and approvals</p>
							</div>
							<LaunchpadList />
						</div>
					)}
					{activeMenu === 'charity' && (
						<div className="flex flex-col gap-6">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-white mb-4">Charity Management</h2>
								<p className="text-gray-300">Manage charity projects and approvals</p>
							</div>
							<CharityList />
						</div>
					)}
					{activeMenu === 'dashboard' && (
						<>
							<div className="flex flex-1 gap-6">
								{/* Launchpad & Charity cards */}
								<div className="flex gap-6 w-2/3">
									<CardWithChart
										title="Launchpads"
										count={dashboardStats.launchpads.total}
										chartColors={['#FF9800', '#4CAF50', '#FFA726', '#2196F3']}
										legend={[
											{ label: 'Pending', color: '#FF9800', value: dashboardStats.launchpads.pending },
											{ label: 'Approved', color: '#4CAF50', value: dashboardStats.launchpads.approved },
											{ label: 'Denied', color: '#FFA726', value: dashboardStats.launchpads.denied },
											{ label: 'Published', color: '#2196F3', value: dashboardStats.launchpads.published },
										]}
									/>
									<CardWithChart
										title="Charities"
										count={dashboardStats.charities.total}
										chartColors={['#D946EF', '#10B981', '#F0ABFC', '#3B82F6']}
										legend={[
											{ label: 'Pending', color: '#D946EF', value: dashboardStats.charities.pending },
											{ label: 'Approved', color: '#10B981', value: dashboardStats.charities.approved },
											{ label: 'Denied', color: '#F0ABFC', value: dashboardStats.charities.denied },
											{ label: 'Published', color: '#3B82F6', value: dashboardStats.charities.published },
										]}
									/>
								</div>

								{/* User cards */}
								<div className="flex flex-col gap-3 w-1/3 pr-20">
									<UserCard title="Launchpad users" count={dashboardStats.users.launchpadUsers} />
									<UserCard title="Charity users" count={dashboardStats.users.charityUsers} />
								</div>
							</div>

							<div className="flex flex-1 gap-6 w-full pr-20">
								<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full h-full gap-3">
									<div className="flex flex-col">
										<div className="flex flex-row justify-between items-center p-3 px-6">
											<h2 className="text-lg font-semibold text-white">
												Evidences
											</h2>
											{hasMoreEvidence && (
												<Button
													className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[...]"
													onClick={() =>
														setVisibleCountEvidence((prev) => prev + 5)
													}
												>
													More
												</Button>
											)}
										</div>
										<div className="flex flex-col w-full px-6">
											<ProjectEvidenceCard
												adminprojects={visibleEvidenceProjects}
												showCountdown={true}
												path="/charity/"
												onEdit={(projectId) => {
													console.log(`Edit project ${projectId}`)
												}}
												onView={handleViewEvidence}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-1 gap-6 w-full pr-20">
								<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full h-full gap-3">
									<div className="flex flex-col">
										<div className="flex flex-row justify-between items-center p-3 px-6">
											<h2 className="text-lg font-semibold text-white">Profit</h2>
											{hasMoreProfit && (
												<Button
													className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[...]"
													onClick={() => setVisibleCountProfit((prev) => prev + 5)}
												>
													More
												</Button>
											)}
										</div>
										<div className="flex flex-col w-full px-6">
											<ProjectProfitCard
												adminprojects={visibleProfitProjects}
												path="/admin/project"
												onEdit={(projectId, action) => {
													console.log(`${action} project ${projectId}`)
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			
			{/* Evidence Detail Modal */}
			{selectedCharityId && (
				<EvidenceDetailModal
					isOpen={isEvidenceModalOpen}
					onClose={() => {
						setIsEvidenceModalOpen(false)
						setSelectedCharityId(null)
					}}
					charityId={selectedCharityId}
					onEvidenceAction={handleEvidenceAction}
				/>
			)}

			{/* Loading Modal for Data Fetching */}
			<LoadingModal open={isLoadingData} onOpenChange={setIsLoadingData} />
		</div>
	)
}

export default AdminDashboard
