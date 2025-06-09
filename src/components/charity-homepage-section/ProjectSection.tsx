'use client'

import Button from '../UI/button/Button'
import { charityDetail } from '../../constants/utils'
import CharityCard from '../charity/CharityCard'
import AnimatedBlobs from '../UI/background/AnimatedBlobs'
import { useAnimation, motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BaseProject, Charity } from '@/interface/interface'
import axios from 'axios'

const convertCharityToProject = (charity: Charity): BaseProject => {
	const now = new Date()
	const startDate = new Date(charity.charity_start_date)
	const endDate = new Date(charity.charity_end_date)

	let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
	if (now < startDate) status = 'upcoming'
	else if (now >= startDate && now <= endDate) status = 'ongoing'

	return {
		id: charity.charity_id,
		name: charity.charity_name,
		shortDescription: charity.charity_short_des,
		longDescription: charity.charity_long_des,
		logo: charity.charity_logo,
		images:
			Array.isArray(charity.charity_img) && charity.charity_img.length > 0
				? charity.charity_img
				: ['/default-image.png'],
		startDate: charity.charity_start_date,
		endDate: charity.charity_end_date,
		facebook: charity.charity_fb,
		x: charity.charity_x,
		instagram: charity.charity_ig,
		website: charity.charity_website,
		whitepaper: charity.charity_whitepaper,
		type: 'charity',
		totalDonationAmount: charity.totalDonationAmount,
		status,
	}
}

const ProjectSection = () => {
	const sectionRef = useRef<HTMLDivElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)
	const route = useRouter()
	const [showAll, setShowAll] = useState(false)
	const [loading, setLoading] = useState(true)
	const [charity, setCharity] = useState<BaseProject[]>([])

	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(`/api/charity/explore-charity`)
				const charityData: Charity[] = response.data.data
				const projectsData: BaseProject[] = charityData.map(
					convertCharityToProject
				)
				setCharity(projectsData)
				console.log('Fetched projects:', projectsData)
			} catch (err: any) {
				console.error('Failed to load projects:', err)
				setErrorCode(err?.response?.status?.toString() || '500')
				setErrorMessage(
					err?.response?.data?.message ||
						'Failed to fetch projects. Please try again later.'
				)
				setErrorModalOpen(true)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [])

	const displayedProjects = showAll ? charity : charity.slice(0, 6)

	const handleSubmit = () => {
		route.push('/charity/explore-charity')
	}

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return
			const rect = sectionRef.current.getBoundingClientRect()
			const windowHeight =
				window.innerHeight || document.documentElement.clientHeight

			if (rect.top <= windowHeight * 0.8) {
				setIsVisible(true)
			}
		}

		window.addEventListener('scroll', handleScroll)
		handleScroll() // Kiểm tra ngay lần đầu render

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
				staggerChildren: 0.2,
			},
		},
	}

	// const cardVariants = {
	// 	hidden: { opacity: 0, y: 20 },
	// 	visible: {
	// 		opacity: 1,
	// 		y: 0,
	// 		transition: { duration: 0.5 },
	// 	},
	// }
	return (
		<motion.section
			ref={sectionRef}
			variants={containerVariants}
			initial="hidden"
			animate={isVisible ? 'visible' : 'hidden'}
			className="p-20 font-exo relative overflow-hidden  "
		>
			{/* <AnimatedBlobs count={6} /> */}
			<div className="flex flex-col gap-10 px-5 py-12 xs:p-10  mx-auto relative z-10 max-w-[1200px]">
				<div className="flex justify-between">
					<span className="text-[45px] font-bold">Latest project</span>
					<Button className="bg-gradient w-36 h-12" onClick={handleSubmit}>
						More Project
					</Button>
				</div>
				<div className="w-full">
					<AnimatePresence mode="wait">
						<div className="grid grid-cols-1 gap-10 xs:grid-cols-2 md:grid-cols-3 ">
							{displayedProjects.map((charity) => (
								<motion.div
									key={charity.id}
									// variants={cardVariants}
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
			</div>
		</motion.section>
	)
}

export default ProjectSection
