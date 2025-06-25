'use client'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Tutorial = () => {
	const [activeSection, setActiveSection] = useState('launchpad')
	const [activeVideo, setActiveVideo] = useState<number | null>(null)

	const launchpadTutorials = [
		{
			id: 1,
			title: 'Connect Wallet',
			description:
				'Before interacting with the launchpad, users need to connect their cryptocurrency wallet. This video guides you through connecting a wallet securely and verifying the connection.',
			duration: '0:22',
			videoId: '0Fer1qx3CPM', // Replace with actual video ID
		},
		{
			id: 2,
			title: 'Create Launchpad',
			description:
				'An end-to-end guide for creating a new launchpad project, from entering basic details to setting tokenomics and uploading media. Ideal for new project owners joining the platform.',
			duration: '1:10',
			videoId: 'g0Izb7HWRqs',
		},
		{
			id: 3,
			title: 'Publish',
			description:
				'A complete guide for project owners on how to publish their launchpad project after filling in all required details. Includes validation checks, smart contract deployment, and project visibility.',
			duration: '0:32',
			videoId: 'LTexQSLvoxE',
		},
		{
			id: 4,
			title: 'Deposit',
			description:
				'Guide for project owners on how to deposit tokens into the launchpad contract. This is a mandatory step before the public sale begins and ensures availability of tokens for buyers.',
			duration: '0:18',
			videoId: 'FRgdHz0NkS4',
		},
		{
			id: 5,
			title: 'User Withdraw',
			description:
				'This tutorial shows how users can withdraw their tokens or funds from a launchpad project after a successful or failed sale. Learn the steps required to claim your assets safely and efficiently.',
			duration: '0:18',
			videoId: '-EDwVTpoZig',
		},
		{
			id: 6,
			title: 'Refund',
			description:
				'Learn how users can request and receive refunds for their contributions in cases where a launchpad project does not reach the required fundraising threshold. Ensures full transparency and user protection.',
			duration: '0:18',
			videoId: 'JNdHyIFtRy8',
		},
		{
			id: 7,
			title: 'PO Withdraw',
			description:
				'This video walks project owners through the process of withdrawing raised funds after a successful launchpad campaign. It includes gas fee handling and confirmation of transactions on-chain.',
			duration: '0:23',
			videoId: 'GmTkPKCXcdc',
		},
	]

	const charityTutorials = [
		{
			id: 8,
			title: 'Create Charity Campaign',
			description:
				'This tutorial helps charity organizations set up a new fundraising campaign on the platform. It covers how to register, verify your organization, and configure campaign details with transparency in mind.',
			duration: '10:30',
			videoId: 'xy6sTswMtdk', // Replace with actual video ID
		},
		{
			id: 9,
			title: 'Donate to Charity',
			description:
				'Learn how individuals can contribute to verified charity campaigns using blockchain. This video walks through selecting a campaign, donating tokens, and tracking the donation process on-chain.',
			duration: '0:28',
			videoId: '6z1rZJWRQrI',
		},
		{
			id: 10,
			title: 'PO Upload History',
			description:
				'A step-by-step guide for project owners to upload proof-of-use or impact reports. This helps maintain donor trust and improves campaign transparency by recording verifiable history on-chain.',
			duration: '0:24',
			videoId: 'ku6whp6c8RY',
		},
		{
			id: 11,
			title: 'PO Withdraw',
			description:
				'In this tutorial, charity owners learn how to securely withdraw donated funds once campaign milestones are met. It includes on-chain verification and safe wallet interaction.',
			duration: '0:25',
			videoId: '1s9DOzMI2Vk',
		},
	]

	const currentTutorials =
		activeSection === 'launchpad' ? launchpadTutorials : charityTutorials

	useEffect(() => {
		console.log('Active section changed:', activeSection)
		console.log('Current tutorials count:', currentTutorials.length)
		console.log('Current tutorials:', currentTutorials)
	}, [activeSection, currentTutorials])

	return (
		<div className="min-h-screen font-exo mt-16">
			<AnimatedBlobs />
			<section className="relative overflow-hidden py-20 px-8">
				<div className="max-w-6xl mx-auto">
					<motion.div className="text-center ">
						<h1 className="text-6xl font-bold text-white mb-6">
							Platform <span className="text-gradient">Tutorials</span>
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Master both our launchpad and charity platforms with comprehensive
							video tutorials and step-by-step guides designed for all skill
							levels.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Platform Selector */}
			<section className="px-8 mb-16">
				<div className="max-w-6xl mx-auto">
					<motion.div
						// {...fadeInUp}
						className="flex justify-center mb-12"
					>
						<div className="glass-component-1 rounded-2xl p-2 flex">
							<button
								onClick={() => setActiveSection('launchpad')}
								className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
									activeSection === 'launchpad'
										? 'bg-gradient text-white'
										: 'text-gray-300 hover:text-white'
								}`}
							>
								🚀 Launchpad Tutorials
							</button>
							<button
								onClick={() => setActiveSection('charity')}
								className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
									activeSection === 'charity'
										? 'bg-gradient text-white'
										: 'text-gray-300 hover:text-white'
								}`}
							>
								❤️ Charity Tutorials
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Tutorial Grid */}
			<section className="px-8 pb-20">
				<div className="max-w-6xl mx-auto">
					<motion.div
						key={activeSection}
						// variants={staggerContainer}
						initial="initial"
						whileInView="whileInView"
						className="grid grid-cols-1 lg:grid-cols-2 gap-8"
					>
						{currentTutorials && currentTutorials.length > 0 ? (
							currentTutorials.map((tutorial) => (
								<motion.div
									key={`${activeSection}-${tutorial.id}`} // Updated key
									// variants={fadeInUp}
									className="glass-component-2 rounded-2xl p-8 hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
								>
									{/* Video Section */}
									<div className="mb-6">
										<div className="aspect-video bg-gray-800 rounded-xl mb-4 relative overflow-hidden">
											<iframe
												width="100%"
												height="100%"
												src={`https://www.youtube.com/embed/${tutorial.videoId}`}
												title={tutorial.title}
												frameBorder="0"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
												allowFullScreen
												className="rounded-xl"
											></iframe>
										</div>

										{/* Tutorial Info */}
										<div className="flex justify-between items-center mb-4">
											<span className="text-purple-400 font-semibold">
												⏱️ {tutorial.duration}
											</span>
											{/* <span
												className={`px-3 py-1 rounded-full text-sm font-semibold `}
											>
												{tutorial.difficulty}
											</span> */}
										</div>
									</div>

									{/* Content */}
									<h3 className="text-2xl font-bold text-white mb-4">
										{tutorial.title}
									</h3>
									<p className="text-gray-300 mb-6">{tutorial.description}</p>

									{/* Steps */}
									<div className="mb-6">
										<h4 className="text-lg font-semibold text-white mb-3">
											What you&apos;ll learn:
										</h4>
										{/* <ul className="space-y-2">
											{tutorial.steps.map((step, index) => (
												<li
													key={index}
													className="flex items-center text-gray-300"
												>
													<span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3">
														{index + 1}
													</span>
													{step}
												</li>
											))}
										</ul> */}
									</div>

									{/* Actions */}
									<div className="flex gap-3">
										<button
											onClick={() => setActiveVideo(tutorial.id)}
											className="flex-1 bg-gradient text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
										>
											Watch Full Screen
										</button>
										{/* <button className="px-6 py-3 glass-component-1 text-white rounded-xl hover:scale-105 transition-transform duration-300">
											📖 Guide
										</button> */}
									</div>
								</motion.div>
							))
						) : (
							<div className="col-span-full text-center text-white">
								<p>No tutorials available for {activeSection}</p>
							</div>
						)}
					</motion.div>
				</div>
			</section>

			{/* Quick Tips Section */}
			<section className="px-8 pb-20">
				<div className="max-w-4xl mx-auto">
					<motion.div
						// {...fadeInUp}
						className="glass-component-1 rounded-2xl p-12 text-center"
					>
						<h2 className="text-4xl font-bold text-white mb-6">Need Help?</h2>
						<p className="text-xl text-gray-200 mb-8">
							Can&apos;t find what you&apos;re looking for? Our support team is
							here to help you navigate both our launchpad and charity
							platforms.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="mailto:launchty@gmail.com"
								className="px-8 py-4 bg-gradient text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
							>
								💬 Contact us
							</Link>
							{/* <button className="px-8 py-4 glass-component-2 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
                                    📚 Documentation
                                </button>
                                <button className="px-8 py-4 glass-component-2 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
                                    🎓 Video Library
                                </button> */}
						</div>
					</motion.div>
				</div>
			</section>

			{/* Video Modal for Fullscreen */}
			{activeVideo && (
				<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
					<div className="max-w-6xl w-full">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-2xl font-bold text-white">
								{currentTutorials.find((t) => t.id === activeVideo)?.title}
							</h3>
							<button
								onClick={() => setActiveVideo(null)}
								className="text-white hover:text-red-400 text-3xl font-bold"
							>
								✕
							</button>
						</div>
						<div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
							<iframe
								width="100%"
								height="100%"
								src={`https://www.youtube.com/embed/${
									currentTutorials.find((t) => t.id === activeVideo)?.videoId
								}?autoplay=1`}
								title={
									currentTutorials.find((t) => t.id === activeVideo)?.title
								}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="rounded-xl"
							></iframe>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Tutorial
