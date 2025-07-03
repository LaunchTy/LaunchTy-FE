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
import Button from '@/components/UI/button/Button'
import ProjectProfitCard from '@/components/admin/ProjectProfitCard'
import { useRouter } from 'next/navigation'

const AdminDashboard = () => {
	const [activeMenu, setActiveMenu] = useState('')
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

	const visibleEvidenceProjects = evidenceProjects.slice(
		0,
		visibleCountEvidence
	)
	const hasMoreEvidence = evidenceProjects.length > visibleCountEvidence

	const visibleProfitProjects = profitProjects.slice(0, visibleCountProfit)
	const hasMoreProfit = profitProjects.length > visibleCountProfit

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
			try {
				const response = await axios.get(
					'/api/admin/dashboard/project-evidence'
				)
				setEvidenceProjects(response.data.projects)
			} catch (error) {
				console.error('Error loading evidence projects:', error)
			}
		}

		fetchEvidenceProjects()
	}, [])

	useEffect(() => {
		const fetchProfitProjects = async () => {
			try {
				const res = await axios.get('/api/admin/dashboard/project-profit')
				setProfitProjects(res.data.projects)
			} catch (err) {
				console.error('Failed to load profit projects:', err)
			}
		}

		fetchProfitProjects()
	}, [])

	if (loading) return null

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
			<div className="flex flex-row py-10 w-full">
				<div className="flex min-h-screen  gap-10">
					<div className="pl-20 h-full flex flex-col sticky top-6">
						<LeftNavBar
							activeMenu={activeMenu}
							setActiveMenu={(menu) => {
								router.push(`/admin/project-list?tab=${menu}`)
							}}
						/>
					</div>
					<div className="h-full flex flex-col w-full">
						{activeMenu === 'launchpad' && <LaunchpadList />}
						{activeMenu === 'charity' && <CharityList />}
					</div>
				</div>
				<div className="flex flex-col gap-6 w-full">
					<div className="flex flex-1 gap-6">
						{/* Launchpad & Charity cards */}
						<div className="flex gap-6 w-2/3">
							<CardWithChart
								title="Launchpads"
								count={1000}
								chartColors={['#FF9800', '#FFCC80', '#FFA726']}
								legend={[
									{ label: 'Pending', color: '#FF9800' },
									{ label: 'Approved', color: '#FFCC80' },
									{ label: 'Denied', color: '#FFA726' },
								]}
							/>
							<CardWithChart
								title="Charities"
								count={1000}
								chartColors={['#D946EF', '#E9D5FF', '#F0ABFC']}
								legend={[
									{ label: 'Pending', color: '#D946EF' },
									{ label: 'Approved', color: '#E9D5FF' },
									{ label: 'Denied', color: '#F0ABFC' },
								]}
							/>
						</div>

						{/* User cards */}
						<div className="flex flex-col gap-3 w-1/3 pr-20">
							<UserCard title="Launchpad users" count={1000} />
							<UserCard title="Charity users" count={1000} />
						</div>
					</div>
					<div className="flex flex-1 gap-6 pr-20">
						<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full max-h-[200px] gap-3">
							<div className="flex flex-row gap-4 p-3 px-6">
								<h2 className="text-lg font-semibold text-white">Profit</h2>
							</div>
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
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard
