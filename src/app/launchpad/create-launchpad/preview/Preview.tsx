'use client'

import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import Button from '@/components/UI/button/Button'
import { useLaunchpadStore } from '@/store/launchpad/CreateLaunchpadStore'
import ProjectHeader from '@/components/project-component/ProjectHeader'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAccount } from 'wagmi'

interface SocialLink {
	platform: string
	url: string
}

const Preview = () => {
	const router = useRouter()
	const account = useAccount()

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
	const setBackgroundImage = useLaunchpadStore(
		(state) => state.setBackgroundImage
	)

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}

	const handleSubmit = async () => {
		console.log('account.address: ', account.address)
		try {
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
				launchpad_start_date: new Date().toISOString(),
				launchpad_end_date: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000
				).toISOString(),
				wallet_address: account.address,
			})

			console.log('Launchpad created:', response.data)
		} catch (error) {
			console.error('Error submitting launchpad:', error)
		}
	}

	// Convert socialLinks object to an array of non-empty links
	const socials = Object.entries(socialLinks)
		.filter(([, url]) => url.trim() !== '')
		.map(([platform, url]) => ({ platform, url }))

	return (
		<Modal>
			<div className="relative min-h-screen w-full font-exo pb-10">
				<AnimatedBlobs count={6} />

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
							id: 0,
							image: logo || '',
							name: projectName,
							description: shortDescription,
							status: 'upcoming',
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
						<ProjectProgress
							socials={socials.reduce(
								(acc, { platform, url }) => ({ ...acc, [platform]: url }),
								{}
							)}
						/>
						<div>
							<Button className="w-full bg-gradient" onClick={handleSubmit}>
								Submit
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default Preview
