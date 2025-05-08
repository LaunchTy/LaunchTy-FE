'use client'
import { motion } from 'framer-motion'

const MotivationSection = () => {
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto">
			<div className="h-auto w-full  bg-[#261A43] rounded-xl p-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						ease: 'easeOut',
					}}
					viewport={{ margin: '-100px' }}
					className="flex flex-col justify-center items-center gap-5 glass-component-1 rounded-xl w-full h-auto p-10"
				>
					<span className="text-[45px] font-bold text-center">
						Lorem Ipsum is simply dummy text of the printing and
						typesetting{' '}
					</span>
					<span className="text-[20px] font-light text-center">
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industrystandard dummy text ever
						since the 1500s, Lorem Ipsum is simply dummy text of the printing
						and typesetting industry. Lorem Ipsum has been the industrys
						standard dummy text ever since the 1500sLorem Ipsum is simply dummy
						text of the printing and typesetting industry. Lorem Ipsum has been
						the industrystandard dummy text ever since the 1500s, Lorem Ipsum is
						simply dummy text of the printing and typesetting industry. Lorem
						Ipsum has been the industrys standard dummy text ever since the
						1500s
					</span>
				</motion.div>
			</div>
		</section>
	)
}

export default MotivationSection
