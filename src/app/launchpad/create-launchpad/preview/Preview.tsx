'use client'

import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import Button from '@/components/UI/button/Button'
import { useLaunchpadStore } from '@/store/launchpad/CreateLaunchpadStore'
import ProjectHeader from '@/components/project-component/ProjectHeader'
import { useRouter } from 'next/navigation'
import axios from 'axios'
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
import LoadingModal from '@/components/UI/modal/LoadingModal'
import SuccessModal from '@/components/UI/modal/SuccessModal'
import { stat } from 'fs'

// export const publicClient = createPublicClient({
// 	chain: anvil,
// 	transport: http('http://127.0.0.1:8545'),
// })
export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
})
// interface SocialLink {
// 	platform: string
// 	url: string
// }

const Preview = () => {
	const router = useRouter()
	const account = useAccount()
	const userAddress = account.address

	let tokenAddress = useLaunchpadStore((state) => state.projectTokenAddress)
	let tokenSupply = useLaunchpadStore((state) => state.tokenSupply)
	const launchpadToken = useLaunchpadStore((state) => state.launchpadToken)
	const maxStake = useLaunchpadStore((state) => state.maxStakePerInvestor)
	const minStake = useLaunchpadStore((state) => state.minStakePerInvestor)
	const softCap = useLaunchpadStore((state) => state.softCap)
	const hardCap = useLaunchpadStore((state) => state.hardCap)

	const projectName = useLaunchpadStore((state) => state.projectName)
	const logo = useLaunchpadStore((state) => state.logo)
	const shortDescription = useLaunchpadStore((state) => state.shortDescription)
	const longDescription = useLaunchpadStore((state) => state.longDescription)

	const socialLinks = useLaunchpadStore((state) => state.socialLinks)
	const whitepaper = useLaunchpadStore((state) => state.whitepaper)

	const images = useLaunchpadStore((state) => state.images)
	const backgroundImage = useLaunchpadStore((state) => state.backgroundImage)
	const startDate = useLaunchpadStore((state) => state.startDate)
	const endDate = useLaunchpadStore((state) => state.endDate)
	const setBackgroundImage = useLaunchpadStore(
		(state) => state.setBackgroundImage
	)

	const [loadingOpen, setLoadingOpen] = useState(false)
	const [successOpen, setSuccessOpen] = useState(false)

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}

	// const { writeContractAsync } = useWriteContract()
	// // useWatchContractEvent({
	// // 	abi: LaunchpadFactoryABI,
	// // 	address: chainConfig.contracts.LaunchpadFactory.address as Address,
	// // 	eventName: 'LaunchpadCreated',
	// // 	onLogs: (logs) => {
	// // 		logs.forEach((log) => {
	// // 			console.log('Event Launchpad created:', log)
	// // 		})
	// // 	},
	// // })

	// const {
	// 	data: projectId,
	// 	isSuccess: isSuccessProjectId,
	// 	error: isErrorProjectId,
	// } = useReadContract({
	// 	abi: LaunchpadFactoryABI,
	// 	address: chainConfig.contracts.LaunchpadFactory.address as Address,
	// 	functionName: 'getCurrentProjectId',
	// })

	// const {
	// 	data: launchpadAddress,
	// 	isSuccess: isSuccessLaunchpadAddress,
	// 	error: isErrorLaunchpadAddress,
	// } = useReadContract({
	// 	abi: LaunchpadFactoryABI,
	// 	address: chainConfig.contracts.LaunchpadFactory.address as Address,
	// 	functionName: 'getLaunchpadAddress',
	// 	args: [Number(projectId) - 1],
	// })

	// const { data: allowance, error: allowanceError } = useReadContract({
	// 	abi: MockERC20ABI,
	// 	address: launchpadAddress as Address,
	// 	functionName: 'allowance',
	// 	args: [userAddress, launchpadAddress as Address],
	// })

	// useEffect(() => {
	// 	if (isSuccessProjectId) {
	// 		console.log(
	// 			'Upcoming Project id:',
	// 			convertNumToOffChainFormat((projectId as bigint).toString(), 0)
	// 		)
	// 		console.log(
	// 			'Launchpad deposit amount and address: ',
	// 			allowance,
	// 			'             ',
	// 			launchpadAddress
	// 		)
	// 	}
	// 	if (isErrorProjectId) {
	// 		console.error('Error reading launchpad data:', isErrorProjectId)
	// 	}
	// }, [projectId, isSuccessProjectId, isErrorProjectId])

	// useEffect(() => {
	// 	if (isSuccessLaunchpadAddress) {
	// 		console.log('Launchpad address:', launchpadAddress as Address)
	// 	}
	// 	if (isErrorLaunchpadAddress) {
	// 		console.error('Error reading launchpad address:', isErrorLaunchpadAddress)
	// 	}
	// }, [
	// 	launchpadAddress,
	// 	projectId,
	// 	isSuccessLaunchpadAddress,
	// 	isErrorLaunchpadAddress,
	// ])

	const handleSubmit = async () => {
		// tokenSupply = 1000
		// tokenAddress = chainConfig.contracts.MockERC20.address
		// if (!userAddress) {
		// 	console.log('account.address: ', account.address)
		// 	alert('Please connect your wallet to create a launchpad.')
		// 	return
		// }
		// if (!tokenSupply || !tokenAddress) {
		// 	alert('Please provide a valid token supply and token address.')
		// 	return
		// }
		// if (allowanceError) {
		// 	console.error('Error reading allowance:', allowanceError)
		// 	alert('Error reading allowance. Please try again later.')
		// 	return
		// }

		// const projectOwnerDepositToken = async () => {
		// 	try {
		// 		// if (!allowance || (allowance as BigNumber).gte(tokenSupply)) {
		// 		// 	console.log('Allowance is sufficient, no need to approve.')
		// 		// } else {
		// 		const MockERC20Address = chainConfig.contracts.MockERC20.address
		// 		console.log('Mockerc20 addressss: ', MockERC20Address)
		// 		console.log('Launchpad address: ', launchpadAddress)
		// 		const approveHash = await writeContractAsync({
		// 			abi: MockERC20ABI,
		// 			address: MockERC20Address as Address,
		// 			functionName: 'approve',
		// 			args: [
		// 				launchpadAddress as Address,
		// 				convertNumToOnChainFormat(tokenSupply, 18),
		// 			],
		// 		})
		// 		console.log('Approval transaction hash:', approveHash)
		// 		console.log('Appoved')
		// 		//get the allowance after approval
		// 		const newAllowance = await readContract(publicClient, {
		// 			abi: MockERC20ABI,
		// 			address: MockERC20Address as Address,
		// 			functionName: 'allowance',
		// 			args: [userAddress, launchpadAddress as Address],
		// 		})
		// 		console.log(
		// 			'New allowance after approval:',
		// 			convertNumToOffChainFormat((newAllowance as bigint).toString(), 18)
		// 		)
		// 		// }
		// 	} catch (someError) {
		// 		console.error('Error approving tokenrgergrgerge:', someError)
		// 		console.log('Error approving token:', allowanceError)
		// 		alert('Error approving token. Please try again later.')
		// 		return
		// 	}
		// }

		// projectOwnerDepositToken()

		setLoadingOpen(true) // Show loading modal

		try {
			// const factoryAddress = chainConfig.contracts.LaunchpadFactory
			// 	.address as Address
			// const tokenAdd = chainConfig.contracts.MockERC20.address as Address
			// const acceptedToken = chainConfig.contracts.AcceptedMockERC20
			// 	.address as Address

			// const hash = await writeContractAsync({
			// 	abi: LaunchpadFactoryABI,
			// 	address: factoryAddress,
			// 	functionName: 'createLaunchpad',
			// 	args: [
			// 		tokenAdd,
			// 		acceptedToken,
			// 		userAddress,
			// 		1, //Price per token, set to 1 for simplicity
			// 		Math.floor(Date.now() / 1000), // Current time in seconds
			// 		Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // End time in seconds (1 week later)
			// 		BigInt(convertNumToOnChainFormat(10, 18)), // Soft cap in wei
			// 		BigInt(convertNumToOnChainFormat(500, 18)), // Hard cap in wei
			// 		BigInt(convertNumToOnChainFormat(1, 18)), // Min stake in wei
			// 		BigInt(convertNumToOnChainFormat(500, 18)), // Max stake in wei
			// 		BigInt(convertNumToOnChainFormat(500, 18)), // Total supply in wei
			// 	],
			// })

			// if (!hash) {
			// 	console.error('Transaction hash is undefined')
			// 	return
			// }
			// console.log('Transaction hash:', hash)
			// const receipt = await waitForTransactionReceipt(publicClient, {
			// 	hash,
			// })
			// console.log('Transaction receipt:', receipt)

			// if (!receipt || !receipt.status) {
			// 	console.error('Transaction failed or receipt is undefined')
			// 	alert('Transaction failed. Please try again later.')
			// 	setLoadingOpen(false) // Hide loading modal
			// 	return
			// }

			// const launchpadAddress = await readContract(publicClient, {
			// 	abi: LaunchpadFactoryABI,
			// 	address: chainConfig.contracts.LaunchpadFactory.address as Address,
			// 	functionName: 'getLaunchpadAddress',
			// 	args: [Number(projectId) - 1],
			// })

			// console.log('Launchpad paijfoaifaoiejaofiej', launchpadAddress)
			const response = await axios.post('/api/launchpad/create', {
				token_address: tokenAddress,
				total_supply: tokenSupply,
				launchpad_token: launchpadToken,
				max_stake: maxStake,
				min_stake: minStake,
				soft_cap: softCap,
				hard_cap: hardCap,
				launchpad_name: projectName,
				launchpad_logo: logo,
				launchpad_short_des: shortDescription,
				launchpad_long_des: longDescription,
				launchpad_fb: socialLinks?.facebook || null,
				launchpad_x: socialLinks?.twitter || null,
				launchpad_ig: socialLinks?.instagram || null,
				launchpad_website: socialLinks?.website || null,
				launchpad_whitepaper: whitepaper || null,
				launchpad_img: images,
				//
				launchpad_start_date: startDate.toISOString(),
				launchpad_end_date: endDate.toISOString(),
				// launchpad_start_date: new Date().toISOString(),
				// launchpad_end_date: new Date(
				// 	Date.now() + 7 * 24 * 60 * 60 * 1000
				// ).toISOString(),
				wallet_address: account.address,
			})

			//give api data with real mock value to test the api
			// const response = await axios.post('/api/launchpad/create', {
			// 	// launchpad_id: launchpadAddress,
			// 	token_address: '0xdf781fe9e6484722fe78f461a744ab7d7a1c9f96',
			// 	total_supply: 10000000,
			// 	launchpad_token: 'AILAB',
			// 	max_stake: 20000,
			// 	min_stake: 500,
			// 	soft_cap: 50000,
			// 	hard_cap: 200000,
			// 	launchpad_name: 'Project AILAB',
			// 	launchpad_logo:
			// 		'https://via.placeholder.com/150/ff6347/ffffff?text=NOVA',
			// 	launchpad_short_des:
			// 		'NOVA is building the next generation of decentralized identity and reputation.',
			// 	launchpad_long_des:
			// 		'Project NOVA aims to redefine how trust works in Web3 by providing a decentralized identity infrastructure. With NOVA, users can build verifiable reputations that are portable across platforms and protocols.',
			// 	launchpad_fb: 'https://facebook.com/projectnova',
			// 	launchpad_x: 'https://twitter.com/projectnova',
			// 	launchpad_ig: 'https://instagram.com/projectnova',
			// 	launchpad_website: 'https://projectnova.io/',
			// 	launchpad_whitepaper: 'https://projectnova.io/whitepaper.pdf',
			// 	launchpad_img: [
			// 		'https://via.placeholder.com/600x300/333333/ffffff?text=NOVA+1',
			// 		'https://via.placeholder.com/600x400/555555/ffffff?text=NOVA+2',
			// 	],
			// 	launchpad_start_date: new Date().toISOString(),
			// 	launchpad_end_date: new Date(
			// 		Date.now() + 10 * 24 * 60 * 60 * 1000
			// 	).toISOString(), // 10 days later
			// 	wallet_address: '0x8f07aDC031CF8e12fc66a01A12982fB543AEe86C',
			// })
			if (!response || response.status !== 201) {
				console.error('Error submitting launchpad:', response)
				alert('Error submitting launchpad. Please try again later.')
				setLoadingOpen(false) // Hide loading modal
				return
			}

			// console.log('Launchpad created:', response.data)
			router.push('/launchpad/my-launchpad')
			setLoadingOpen(false) // Hide loading modal
			setSuccessOpen(true) // Show success modal
		} catch (error) {
			console.error('Error submitting launchpad:', error)
			setLoadingOpen(false) // Hide loading modal
		}
	}

	// Convert socialLinks object to an array of non-empty links
	// const socials = Object.entries(socialLinks)
	// 	.filter(([, url]) => url.trim() !== '')
	// 	.map(([platform, url]) => ({ platform, url }))

	return (
		<div className="relative min-h-screen w-full font-exo pb-10">
			<AnimatedBlobs count={6} />
			{/* Loading Modal */}
			<LoadingModal open={loadingOpen} onOpenChange={setLoadingOpen} />
			{/* Success Modal */}
			<SuccessModal
				open={successOpen}
				onOpenChange={setSuccessOpen}
				onContinue={() => {
					setSuccessOpen(false)
					router.push('/launchpad/explore-launchpad') // Redirect after success
				}}
			/>
			{/* Full-width background container */}
			<AnimatePresence mode="wait">
				{backgroundImage && (
					<motion.div
						key={backgroundImage}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.2 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 w-full h-2/3 z-0 bg-cover bg-center scale-110"
						style={{
							backgroundImage: `url(${backgroundImage})`,
							filter: 'blur(15px)',
						}}
					/>
				)}
			</AnimatePresence>

			<div className="relative px-20 pt-48 pb-12 z-10">
				{/* Project Header */}
				<ProjectHeader
					projectDetail={{
						name: projectName,
						logo: logo ?? '',
						shortDescription: shortDescription,
						// startDate: startDate.toISOString(),
						// endDate: endDate.toISOString(),
					}}
				/>
			</div>

			<div className="flex items-start justify-center gap-12">
				<div className="w-7/12">
					{/* Pass images from store to the carousel */}
					<ThumbNailCarousel
						fullWidthBackground={false}
						onImageChange={handleImageChange}
						projectImages={images.map((image: string) => ({
							src: image,
							alt: 'Image',
							description: 'Image',
						}))}
					/>
					<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-5">
						<span className="text-[45px] font-bold">Description</span>
						<span>{longDescription ? longDescription : 'N/A'}</span>
					</div>
				</div>
				{/* Right Sticky Column */}
				<div className="w-3/12 h-fit sticky top-12 flex flex-col gap-5">
					{/* <ProjectProgress
							socials={socials.reduce(
								(acc, { platform, url }) => ({ ...acc, [platform]: url }),
								{}
							)}
						/> */}
					<div className="">
						<ProjectProgress
							website={socialLinks.website}
							fb={socialLinks.facebook}
							x={socialLinks.twitter}
							ig={socialLinks.instagram}
						/>
					</div>
					<div>
						<Button className="w-full bg-gradient" onClick={handleSubmit}>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Preview
