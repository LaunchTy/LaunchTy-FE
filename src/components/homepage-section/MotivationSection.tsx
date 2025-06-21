'use client'
import { motion } from 'framer-motion'

const MotivationSection = () => {
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto">
			<div className="h-auto w-full bg-[#261A43] rounded-xl p-20">
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
						Revolutionizing Charity Through Blockchain Technology
					</span>
					<span className="text-[20px] font-light text-center">
						Our platform empowers charitable organizations to launch
						transparent, secure, and efficient fundraising campaigns using
						cutting-edge blockchain technology. Every donation is recorded on an
						immutable ledger, ensuring complete transparency and building trust
						between donors and beneficiaries. We believe that blockchain can
						transform the way charitable giving works, eliminating
						intermediaries, reducing costs, and ensuring that more funds reach
						those who need them most. Join us in creating a more transparent and
						impactful future for charitable giving, where every contribution
						makes a verified difference in the world.
					</span>
				</motion.div>
			</div>
		</section>
	)
}

export default MotivationSection
