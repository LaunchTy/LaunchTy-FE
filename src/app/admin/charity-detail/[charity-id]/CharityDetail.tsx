'use client'

import ProjectHeader from '@/components/project-component/ProjectHeader'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import StakeArea from '@/components/UI/shared/StakeArea'
import HistoryEvidence from '@/components/charity/charity-detail-section/HistoryEvidence'
import PendingEvidence from '@/components/admin/PendingEvidence'
import AddressInfo from '@/components/charity/charity-detail-section/AddressInfo'
import { Charity } from '@/interface/interface'
import Button from '@/components/UI/button/Button'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DonateArea from '@/components/UI/shared/DonateArea'
import SuccessModal from '@/components/UI/modal/SuccessModal'

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
	const params = useParams()
	const charity_id = params['charity-id']
	const [charity, setCharity] = useState<Charity>({} as Charity)
	const [loading, setLoading] = useState(true)
	const [backgroundImage, setBackgroundImage] = useState<string>('')
	const [steps, setSteps] = useState(2)
	const [hasPendingEvidence, setHasPendingEvidence] = useState(false)
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}
	const [successOpen, setSuccessOpen] = useState(false)

	useEffect(() => {
		if (!charity.charity_start_date || !charity.charity_end_date) return

		const startDate = new Date(charity.charity_start_date)
		const endDate = new Date(charity.charity_end_date)
		const now = new Date()

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

		if (now < startDate) {
			setSteps(0)
		} else if (now >= startDate && now <= endDate) {
			setSteps(1)
		}
	}, [charity.charity_start_date, charity.charity_end_date])

	useEffect(() => {
		if (!charity_id) {
			console.error('Charity ID is not provided')
			return
		}
		const fetchProjects = async () => {
			setLoading(true)
			try {
				const response = await axios.get(
					`/api/admin/charity-detail?charity_id=${charity_id}`
				)
				// console.log('Charity response:', response.data)
				setCharity({
					...response.data.data,
					status_charity: response.data.data.status,
				})
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [charity_id])

	const backgroundImageUrl = charity.charity_img?.[0] || ''

	const onEdit = async (charity_id: string, action: 'approve' | 'deny') => {
		console.log('Editing charity:', charity_id, action)
		try {
			await axios.post('/api/admin/charity-detail/action', {
				charity_id,
				action,
			})
			setSuccessOpen(true)
			window.location.reload()
		} catch (error) {
			console.error(error)
			alert('Failed to update project status')
		}
	}

	const handleEvidenceAction = () => {
		// Refresh the page to show updated evidence
		window.location.reload()
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
									name: charity.charity_name || 'Unknown Project',
									logo: charity.charity_logo || '',
									shortDescription: charity.charity_short_des,
									startDate: charity.charity_start_date,
									endDate: charity.charity_end_date,
								}}
							/>
						</div>

						<div className="flex items-start justify-center gap-12">
							<div className="w-10/12">
								{charity?.charity_img?.length > 0 && (
									<ThumbNailCarousel
										fullWidthBackground={false}
										onImageChange={handleImageChange}
										projectImages={charity.charity_img.map((image: string) => ({
											src: image,
											alt: 'Image',
											description: 'Image',
										}))}
									/>
								)}
								<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-8 pb-16">
									<span className="text-[45px] font-bold">Description</span>
									<span>
										If you have funded this project, we will be in touch to let
										you know when the rewards have started distributing and when
										you can claim them.
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-start justify-center gap-9">
							<div className="w-6/12">
								<div className="h-[500px]">
									<PendingEvidence
										charityId={charity.charity_id}
										onEvidenceAction={handleEvidenceAction}
									/>
								</div>
								<div className="mt-4 h-[500px]">
									<HistoryEvidence
										images={
											charity.evidence?.map((src, idx) => ({
												src,
												alt: `Charity evidence ${idx + 1}`,
											})) || []
										}
									/>
								</div>
								<AddressInfo
									fields={[
										{
											label: 'Respresentative Name',
											value: charity.repre_name || '',
										},
										{
											label: 'Phone',
											value: charity.repre_phone || '',
										},
										{
											label: 'Email',
											value: charity.charity_email || '',
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
											value: '-',
										},
										{
											label: 'Total donors',
											value: '-',
										},
										{
											label: 'Total transaction',
											value: '-',
										},
									]}
								/>
							</div>
						</div>
						{!loading && charity.status_charity === 'pending' && (
							<div className="flex items-center justify-center p-5 gap-3">
								<Button
									onClick={() => onEdit(charity.charity_id, 'approve')}
									className="bg-gradient text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
								>
									Approve
								</Button>
								<Button
									onClick={() => onEdit(charity.charity_id, 'deny')}
									className="bg-red-600 text-white px-9 py-2.5 text-sm hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
								>
									Deny
								</Button>
							</div>
						)}
						<SuccessModal
							open={successOpen}
							onOpenChange={setSuccessOpen}
							showContinueButton={false}
						/>
					</>
				)}
			</div>
		</Modal>
	)
}

export default CharityDetail
