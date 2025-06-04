'use client'
import { motion } from 'framer-motion'
import Button from '@/components/UI/button/Button'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ApplySectionProps {
	handleAddProject: () => void
}

const ApplySection = ({ handleAddProject }: ApplySectionProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const router = useRouter()
	const handleSubmit = () => {
		router.push('/launchpad/create-launchpad')
	}

	return (
		<section
			ref={sectionRef}
			className="p-[100px] font-exo relative overflow-hidden"
		>
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
				<Button
					onClick={handleAddProject}
					className="bg-gradient text-white px-[5rem] py-3 mb-3 rounded-full hover:opacity-90 transition-all duration-300"
				>
					Add Project
				</Button>
			</motion.div>
		</section>
	)
}

export default ApplySection
