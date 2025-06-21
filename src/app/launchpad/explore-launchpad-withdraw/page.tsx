'use client'

import { LaunchpadABI, MockERC20ABI } from '@/app/abi'
import { chainConfig } from '@/app/config'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import ProjectSectionWithdraw from '@/components/Launchpad/Explore-section/ProjectSectionWithdraw'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'
import { BaseProject, Launchpad } from '@/interface/interface'
import ExploreProjectWithdraw from '@/public/ExploreProjectWithdraw.svg'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { projectDetail } from '@/constants/utils'
import { convertNumToOnChainFormat } from '@/app/utils/decimal'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { Address } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { useAccount, useWriteContract } from 'wagmi'
import { publicClient } from '../create-launchpad/preview/Preview'
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
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(false)
	const [lockOpen, setLockOpen] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const params = useParams()
	const account = useAccount()
	const userAddress: Address = account.address as Address
	const route = useRouter()
	// const { writeContractAsync: writeToToken, error: errorToken } =
	// 	useWriteContract()
	const { writeContractAsync: writeToWithdraw, error: errorWithdraw } =
		useWriteContract()
	const { writeContractAsync: writeToRefund, error: errorRefund } =
		useWriteContract()

	const handleSearchChange = (searchTerm: string) => {
		setSearchTerm(searchTerm)
		setShowAll(false) // Reset show all when searching
	}

	const fetchProjects = async () => {
		if (!account.address) return
		setLoading(true)
		try {
			const response = await axios.post(
				`/api/launchpad/explore-launchpad-withdraw`,
				{ wallet_address: account.address }
			)
			const launchpadsData: Launchpad[] = response.data.data
			const projectsWithPrice = await Promise.all(
				launchpadsData.map(async (launchpad) => {
					const id = launchpad.launchpad_id
					console.log('Fetching data for ID:', id)
					const projectsData: BaseProject[] = launchpadsData.map(
						convertLaunchpadToProject
					)
					try {
						const price = await readContract(publicClient, {
							address: id as Address,
							abi: LaunchpadABI,
							functionName: 'getPricePerToken',
						})
						console.log('Price per token:', price)
						const totalWithdraw = await readContract(publicClient, {
							address: id as Address,
							abi: LaunchpadABI,
							functionName: 'getReceivableProjectTokenAmount',
							args: [userAddress],
						})
						console.log('Total withdraw:', totalWithdraw)

						const isSoftcapReached: boolean = (await readContract(
							publicClient,
							{
								address: id as Address,
								abi: LaunchpadABI,
								functionName: 'isSoftcapReached',
							}
						)) as boolean

						console.log(`Is softcap reached for ${id}: `, isSoftcapReached)
						return {
							...convertLaunchpadToProject(launchpad),
							isSoftcapReached,
							launchpadAddress: id as Address,
							pricePerToken: parseFloat((price as string).toString()),
							totalWithdraw: parseFloat((totalWithdraw as string).toString()),
						}
					} catch (err) {
						console.error(`Error fetching data for ID ${id}`, err)
						return {
							...convertLaunchpadToProject(launchpad),
							isSoftcapReached: false,
							launchpadAddress: '0x0',
							pricePerToken: 0,
							totalWithdraw: 0,
						}
					}
				})
			)
			setProjects(projectsWithPrice)
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

	const handleSubmit = () => {
		route.push('/launchpad/create-launchpad')
	}

	const handleWithdraw = (launchpad_id: any) => {
		const withdraw = async () => {
			if (!launchpad_id) {
				console.error('Launchpad ID is required')
				return
			}

			console.log('Withdraw function called with launchpad_id', launchpad_id)

			try {
				// Execute withdraw transaction
				const hash = await writeToWithdraw({
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'claimToken',
					args: [],
					// account: userAddress,
				})

				console.log('Withdraw transaction hash:', hash)

				// Wait for transaction confirmation
				const withdrawReceipt = await waitForTransactionReceipt(publicClient, {
					hash,
				})

				console.log('Withdraw transaction receipt:', withdrawReceipt)

				if (withdrawReceipt.status !== 'success') {
					console.error('Withdraw transaction failed')
					console.log('Write to Withdraw error: ', errorWithdraw)
					return
				}

				// Verify withdrawal by checking updated balances
				const updatedBalance = await readContract(publicClient, {
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'getAcceptedTokenBalance',
					args: [],
				})

				const updatedRaisedAmount = await readContract(publicClient, {
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'getRaisedAmount',
					args: [],
				})

				console.log('Updated contract balance:', updatedBalance)
				console.log('Updated raised amount:', updatedRaisedAmount)
				console.log('Withdraw successful')
			} catch (error) {
				console.error('Error during withdrawal:', error)
			}
		}

		withdraw()
	}

	const handleRefund = (launchpad_id: any) => {
		const refund = async () => {
			if (!launchpad_id) {
				console.error('Launchpad ID is required')
				return
			}

			console.log('Refund function called with launchpad_id', launchpad_id)

			try {
				// Execute refund transaction
				const hash = await writeToRefund({
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'refundToken',
					args: [],
					// account: userAddress,
				})

				console.log('Refund transaction hash:', hash)

				// Wait for transaction confirmation
				const refundReceipt = await waitForTransactionReceipt(publicClient, {
					hash,
				})

				console.log('Refund transaction receipt:', refundReceipt)

				if (refundReceipt.status !== 'success') {
					console.error('Refund transaction failed')
					console.log('Write to Refund error: ', errorRefund)
					return
				}

				// Verify refund by checking updated balances
				const updatedBalance = await readContract(publicClient, {
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'getAcceptedTokenBalance',
					args: [],
				})

				const updatedRaisedAmount = await readContract(publicClient, {
					abi: LaunchpadABI,
					address: launchpad_id as Address,
					functionName: 'getUserDeposits',
					args: [userAddress],
				})

				console.log('Updated contract balance:', updatedBalance)
				console.log('Updated raised amount:', updatedRaisedAmount)
				console.log('Refund successful')
			} catch (error) {
				console.error('Error during refund:', error)
			}
		}

		refund()
	}

	const filteredProjects = projects.filter((project) => {
		// First filter by tab
		const tabFiltered =
			activeTab === 'all' ? true : project.status === activeTab

		// Then filter by search term
		const searchFiltered =
			searchTerm === '' ||
			project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.shortDescription
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			project.longDescription?.toLowerCase().includes(searchTerm.toLowerCase())

		return tabFiltered && searchFiltered
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
						onSearchChange={handleSearchChange}
						initialSearchTerm={searchTerm}
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
						onButtonClick={(id) => handleWithdraw(id)}
						onRefund={(id) => handleRefund(id)}
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
						onButtonClick={handleSubmit}
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
								if (!account.address) return
								setLoading(true)
								try {
									const response = await axios.post(
										`/api/launchpad/explore-launchpad-withdraw`,
										{ wallet_address: account.address }
									)
									const launchpadsData: Launchpad[] = response.data.data
									const projectsWithPrice = await Promise.all(
										launchpadsData.map(async (launchpad) => {
											const id = launchpad.launchpad_id
											console.log('Fetching data for ID:', id)

											try {
												const price = await readContract(publicClient, {
													address: id as Address,
													abi: LaunchpadABI,
													functionName: 'getPricePerToken',
												})
												console.log('Price per token:', price)

												const totalWithdraw = await readContract(publicClient, {
													address: id as Address,
													abi: LaunchpadABI,
													functionName: 'getProjectTokenBalance',
												})
												console.log('Total withdraw:', totalWithdraw)

												return {
													...convertLaunchpadToProject(launchpad),
													launchpadAddress: id as Address,
													pricePerToken: parseFloat(
														(price as string).toString()
													),
													totalWithdraw: parseFloat(
														(totalWithdraw as string).toString()
													),
												}
											} catch (err) {
												console.error(`Error fetching data for ID ${id}`, err)
												return {
													...convertLaunchpadToProject(launchpad),
													launchpadAddress: '0x0',
													pricePerToken: 0,
													totalWithdraw: 0,
												}
											}
										})
									)
									setProjects(projectsWithPrice)

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
							refetch()
						}}
					/>
				</>
			)}
		</div>
	)
}

export default ExploreProjectPage
