'use client'

import ProjectHeader from '@/components/project-component/ProjectHeader'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import {
	Modal,
	ModalBody,
	ModalContent,
} from '@/components/UI/modal/AnimatedModal'
import DonateArea from '@/components/UI/shared/DonateArea'
import CustomTabs from '@/components/UI/shared/Tabs'
import Tabs from '@/components/UI/shared/Tabs'
import { projectDetail } from '@/constants/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import HistoryEvidence from '@/components/charity/charity-detail-section/HistoryEvidence'
import AddressInfo from '@/components/charity/charity-detail-section/AddressInfo'
import ProjectImg from '@/public/Project.png'
import DonorsTable from '@/components/charity/charity-detail-section/DonorsTable'
import CountdownTimer from '@/components/UI/countdown/CountdownTimer'
import Button from '@/components/UI/button/Button'

interface ModalProjectProps {
	projectDetail: {
		socials: any[]
		tokenPools: {
			id: string
			name: string
		}[]
	}
}
const CharityDetail = () => {
	const [backgroundImage, setBackgroundImage] = useState<string>('')

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
					<div className="flex justify-between items-center">
						<ProjectHeader projectDetail={projectDetail} />
						<CountdownTimer
							endTime={new Date(
								Date.now() + 7 * 24 * 60 * 60 * 1000
							).toISOString()}
						/>
					</div>
				</div>

				<div className="flex items-start justify-center gap-12">
					<div className="w-10/12">
						<ThumbNailCarousel
							fullWidthBackground={false}
							onImageChange={handleImageChange}
						/>
						<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-8 pb-16">
							<span className="text-[45px] font-bold">Description</span>
							<span>
								If you have funded this project, we will be in touch to let you
								know when the rewards have started distributing and when you can
								claim them.
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-start justify-center gap-9">
					<div className="w-6/12">
						<div className="h-[500px]">
							<HistoryEvidence
								images={[
									{
										src: ProjectImg.src,
										alt: 'Charity evidence 1',
									},
									{
										src: '/images/charity/evidence2.jpg',
										alt: 'Charity evidence 2',
									},
									{
										src: '/images/charity/evidence3.jpg',
										alt: 'Charity evidence 3',
									},
								]}
							/>
						</div>
						<AddressInfo
							fields={[
								{
									label: 'Address',
									value:
										'Đường cành lá quận cành cây huyện gió mây thành phố đồi núi',
								},
								{
									label: 'Phone',
									value: 'Hồ Chí Minh',
								},
								{
									label: 'Email',
									value: 'Việt Nam',
								},
							]}
						/>
					</div>
					<div className="w-4/12 h-fit top-12 flex flex-col">
						<div className="h-[500px] flex flex-col gap-5 w-full">
							<DonateArea enabled={true} />
						</div>
						<AddressInfo
							fields={[
								{
									label: 'Total charity raised',
									value: '1,789,000',
								},
								{
									label: 'Total donors',
									value: '689,890',
								},
								{
									label: 'Total transaction',
									value: '689,899',
								},
							]}
						/>
					</div>

					<ModalBody>
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
												{/* Add content inside the glass component if needed */}
												<div className="mx-3 bg-white rounded-full w-8 h-8"></div>
												<div className="text-white font-bold">{pool.name}</div>
											</motion.div>
										</div>
									))}
								</div>
							</div>
						</ModalContent>
					</ModalBody>
				</div>
				<div className="flex items-center justify-center p-5 gap-3">
					<Button
						// onClick={() => onEdit?.(project.id, 'approve')}
						className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
					>
						Approve
					</Button>
					<Button
						// onClick={() => onEdit?.(project.id, 'deny')}
						className="bg-red-600 text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
					>
						Deny
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default CharityDetail
