'use client'
import { motion } from 'framer-motion'
import Button from '@/components/UI/button/Button'
import { useRef } from 'react'
import Group6 from '@/public/Group6.png'
import Group15 from '@/public/Group15.png'
import Image from 'next/image'

const MotionImage = motion(Image) // wrap Image với motion

const ApplySectionIcon = () => {
	const sectionRef = useRef<HTMLElement>(null)

	const floatTransition = {
		y: {
			repeat: Infinity,
			repeatType: 'mirror',
			duration: 2,
			ease: 'easeInOut',
		},
	}

	return (
		<section
			ref={sectionRef}
			className="p-[100px] font-exo relative overflow-hidden"
		>
			<MotionImage
				src={Group6}
				alt="right-img"
				width={80}
				height={80}
				className="absolute top-10 right-48 -translate-x-[300px] z-10"
				initial={{ y: 0 }}
				animate={{ y: 10 }}
				transition={floatTransition}
			/>
			<MotionImage
				src={Group15}
				alt="left-img"
				width={80}
				height={80}
				className="absolute top-10 left-[250px] z-10"
				initial={{ y: 10 }}
				animate={{ y: 0 }}
				transition={floatTransition}
			/>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
				}}
				viewport={{ margin: '-100px' }}
				className="flex flex-col justify-center items-center gap-5 glass-component-1 rounded-3xl w-full h-auto p-5 border-2 border-gradient-to-br from-pink-500 to-blue-500"
			>
				<div className="flex flex-col items-center font-exo">
					<span className={`text-[55px] font-bold text-center `}>
						Apply for project
					</span>
					<span className={`text-[55px] font-bold text-center`}>
						incubation
					</span>
				</div>
				<span className="text-[20px] font-light text-center py-5 gap-3 [letter-spacing: 0.8rem]">
					If you want to start your project, it will be your perfect choice
				</span>
				<Button className="bg-gradient text-white px-[5rem] py-3 mb-3 rounded-full hover:opacity-90 transition-all duration-300">
					Add Project
				</Button>
			</motion.div>
		</section>
	)
}

export default ApplySectionIcon
