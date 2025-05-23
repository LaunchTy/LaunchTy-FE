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

interface SocialLink {
	platform: string;
	url: string;
}

const Preview = () => {
	const longDescription = useLaunchpadStore((state) => state.longDescription)
	const shortDescription = useLaunchpadStore((state) => state.shortDescription)
	const projectName = useLaunchpadStore((state) => state.projectName)
	const logo = useLaunchpadStore((state) => state.logo)
	const backgroundImage = useLaunchpadStore((state) => state.backgroundImage)
	const setBackgroundImage = useLaunchpadStore((state) => state.setBackgroundImage)
	const images = useLaunchpadStore((state) => state.images)
	const socialLinks = useLaunchpadStore((state) => state.socialLinks)

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
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
							<Button className="w-full bg-gradient">Submit</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default Preview
