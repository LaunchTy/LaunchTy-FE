'use client'

import ProjectHeader from '@/components/project-component/ProjectHeader'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import StakeArea from '@/components/UI/shared/StakeArea'
import { Launchpad } from '@/interface/interface'
// import { projectDetail } from '@/constants/utils'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
const LaunchpadDetail = () => {
	const params = useParams()
	const launchpad_id = params['launchpad-id']
	const [launchpad, setLaunchpad] = useState<Launchpad>({} as Launchpad)
	const [loading, setLoading] = useState(true)
	const [backgroundImage, setBackgroundImage] = useState<string>('')
	const [steps, setSteps] = useState(2)
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}

	useEffect(() => {
		if (!launchpad.launchpad_start_date || !launchpad.launchpad_end_date) return

		const startDate = new Date(launchpad.launchpad_start_date)
		const endDate = new Date(launchpad.launchpad_end_date)
		const now = new Date()

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

		if (now < startDate) {
			setSteps(0)
		} else if (now >= startDate && now <= endDate) {
			setSteps(1)
		}
	}, [launchpad.launchpad_start_date, launchpad.launchpad_end_date])

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

	const onEdit = async (launchpad_id: string, action: 'approve' | 'deny') => {
		try {
			await axios.post('/api/admin/launchpad-detail/action', {
				launchpad_id,
				action,
			})
			alert(`Project ${action}d successfully`)
			window.location.reload()
		} catch (error) {
			console.error(error)
			alert('Failed to update project status')
		}
	}

	return (
		<Modal>
			<div className="relative min-h-screen w-full font-exo pb-10">
				<AnimatedBlobs count={6} />
				{loading ? (
					<LoadingModal open={loading} onOpenChange={setLoading} />
				) : (
					<>
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
								{launchpad?.launchpad_img?.length > 0 && (
									<ThumbNailCarousel
										fullWidthBackground={false}
										onImageChange={handleImageChange}
										projectImages={launchpad.launchpad_img.map(
											(image: string) => ({
												src: image,
												alt: 'Image',
												description: 'Image',
											})
										)}
									/>
								)}
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
										currentStep={steps}
									/>
								</div>
								{launchpad.status === 'pending' && (
									<div className="flex items-center justify-center p-5 gap-3">
										<Button
											onClick={() => onEdit(launchpad.launchpad_id, 'approve')}
											className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
										>
											Approve
										</Button>
										<Button
											onClick={() => onEdit(launchpad.launchpad_id, 'deny')}
											className="bg-red-600 text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
										>
											Deny
										</Button>
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</Modal>
	)
}

export default LaunchpadDetail
