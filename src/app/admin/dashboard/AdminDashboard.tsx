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
import NumberCard from '@/components/admin/CardWithNumber'
import ProjectEvidenceCard from '@/components/admin/ProjectEvidenceCard'
import EvidenceDetailModal from '@/components/admin/EvidenceDetailModal'
import Button from '@/components/UI/button/Button'
import ProjectProfitCard from '@/components/admin/ProjectProfitCard'
import { useRouter } from 'next/navigation'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import { Transaction } from '@/interface/interface'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TransactionTable from '@/components/admin/TransactionTable'

// Dynamic import to avoid SSR issues with ApexCharts
const DynamicCardWithChart = dynamic(
	() => import('@/components/admin/CardWithChart'),
	{
		ssr: false,
		loading: () => (
			<div className="animate-pulse bg-gray-700 rounded-lg h-32" />
		),
	}
)

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
	const [selectedCharityId, setSelectedCharityId] = useState<string | null>(
		null
	)
	const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)
	const [isLoadingData, setIsLoadingData] = useState(false)
	const [dashboardStats, setDashboardStats] = useState({
		launchpads: { pending: 0, approved: 0, denied: 0, published: 0, total: 0 },
		charities: { pending: 0, approved: 0, denied: 0, published: 0, total: 0 },
		users: { total: 0, launchpadUsers: 0, charityUsers: 0 },
	})
	const [totalLaunchpad, setTotalLaunchpad] = useState(0)
	const [seriesLaunchpad, setSeriesLaunchpad] = useState<number[]>([])
	const [labelLaunchpad, setLabelLaunchpad] = useState<string[]>([])
	const [totalCharity, setTotalCharity] = useState(0)
	const [seriesCharity, setSeriesCharity] = useState<number[]>([])
	const [labelCharity, setLabelCharity] = useState<string[]>([])
	const [totalUser, setTotalUser] = useState(0)
	const [totalProfit, setTotalProfit] = useState(0)
	const [transactionData, setTransactionData] = useState<Transaction[]>([])
	const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
	const transactionsPerPage = 10

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
			console.log(
				'Dashboard evidence projects response:',
				evidenceResponse.data
			)
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
		const fetchLaunchpadNumber = async () => {
			try {
				const response = await axios.get('/api/admin/dashboard/launchpad-chart')
				console.log('Launchpad number:', response.data)
				setTotalLaunchpad(response.data.total)
				setSeriesLaunchpad(response.data.series)
				setLabelLaunchpad(response.data.labels)
			} catch (error) {
				console.error('Error fetching launchpad number:', error)
			}
		}
		fetchLaunchpadNumber()
	}, [address, isConnected, loading])

	useEffect(() => {
		const fetchCharityNumber = async () => {
			try {
				const response = await axios.get('/api/admin/dashboard/charity-chart')
				console.log('Charity number:', response.data)
				setTotalCharity(response.data.total)
				setSeriesCharity(response.data.series)
				setLabelCharity(response.data.labels)
			} catch (error) {
				console.error('Error fetching charity number:', error)
			}
		}
		fetchCharityNumber()
	}, [address, isConnected, loading])

	useEffect(() => {
		const fetchUserCount = async () => {
			try {
				const response = await axios.get('/api/admin/dashboard/user-count')
				setTotalUser(response.data.total)
			} catch (error) {
				console.error('Failed to fetch user count:', error)
			}
		}

		fetchUserCount()
	}, [])

	useEffect(() => {
		const fetchProfitCount = async () => {
			try {
				const response = await axios.get('/api/admin/dashboard/profit-count')
				setTotalProfit(response.data.totalProfit)
			} catch (error) {
				console.error('Failed to fetch user count:', error)
			}
		}

		fetchProfitCount()
	}, [])

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
		const fetchEvidenceProjects = async () => {
			try {
				const response = await axios.get(
					'/api/admin/dashboard/project-evidence'
				)
				setEvidenceProjects(response.data.projects)
			} catch (error) {
				console.error('Error loading profit projects:', error)
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('/api/admin/transaction')
				const data = await res.json()

				if (data.success) {
					// Chuyển deposits & donations thành format chung
					const deposits = data.deposits.map((d: any) => ({
						tx_hash: d.tx_hash,
						amount: d.amount,
						datetime: d.datetime,
						name: d.launchpad.launchpad_name,
					}))

					const donations = data.donations.map((d: any) => ({
						tx_hash: d.tx_hash,
						amount: d.amount,
						datetime: d.datetime,
						name: d.charity.charity_name,
					}))

					// Gộp & sắp xếp theo date mới nhất trước
					const all = [...deposits, ...donations].sort(
						(a, b) =>
							new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
					)

					setTransactionData(all)
				}
			} catch (error) {
				console.error('Failed to fetch transaction data:', error)
			}
		}

		fetchData()
	}, [])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		// 🚩 MOCK DATA
	// 		const mockDeposits = [
	// 			{
	// 				tx_hash: '0xabc123def4567890',
	// 				amount: 100,
	// 				datetime: '2024-07-21T10:00:00Z',
	// 				launchpad: { launchpad_name: 'Launchpad Alpha' },
	// 			},
	// 			{
	// 				tx_hash: '0xdef987abc6543210',
	// 				amount: 250,
	// 				datetime: '2024-07-20T12:30:00Z',
	// 				launchpad: { launchpad_name: 'Launchpad Beta' },
	// 			},
	// 		]

	// 		const mockDonations = [
	// 			{
	// 				tx_hash: '0xaaa111bbb222ccc3',
	// 				amount: 50,
	// 				datetime: '2024-07-19T09:15:00Z',
	// 				charity: { charity_name: 'Charity A' },
	// 			},
	// 			{
	// 				tx_hash: '0xddd444eee555fff6',
	// 				amount: 75,
	// 				datetime: '2024-07-18T14:45:00Z',
	// 				charity: { charity_name: 'Charity B' },
	// 			},
	// 		]

	// 		const deposits = mockDeposits.map((d) => ({
	// 			tx_hash: d.tx_hash,
	// 			amount: d.amount,
	// 			datetime: d.datetime,
	// 			name: d.launchpad.launchpad_name,
	// 		}))

	// 		const donations = mockDonations.map((d) => ({
	// 			tx_hash: d.tx_hash,
	// 			amount: d.amount,
	// 			datetime: d.datetime,
	// 			name: d.charity.charity_name,
	// 		}))

	// 		const all = [...deposits, ...donations].sort(
	// 			(a, b) =>
	// 				new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
	// 		)

	// 		setTransactionData(all)
	// 	}

	// 	fetchData()
	// }, [])

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
							<LaunchpadList />
						</div>
					)}
					{activeMenu === 'charity' && (
						<div className="flex flex-col gap-6">
							<CharityList />
						</div>
					)}
					{activeMenu === 'dashboard' && (
						<>
							<div className="flex flex-1 gap-6">
								{/* Launchpad & Charity cards */}
								<div className="flex gap-6 w-2/3">
									<DynamicCardWithChart
										title="Launchpads"
										count={totalLaunchpad}
										series={seriesLaunchpad}
										legend={[
											{ label: 'Pending', color: '#EF88AD' },
											{ label: 'Approved', color: '#A53860' },
											{ label: 'Denied', color: '#670D2F' },
											{ label: 'Published', color: '#3A0519' },
										]}
									/>

									<DynamicCardWithChart
										title="Charity"
										count={totalCharity}
										series={seriesCharity}
										legend={[
											{ label: 'Pending', color: '#D2D0A0' },
											{ label: 'Approved', color: '#9EBC8A' },
											{ label: 'Denied', color: '#73946B' },
											{ label: 'Published', color: '#537D5D' },
										]}
									/>
								</div>

								{/* User + Profit cards */}
								<div className="flex flex-col gap-3 w-1/3 pr-20">
									<NumberCard title="Total users" count={totalUser} />
									<NumberCard title="Total profit" count={totalProfit} />
								</div>
							</div>
							{/* Evidence cards */}
							<div className="flex flex-1 gap-6 w-full pr-20">
								<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full h-full gap-3">
									<div className="flex flex-col">
										<div className="flex flex-row justify-between items-center p-3 px-6">
											<h2 className="text-lg font-semibold text-white">
												Evidences
											</h2>
											{hasMoreEvidence && (
												<Button
													className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
													onClick={() =>
														setVisibleCountEvidence((prev) => prev + 5)
													}
												>
													More
												</Button>
											)}
										</div>
										<div className="flex flex-col w-full px-6">
											{visibleEvidenceProjects.length > 0 ? (
												<ProjectEvidenceCard
													adminprojects={visibleEvidenceProjects}
													showCountdown={true}
													path="/charity/"
													onEdit={(projectId) => {
														console.log(`Edit project ${projectId}`)
													}}
													onView={handleViewEvidence}
												/>
											) : (
												<div className="text-white text-center py-6 text-sm">
													No evidence projects available.
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							{/* Profit cards */}
							<div className="flex flex-1 gap-6 w-full pr-20">
								<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full h-full gap-3">
									<div className="flex flex-col">
										<div className="flex flex-row justify-between items-center p-3 px-6">
											<h2 className="text-lg font-semibold text-white">
												Profit
											</h2>
											{hasMoreProfit && (
												<Button
													className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
													onClick={() =>
														setVisibleCountProfit((prev) => prev + 5)
													}
												>
													More
												</Button>
											)}
										</div>
										<div className="flex flex-col w-full px-6">
											{visibleProfitProjects.length > 0 ? (
												<ProjectProfitCard
													adminprojects={visibleProfitProjects}
													path="/admin/project"
													onEdit={(projectId, action) => {
														console.log(`${action} project ${projectId}`)
													}}
												/>
											) : (
												<div className="text-white text-center py-6 text-sm">
													No profit projects available.
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							{/* Total Transaction cards */}
							<div className="flex flex-1 gap-6 w-full pr-20">
								<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full h-full gap-3 overflow-hidden">
									<div className="flex flex-col">
										<div className="flex flex-row justify-between items-center p-3 px-6">
											<h2 className="text-lg font-semibold text-white">
												Total Transaction
											</h2>
										</div>
										<TransactionTable
											transactionData={transactionData}
											currentTransactionPage={currentTransactionPage}
											setCurrentTransactionPage={setCurrentTransactionPage}
											transactionsPerPage={transactionsPerPage}
										/>
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
