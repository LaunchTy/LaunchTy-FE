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
import { BaseProject, Charity } from '@/interface/interface'
import { useAccount, useWriteContract } from 'wagmi'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'
import { CharityFactoryABI, LaunchpadABI } from '@/app/abi'
import { chainConfig } from '@/app/config'
import { Address } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { publicClient } from '@/app/launchpad/create-launchpad/preview/Preview'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import { useRouter, useParams } from 'next/navigation'
import { CharityABI } from '@/app/abi'

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
		logo: charity.charity_logo,
		endDate: charity.charity_end_date,
		type: 'charity',
		totalDonationAmount: charity.totalDonationAmount,
		status: status,
		status_charity: charity.status,
		charity_token_symbol: charity.charity_token_symbol,
	}
}

const MyCharity = () => {
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
	const account = useAccount()
	const userAddress = account.address
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const { writeContractAsync: writeWithdrawOwner } = useWriteContract()
	const { writeContractAsync: writeCreateCharity } = useWriteContract()
	const [loadingOpen, setLoadingOpen] = useState(false)
	const [successOpen, setSuccessOpen] = useState(false)

	const handleSearchChange = (searchTerm: string) => {
		setSearchTerm(searchTerm)
		setVisibleCount(6) // Reset visible count when searching
	}

	const fetchProjects = async () => {
		try {
			setLoading(true)
			const response = await axios.post('/api/charity/my-charity', {
				wallet_address: address,
			})
			const charityData: Charity[] = response.data.data
			console.log('Charity data:', charityData)
			// const projectsData: BaseProject[] = charityData.map(
			// 	convertCharityToProject
			// )
			const charityWithTotalDonate = await Promise.all(
				charityData.map(async (charity) => {
					const id = charity.charity_id
					console.log('Fetching data for ID:', id)
					try {
						const totalDonate = await readContract(publicClient, {
							address: id as Address,
							abi: CharityABI,
							functionName: 'getTotalDonatedAmount',
							// args: [userAddress],
						})
						console.log('Total withdraw:', totalDonate)
						return {
							...convertCharityToProject(charity),
							charityAddress: id as Address,
							// pricePerToken: parseFloat((price as string).toString()),
							totalDonationAmount: parseFloat(
								(totalDonate as string).toString()
							),
						}
					} catch (err) {
						console.error(`Error fetching data for ID ${id}`, err)
						return {
							...convertCharityToProject(charity),
							charityAddress: '0x0',
							// pricePerToken: 0,
							totalDonationAmount: 0,
						}
					}
				})
			)
			console.log('Charity with total donation:', charityWithTotalDonate)

			setProjects(charityWithTotalDonate)
		} catch (error: any) {
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(
				error?.response?.data?.message ||
					'Something went wrong while fetching your charities.'
			)
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	const handlePublish = async (projects: BaseProject) => {
		if (!userAddress) {
			setLockOpen(true)
			return
		}

		// Exception for your wallet address - bypass blockchain transaction
		const isExceptionWallet = userAddress.toLowerCase() === '0x03eA53511cB61e3A3b7402BEdF494Bd74a322523'.toLowerCase() // Replace with your actual wallet address
		
		let charityAddress: string;

		if (isExceptionWallet) {
			// For exception wallet, skip blockchain transaction and use a dummy address
			console.log('Using exception wallet - skipping blockchain transaction')
			charityAddress = '0x03eA53511cB61e3A3b7402BEdF494Bd74a322523' // Dummy address
		} else {
			// Normal flow for other wallets
			const acceptedTokenAddress: Address = chainConfig.contracts
				.AcceptedMockERC20.address as Address

			const hash = await writeCreateCharity({
				address: chainConfig.contracts.CharityFactory.address as Address,
				abi: CharityFactoryABI,
				functionName: 'createCharity',
				args: [
					userAddress,
					acceptedTokenAddress,
					Math.floor(Date.now() / 1000),
					Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
				],
			})

			const receipt = await waitForTransactionReceipt(publicClient, {
				hash,
			})
			console.log('Transaction hash:', hash)
			console.log('Receipt: ', receipt)

			if (!receipt) {
				console.error('Transaction receipt not found', receipt)
				setError('Transaction receipt not found')
				return
			}
			const currentCharity = await readContract(publicClient, {
				address: chainConfig.contracts.CharityFactory.address as Address,
				abi: CharityFactoryABI,
				functionName: 'getCharityCount',
				args: [],
			})

			console.log('Current charity count:', currentCharity)

			charityAddress = (await readContract(publicClient, {
				address: chainConfig.contracts.CharityFactory.address as Address,
				abi: CharityFactoryABI,
				functionName: 'getCharityAddress',
				args: [currentCharity],
			})) as string

			console.log('Charity address:', charityAddress)
		}

		try {
			if (!address) {
				setLockOpen(true)
				return
			}

			setLoading(true)

			// const charityData = {
			// 	charity_name: projectName,
			// 	charity_short_des: shortDescription,
			// 	charity_long_des: longDescription,
			// 	charity_token_symbol: selectedToken || '',
			// 	charity_token_supply: Number(tokenSupply),
			// 	charity_logo: logo,
			// 	charity_fb: socialLinks.facebook || '',
			// 	charity_x: socialLinks.twitter || '',
			// 	charity_ig: socialLinks.instagram || '',
			// 	charity_website: socialLinks.website || '',
			// 	charity_whitepaper: '',
			// 	charity_img: images,
			// 	charity_start_date: startDate,
			// 	charity_end_date: endDate,
			// 	license_certificate: licenseAndCertification,
			// 	evidence: historyEvidence.filter(Boolean),
			// 	repre_name: representativeName,
			// 	repre_phone: phoneNumber,
			// 	repre_id: personalId,
			// 	repre_faceid: faceId,
			// 	wallet_address: address,
			// }
		} catch (error: any) {
			console.error('Error creating charity:', error)
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(error?.message || 'Failed to create charity')
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}

		const response = await axios.post('/api/charity/my-charity/publish', {
			wallet_address: address,
			charity_address: charityAddress,
			charity_id: projects.id,
		})
		if (response.status === 200) {
			console.log('Project published successfully:', response.data)
			window.location.reload() // Reload the page to reflect changes
		} else {
			console.error('Error publishing project:', response.data)
			alert('Error publishing project. Please try again later.')
		}
		setLoadingOpen(false) // Hide loading modal
		setSuccessOpen(true) // Show success modal
	}

	useEffect(() => {
		if (!address) {
			setLockOpen(true)
			return
		}

		setLockOpen(false)
		fetchProjects()
	}, [address])

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

	const handleWithdraw = async (projectId: Address) => {
		if (!address) {
			setLockOpen(true)
			console.error('Wallet not connected')
			return
		}
		if (!projectId) {
			console.error('Invalid project ID')
			return
		}

		const withDrawableAmount = await readContract(publicClient, {
			address: projectId,
			abi: CharityABI,
			functionName: 'getTotalDonatedAmount',
		})

		if (!withDrawableAmount) {
			console.error('Failed to fetch withdrawable amount')
			return
		}
		console.log('Withdrawable amount:', withDrawableAmount)

		const hash: Address = await writeWithdrawOwner({
			address: projectId,
			abi: CharityABI,
			functionName: 'withdrawFund',
		})

		if (!hash) {
			console.error('Failed to withdraw')
			return
		}

		console.log('Withdraw transaction hash:', hash)
		const withdrawReceipt = await waitForTransactionReceipt(publicClient, {
			hash,
		})
		console.log('Withdraw transaction receipt:', withdrawReceipt)
	}

	const handleEdit = (projectId: string) => {
		console.log('Edit charity:', projectId)
		router.push(`/charity/edit-charity/${projectId}`)
	}

	return (
		<div className="min-h-screen font-exo">
			<AnimatedBlobs count={6} />
			{lockOpen ? (
				<LockModal
					open={lockOpen}
					onUnlock={() => setLockOpen(false)}
					canClose={true}
					message="Please connect your wallet to view your charities."
				/>
			) : loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
					<ExploreProject
						title="Your Charities"
						backgroundImage={YourProject}
						searchPlaceholder="Search charities..."
						onSearchChange={handleSearchChange}
						initialSearchTerm={searchTerm}
						projectCount={filteredProjects.length}
						totalProjects={projects.length}
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
						onEdit={handleEdit}
						onWithdraw={(projectId) => {
							handleWithdraw(projectId as Address)
						}}
						handlePublish={handlePublish}
						projectType="charity"
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
							fetchProjects()
						}}
					/>
				</>
			)}
		</div>
	)
}

export default MyCharity
