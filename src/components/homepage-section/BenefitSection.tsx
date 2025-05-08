'use client'

import { benefits } from '@/constants/utils'
import GridDot from '../UI/background/GridDot'
import { motion } from 'framer-motion'
const BenefitSection = () => {
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto">
			<GridDot />
			<div className="w-full flex flex-col items-center justify-center gap-10 z-20 relative">
				<span className="text-[45px] font-bold">Benefits</span>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
					{benefits.map((benefit, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 1,
								delay: index * 0.1,
								ease: 'easeOut',
							}}
							viewport={{ margin: '-100px' }}
							className="py-5 px-5 rounded-xl border border-gray-300 shadow-md glass-component-1 h-[400px]"
						>
							<h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
							<div className="h-[1px] bg-gradient w-full mb-5"></div>

							<p className="text-lg text-gray-300">{benefit.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default BenefitSection
