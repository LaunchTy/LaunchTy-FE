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
import { useLaunchpadStore } from '@/store/launchpad/CreateLaunchpadStore'
import ProjectHeader from '@/components/project-component/ProjectHeader'
import { useRouter } from 'next/navigation'
import {
	useAccount,
	useReadContract,
	useWatchContractEvent,
	useWriteContract,
} from 'wagmi'
import { WriteContractMutateAsync } from 'wagmi/query'
import { LaunchpadABI, LaunchpadFactoryABI, MockERC20ABI } from '@/app/abi'
import { chainConfig } from '@/app/config'
import { Address, createPublicClient, http } from 'viem'
import {
	convertNumToOffChainFormat,
	convertNumToOnChainFormat,
} from '@/app/utils/decimal'
import { to } from '@react-spring/web'
import { readContract, reset, waitForTransactionReceipt } from 'viem/actions'
import { anvil, sepolia } from 'viem/chains'
import { BigNumber } from 'ethers'

export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
})

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
	let status: 'upcoming' | 'ongoing' | 'finished'
	if (now < startDate) status = 'upcoming'
	else if (now >= startDate && now <= endDate) status = 'ongoing'
	else status = 'finished'

	return {
		id: launchpad.launchpad_id,
		token_address: launchpad.token_address,
		total_supply: launchpad.total_supply,
		name: launchpad.launchpad_name,
		launchpad_token: launchpad.launchpad_token,
		logo: launchpad.launchpad_logo,
		endDate: launchpad.launchpad_end_date,
		type: 'launchpad',
		totalInvest: launchpad.totalInvest,
		status: status,
		status_launchpad: launchpad.status_launchpad,
	}
}

const MyProject = () => {
	const router = useRouter()
	const { writeContractAsync } = useWriteContract()
	const account = useAccount()
	const { address } = useAccount()
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)
	const [projects, setProjects] = useState<BaseProject[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [lockOpen, setLockOpen] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const [loadingOpen, setLoadingOpen] = useState(false)
	const [successOpen, setSuccessOpen] = useState(false)

	const { writeContractAsync: writeToWithdraw, error: errorWithdraw } =
		useWriteContract()

	const handleSearchChange = (searchTerm: string) => {
		setSearchTerm(searchTerm)
		setVisibleCount(6) // Reset visible count when searching
	}

	const fetchProjects = async () => {
		try {
			setLoading(true)
			console.log('Fetching projects for address:', address)
			const response = await axios.post('/api/launchpad/my-launchpad', {
				wallet_address: address,
			})
			const launchpadsData: Launchpad[] = response.data.data
			const projectsWithTotalAount = await Promise.all(
				launchpadsData.map(async (launchpad) => {
					const id = launchpad.launchpad_id
					console.log('Fetching data for ID:', id)
					try {
						const totalAmount = await readContract(publicClient, {
							address: id as Address,
							abi: LaunchpadABI,
							functionName: 'getRaisedAmount',
							args: [address],
						})
						console.log('Total withdraw:', totalAmount)
						return {
							...convertLaunchpadToProject(launchpad),
							launchpadAddress: id as Address,
							totalAmount: parseFloat((totalAmount as string).toString()),
						}
					} catch (err) {
						console.error(`Error fetching data for ID ${id}`, err)
						return {
							...convertLaunchpadToProject(launchpad),
							launchpadAddress: '0x0',
							totalAmount: 0,
						}
					}
				})
			)
			setProjects(projectsWithTotalAount)
			console.log('Fetched projects:', projectsWithTotalAount)
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
		if (!address) {
			setLockOpen(true)
			return
		}

		setLockOpen(false)
		fetchProjects()
	}, [address])

	const {
		data: projectId,
		isSuccess: isSuccessProjectId,
		error: isErrorProjectId,
	} = useReadContract({
		abi: LaunchpadFactoryABI,
		address: chainConfig.contracts.LaunchpadFactory.address as Address,
		functionName: 'getCurrentProjectId',
	})

	const {
		data: launchpadAddress,
		isSuccess: isSuccessLaunchpadAddress,
		error: isErrorLaunchpadAddress,
	} = useReadContract({
		abi: LaunchpadFactoryABI,
		address: chainConfig.contracts.LaunchpadFactory.address as Address,
		functionName: 'getLaunchpadAddress',
		args: [Number(projectId) - 1],
	})

	const { data: allowance, error: allowanceError } = useReadContract({
		abi: MockERC20ABI,
		address: launchpadAddress as Address,
		functionName: 'allowance',
		args: [address, launchpadAddress as Address],
	})

	const handlePublish = async (projects: BaseProject) => {
		if (!address) {
			console.log('account.address: ', account.address)
			alert('Please connect your wallet to create a launchpad.')
			return
		}
		console.log('total_supply: ', projects.total_supply)
		console.log('token_address: ', projects.token_address)
		if (!projects.total_supply || !projects.token_address) {
			alert('Please provide a valid token supply and token address.')
			return
		}
		if (allowanceError) {
			console.error('Error reading allowance:', allowanceError)
			alert('Error reading allowance. Please try again later.')
			return
		}

		setLoadingOpen(true) // Show loading modal

		try {
			const factoryAddress = chainConfig.contracts.LaunchpadFactory
				.address as Address
			const acceptedToken = chainConfig.contracts.AcceptedMockERC20
				.address as Address

			const hash = await writeContractAsync({
				abi: LaunchpadFactoryABI,
				address: factoryAddress,
				functionName: 'createLaunchpad',
				args: [
					projects.token_address,
					acceptedToken,
					address,
					1, //Price per token, set to 1 for simplicity
					Math.floor(Date.now() / 1000), // Current time in seconds
					Math.floor(Date.now() / 1000) + 120, // End time in seconds (1 week later)
					BigInt(convertNumToOnChainFormat(10, 18)), // Soft cap in wei
					BigInt(convertNumToOnChainFormat(500, 18)), // Hard cap in wei
					BigInt(convertNumToOnChainFormat(1, 18)), // Min stake in wei
					BigInt(convertNumToOnChainFormat(500, 18)), // Max stake in wei
					BigInt(convertNumToOnChainFormat(500, 18)), // Total supply in wei
				],
			})

			if (!hash) {
				console.error('Transaction hash is undefined')
				return
			}
			console.log('Transaction hash:', hash)
			const receipt = await waitForTransactionReceipt(publicClient, {
				hash,
			})
			console.log('Transaction receipt:', receipt)

			if (!receipt || !receipt.status) {
				console.error('Transaction failed or receipt is undefined')
				alert('Transaction failed. Please try again later.')
				setLoadingOpen(false) // Hide loading modal
				return
			}

			const launchpadAddress = await readContract(publicClient, {
				abi: LaunchpadFactoryABI,
				address: chainConfig.contracts.LaunchpadFactory.address as Address,
				functionName: 'getLaunchpadAddress',
				args: [Number(projectId) - 1],
			})

			console.log('Launchpad paijfoaifaoiejaofiej', launchpadAddress)

			const projectOwnerDepositToken = async () => {
				try {
					const MockERC20Address = chainConfig.contracts.MockERC20.address
					console.log('Mockerc20 addressss: ', MockERC20Address)
					console.log('Launchpad address: ', launchpadAddress)
					const approveHash = await writeContractAsync({
						abi: MockERC20ABI,
						address: MockERC20Address as Address,
						functionName: 'approve',
						args: [
							launchpadAddress as Address,
							convertNumToOnChainFormat(projects.total_supply ?? 0, 18),
						],
					})
					console.log('Approval transaction hash:', approveHash)
					console.log('Appoved')
					//get the allowance after approval
					const newAllowance = await readContract(publicClient, {
						abi: MockERC20ABI,
						address: MockERC20Address as Address,
						functionName: 'allowance',
						args: [address, launchpadAddress as Address],
					})
					console.log(
						'New allowance after approval:',
						convertNumToOffChainFormat((newAllowance as bigint).toString(), 18)
					)
				} catch (someError) {
					console.error('Error approving tokenrgergrgerge:', someError)
					console.log('Error approving token:', allowanceError)
					alert('Error approving token. Please try again later.')
					return
				}
			}

			projectOwnerDepositToken()

			router.push('/launchpad/my-launchpad')
			setLoadingOpen(false) // Hide loading modal
			setSuccessOpen(true) // Show success modal
		} catch (error) {
			console.error('Error submitting launchpad:', error)
			setLoadingOpen(false) // Hide loading modal
		}

		// Call the API to publish the project
		const response = await axios.post('/api/launchpad/my-launchpad/publish', {
			wallet_address: address,
			launchpad_address: launchpadAddress,
			launchpad_id: projects.id,
		})
		if (response.status === 200) {
			console.log('Project published successfully:', response.data)

			// Update the state to reflect the published project
			setProjects((prevProjects) =>
				prevProjects.map((project) =>
					project.id === projects.id
						? { ...project, status_launchpad: 'publish' }
						: project
				)
			)
		} else {
			console.error('Error publishing project:', response.data)
			alert('Error publishing project. Please try again later.')
		}
		setLoadingOpen(false) // Hide loading modal
		setSuccessOpen(true) // Show success modal
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
					functionName: 'withdraw',
					args: [],
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

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
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

	const visibleProjects = filteredProjects.slice(0, visibleCount)
	const hasMore = visibleCount < filteredProjects.length
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
						onSearchChange={handleSearchChange}
						initialSearchTerm={searchTerm}
					/>
					<Tab
						navItems={navItems}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
					<ProjectRowCard
						projects={visibleProjects}
						projectType="launchpad"
						showCountdown={true}
						countdownDuration={24}
						className="custom-class"
						onEdit={(projectId) => {
							console.log('Edit project:', projectId)
						}}
						handlePublish={handlePublish}
						onWithdraw={handleWithdraw}
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
