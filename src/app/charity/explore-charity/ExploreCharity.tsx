'use client'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import exploreImage from '@/public/Explore.svg'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import { useState } from 'react'
import { charityDetail } from '@/constants/utils'
import { motion, AnimatePresence } from 'framer-motion'
import CharityCard from '@/components/charity/CharityCard'
import Button from '@/components/UI/button/Button'
import ApplySectionIcon from '@/components/Launchpad/Explore-section/ApplySectionIcon'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'

const navItems = [
	{ id: 'all', label: 'All Projects' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const ExploreCharity = () => {
	const [activeTab, setActiveTab] = useState('all')
	const [showAll, setShowAll] = useState(false)

	const filteredProjects = charityDetail.filter((project) => {
		if (activeTab === 'all') return true
		return project.status === activeTab
	})

	const displayedProjects = showAll
		? filteredProjects
		: filteredProjects.slice(0, 6)

	const hasMoreProjects = filteredProjects.length > 6

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}
	return (
		<div className="flex flex-col justify-center items-center w-full gap-5 min-h-screen font-exo ">
			<AnimatedBlobs count={5} />
			<div className="w-full">
				<ExploreProject
					title="Discover all projects"
					backgroundImage={exploreImage.src}
					searchPlaceholder="Search projects..."
				/>
			</div>
			<div className="w-full">
				<Tab
					navItems={navItems}
					activeTab={activeTab}
					onTabChange={(tab) => {
						setActiveTab(tab)
						setShowAll(false)
					}}
				/>
			</div>
			<div className="max-w-[1300px] p-5">
				<AnimatePresence mode="wait">
					<div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 ">
						{displayedProjects.map((charity) => (
							<motion.div
								key={charity.id}
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
								layout
								className="h-full hover:scale-105 duration-300 transition-transform"
							>
								<CharityCard charityDetail={charity} />
							</motion.div>
						))}
					</div>
				</AnimatePresence>
			</div>
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
			<div className="w-full">
				<ApplySectionIcon
					titleLine1="LaunchTy Charity"
					titleLine2=""
					subtitle="Help build a better world by supporting these amazing charities. 100% of donations are sent directly to your charity of choice!"
					buttonText="Add Project"
					onButtonClick={() => {}}
				/>
			</div>
		</div>
	)
}

export default ExploreCharity
