'use client'

import ProjectHeader from '@/components/project-component/ProjectHeader'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import StakeArea from '@/components/UI/shared/StakeArea'
import { Launchpad } from '@/interface/interface'
// import { projectDetail } from '@/constants/utils'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
interface ModalProjectProps {
	projectDetail: {
		socials: any[]
		tokenPools: {
			id: string
			name: string
		}[]
	}
}
const LaunchpadDetail = () => {
	const params = useParams()
	const launchpad_id = params['launchpad-id']
	const [launchpad, setLaunchpad] = useState<Launchpad>({} as Launchpad)
	const [loading, setLoading] = useState(true)
	const [backgroundImage, setBackgroundImage] = useState<string>('')

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(
					`/api/launchpad/launchpad-detail?launchpad_id=${launchpad_id}`
				)
				setLaunchpad(response.data.data)
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [launchpad_id])

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}
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
					<ProjectHeader
						projectDetail={{
							name: launchpad.launchpad_name || 'Unknown Project',
							logo: launchpad.launchpad_logo || '',
							shortDescription: launchpad.launchpad_short_des,
							startDate: launchpad.launchpad_start_date,
							endDate: launchpad.launchpad_end_date,
						}}
					/>
				</div>

				<div className="flex items-start justify-center gap-12 m-">
					<div className="w-7/12">
						<ThumbNailCarousel
							fullWidthBackground={false}
							onImageChange={handleImageChange}
						/>
						<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-5">
							<span className="text-[45px] font-bold">Description</span>
							<span>
								{launchpad.launchpad_long_des ||
									'No description available for this project.'}
							</span>
						</div>
					</div>
					{/* Right Sticky Column */}
					<div className="w-3/12 h-fit sticky top-12 flex flex-col">
						<div className="">
							<ProjectProgress
								website={launchpad.launchpad_website}
								fb={launchpad.launchpad_fb}
								x={launchpad.launchpad_x}
								ig={launchpad.launchpad_ig}
							/>
						</div>
						<div className="">
							<StakeArea />
						</div>
					</div>
				</div>

				{/* <ModalBody>
					<ModalContent>
						<div className="z-30">
							<div className="mb-9 font-orbitron font-bold text-white text-center text-xl">
								All Pool
							</div>
							<div className="max-h-96 overflow-x-hidden overflow-y-auto px-4">
								{projectDetail.tokenPools.map((pool) => (
									<div key={pool.id}>
										<motion.div
											className="glass-component-1 h-12 mb-6 rounded-xl flex flex-row items-center hover:bg-gray-700 transition-colors duration-300"
											whileHover={{
												scale: 1.05,
											}}
											whileTap={{ scale: 0.95 }}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="mx-3 bg-white rounded-full w-8 h-8"></div>
											<div className="text-white font-bold">{pool.name}</div>
										</motion.div>
									</div>
								))}
							</div>
						</div>
					</ModalContent>
				</ModalBody> */}
			</div>
		</Modal>
	)
}

export default LaunchpadDetail
