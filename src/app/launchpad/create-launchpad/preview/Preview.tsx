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
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { WriteContractMutateAsync } from 'wagmi/query'
import { LaunchpadFactoryABI } from '@/app/abi'
import { chainConfig } from '@/app/config'
import { Address, createPublicClient, http } from 'viem'
import { convertNumToOnChainFormat } from '@/app/utils/decimal'
import { waitForTransactionReceipt } from 'viem/actions'
import { anvil } from 'viem/chains'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import SuccessModal from '@/components/UI/modal/SuccessModal'

// interface SocialLink {
// 	platform: string
// 	url: string
// }

const Preview = () => {
	const router = useRouter()
	const account = useAccount()
	const userAddress = account.address

	const tokenAddress = useLaunchpadStore((state) => state.projectTokenAddress)
	const tokenSupply = useLaunchpadStore((state) => state.tokenSupply)
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

	const { writeContractAsync } = useWriteContract()
	const { data, isLoading, error } = useReadContract({
		abi: LaunchpadFactoryABI,
		address:
			'0x4506ea5f77d880f2e7b2abb02d7c7c925464e08a5cd606195aa76f1f5f1f38e1',
		functionName: 'getLaunchpadAddress',
		args: [chainConfig[31337].contracts.MockERC20.address],
	})
	useEffect(() => {
		console.log('Data:', data)
		console.log('Is Loading:', isLoading)
		console.log('Error:', error)
	}, [data, isLoading, error])
	// const {}

	const handleSubmit = async () => {
		if (!userAddress) {
			console.log('account.address: ', account.address)
			alert('Please connect your wallet to create a launchpad.')
			return
		}

		setLoadingOpen(true) // Show loading modal

		try {
			const factoryAddress = chainConfig[31337].contracts.LaunchpadFactory
				.address as Address
			const tokenAdd = chainConfig[31337].contracts.MockERC20.address as Address

			const hash = await writeContractAsync({
				abi: LaunchpadFactoryABI,
				address: factoryAddress,
				functionName: 'createLaunchpad',
				args: [
					tokenAdd,
					userAddress,
					1, //Price per token, set to 1 for simplicity
					Math.floor(Date.now() / 1000), // Current time in seconds
					Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // End time in seconds (1 week later)
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
			const client = createPublicClient({
				chain: anvil,
				transport: http('http://127.0.0.1:8545'),
			})

			const receipt = await waitForTransactionReceipt(client, {
				hash,
			})
			console.log('Transaction receipt:', receipt)

			const launchpadAddress = receipt.logs
				.filter((log: any) => log.eventName === 'LaunchpadCreated')
				.map((log: any) => log.args.launchpadAddress)[0]

			console.log('Launchpad Address:', launchpadAddress)

			const response = await axios.post('/api/launchpad/create', {
				launchpad_id: hash,
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
			// router.push(`/launchpad/my-launchpad/${response.data.project_owner_id}`)

			console.log('Launchpad created:', response.data)
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
