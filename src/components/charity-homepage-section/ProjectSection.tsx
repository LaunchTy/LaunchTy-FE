'use client'

import Button from '../UI/button/Button'
import { charityDetail } from '../../constants/utils'
import CharityCard from '../Charity/CharityCard'
import AnimatedBlobs from '../UI/background/AnimatedBlobs'
import { useAnimation, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ProjectSection = () => {
	const sectionRef = useRef<HTMLDivElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)

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

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}
	return (
		<motion.section
			ref={sectionRef}
			variants={containerVariants}
			initial="hidden"
			animate={isVisible ? 'visible' : 'hidden'}
			className="p-20 font-exo relative overflow-hidden"
		>
			<AnimatedBlobs count={6} />
			<div className="flex flex-col gap-10 px-5 py-12 xs:p-10 max-w-7xl mx-auto relative z-10">
				<div className="flex justify-between">
					<span className="text-[45px] font-bold">Latest project</span>
					<Button className="bg-gradient w-36 h-12">More Project</Button>
				</div>
				<div className="max-w-[1300px]">
					<div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3">
						{charityDetail.slice(0, 6).map((charity) => (
							<motion.div
								key={charity.id}
								variants={cardVariants}
								className="h-full"
							>
								<CharityCard charityDetail={charity} />
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</motion.section>
	)
}

export default ProjectSection
