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
			title: 'Getting Started with BlockLaunch',
			description:
				'Learn the basics of our launchpad platform and how to navigate the interface',
			duration: '5:30',
			difficulty: 'Beginner',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Create your BlockLaunch account',
				'Complete KYC verification',
				'Explore the dashboard',
				'Understand project categories',
			],
		},
		{
			id: 2,
			title: 'How to Participate in IDO',
			description:
				'Step-by-step guide to participating in Initial DEX Offerings',
			duration: '8:45',
			difficulty: 'Intermediate',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Research project fundamentals',
				'Check allocation requirements',
				'Connect your wallet',
				'Submit participation request',
				'Claim your tokens',
			],
		},
		{
			id: 3,
			title: 'Launching Your Project',
			description:
				'Complete guide for projects wanting to launch on our platform',
			duration: '12:20',
			difficulty: 'Advanced',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Prepare project documentation',
				'Submit application',
				'Complete technical audit',
				'Set up tokenomics',
				'Launch campaign',
			],
		},
		{
			id: 4,
			title: 'Wallet Integration & Security',
			description: 'How to safely connect and manage your crypto wallets',
			duration: '6:15',
			difficulty: 'Beginner',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Choose compatible wallets',
				'Connect wallet securely',
				'Manage multiple wallets',
				'Security best practices',
			],
		},
	]

	const charityTutorials = [
		{
			id: 5,
			title: 'Donating to Charity Campaigns',
			description: 'Learn how to make transparent donations using blockchain',
			duration: '4:45',
			difficulty: 'Beginner',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Browse charity campaigns',
				'Verify organization credentials',
				'Choose donation amount',
				'Track your donation impact',
			],
		},
		{
			id: 6,
			title: 'Creating a Charity Campaign',
			description:
				'Guide for charity organizations to create funding campaigns',
			duration: '10:30',
			difficulty: 'Intermediate',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Register your organization',
				'Complete verification process',
				'Create campaign details',
				'Set funding goals',
				'Launch and promote',
			],
		},
		{
			id: 7,
			title: 'Tracking Donation Impact',
			description:
				'How to monitor and verify where your donations are being used',
			duration: '7:20',
			difficulty: 'Beginner',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Access donation dashboard',
				'View transaction history',
				'Check impact reports',
				'Verify fund usage',
			],
		},
		{
			id: 8,
			title: 'Charity Reporting & Transparency',
			description:
				'Understanding how charities report their activities on blockchain',
			duration: '9:10',
			difficulty: 'Intermediate',
			videoId: 'dQw4w9WgXcQ',
			steps: [
				'Understanding blockchain records',
				'Reading charity reports',
				'Verifying fund allocation',
				'Impact measurement metrics',
			],
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
										<ul className="space-y-2">
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
										</ul>
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
