'use client'
import Image from 'next/image'
import Education from '@/public/education.svg'
import Water from '@/public/water-faucet.svg'
import Healthcare from '@/public/healthcare.svg'
import Community from '@/public/community.svg'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
const CategorySection = () => {
	const sectionRef = useRef(null)
	const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

	// Animation variants for text elements
	const titleVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.1 + i * 0.1,
				duration: 0.6,
				ease: 'easeOut',
			},
		}),
	}

	const descriptionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.3 + i * 0.1,
				duration: 0.8,
				ease: 'easeOut',
			},
		}),
	}

	const features = [
		{
			image: Education,
			title: 'Education',
			description:
				'Nunc tristique quis leo duis gravida volutpat vitae quam quam. Ultrices urna nec massa commodo id sit diam amet et. Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a. Vitae et fusce purus consectetur',
		},
		{
			image: Water,
			title: 'Clean Water',
			description:
				'Nunc tristique quis leo duis gravida volutpat vitae quam quam. Ultrices urna nec massa commodo id sit diam amet et. Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a. Vitae et fusce purus consectetur',
		},
		{
			image: Healthcare,
			title: 'Healthcare',
			description:
				'Nunc tristique quis leo duis gravida volutpat vitae quam quam. Ultrices urna nec massa commodo id sit diam amet et. Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a. Vitae et fusce purus consectetur',
		},
		{
			image: Community,
			title: 'Community',
			description:
				'Nunc tristique quis leo duis gravida volutpat vitae quam quam. Ultrices urna nec massa commodo id sit diam amet et. Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a. Vitae et fusce purus consectetur',
		},
	]
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto bg-[#44336F] flex items-center justify-center">
			<div
				ref={sectionRef}
				className="flex items-center justify-center gap-16 max-w-[1500px] flex-wrap"
			>
				{features.map((feature, index) => (
					<div key={index} className="flex gap-5 max-w-[300px]">
						<div className="">
							<Image
								src={feature.image || '/placeholder.svg'}
								width={250}
								height={250}
								alt={feature.title}
							/>
						</div>
						<div className="flex flex-col items-start justify-center gap-5">
							<motion.span
								className="text-lg font-bold text-white"
								initial="hidden"
								animate={isInView ? 'visible' : 'hidden'}
								variants={titleVariants}
								custom={index}
							>
								{feature.title}
							</motion.span>
							<motion.span
								className="text-sm text-white"
								initial="hidden"
								animate={isInView ? 'visible' : 'hidden'}
								variants={descriptionVariants}
								custom={index}
							>
								{feature.description}
							</motion.span>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default CategorySection
