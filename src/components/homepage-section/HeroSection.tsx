'use client'

import Image from 'next/image'
// import Logo from '@/public/Logo.png'
import Group1 from '@/public/Group(1).png'
import Group2 from '@/public/Group(2).png'
// import SplitText from '../SplitText'
import { motion } from 'framer-motion'
// import { useState } from 'react'
// Removed incorrect Router import
import { useRouter } from 'next/navigation'
import Button from '../UI/button/Button'
import AnimatedBlobs from '../UI/background/AnimatedBlobs'
import { MotionParticles } from '../UI/background/Particle'

const HeroSection = () => {
	const router = useRouter()

	const textAnimation = {
		hidden: { opacity: 0, y: 50 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.1, ease: 'easeOut' },
		}),
	}

	const handleSubmit = () => {
		router.push('/launchpad/explore-project')
	}

	// const [isTitleDone, setIsTitleDone] = useState(false)
	const title = 'A decentralized crowdfunding platform. LaunchTy'
	return (
		<section className="relative overflow-hidden min-h-screen font-exo">
			<AnimatedBlobs count={6} />
			<MotionParticles particleCount={40} connectParticles={true} />
			<div className="flex w-full z-20">
				<div className=" h-screen w-1/2 ">
					<div className="flex flex-col items-start h-full gap-10 justify-center px-16 z-20">
						<motion.span
							initial="hidden"
							animate="visible"
							className="text-[55px] font-bold text-white z-20"
						>
							{title.split('').map((char, index) => {
								// Tính vị trí bắt đầu của từ "LaunchTy"
								const specialStartIndex = title.indexOf('LaunchTy')
								const specialEndIndex = specialStartIndex + 'LaunchTy'.length

								const isSpecial =
									index >= specialStartIndex && index < specialEndIndex

								return (
									<motion.span
										key={index}
										variants={textAnimation}
										custom={index}
										className={isSpecial ? 'font-bold text-[65px]' : ''}
									>
										{char}
									</motion.span>
								)
							})}
						</motion.span>

						<motion.span
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="text-white text-xl z-20"
						// style={{ fontFamily: comfortaa.style.fontFamily }}
						>
							An innovative fusion of an{' '}
							<span className="text-gradient font-bold">IDO Launchpad </span>
							and decentralized{' '}
							<span className="text-gradient font-bold">Charity</span> platform.
							empowering donors to support impactful local causes while fueling
							innovative blockchain projects. Every donation creates positive
							change, merging philanthropy with progress to transform lives
							around the world.
						</motion.span>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
							className="flex gap-5 z-20"
						>
							<Button
								className="w-48 h-12 text-xl bg-gradient"
								onClick={handleSubmit}
							>
								Launchpad
							</Button>
							<Button
								className="w-48 h-12 text-xl bg-gradient"
								onClick={handleSubmit}
							>
								Charity
							</Button>
						</motion.div>
					</div>
				</div>
				<div className="flex justify-center items-center w-1/2 h-screen z-20">
					{/* <div className="absolute top-[700px] left-[850px]  h-64 w-[800px] rounded-full opacity-25 blur-[100px] bg-[#F05550]"></div> */}

					{/* <Image
						className="absolute animate-spin duration-[1ms] ease-linear"
						src={Logo}
						alt="Logo"
					/> */}
					<motion.img
						src={Group1.src}
						alt="Logo"
						// initial={{ opacity: 0, scale: 0.5, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
						transition={{
							duration: 2,
							ease: 'easeOut',
							repeat: Infinity,
						}}
						className=" md:h-[350px] md:w-[350px] lg:h-2/10 lg:w-2/10xl:h-3/10 xl:w-3/10 "
					/>
					<motion.img
						src={Group2.src}
						alt="Logo"
						// initial={{ opacity: 0, scale: 0.5, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
						transition={{
							duration: 4,
							ease: 'easeOut',
							repeat: Infinity,
						}}
						className="md:h-[400px] md:w-[400px] lg:h-2/7 lg:w-2/7 xl:h-3/7 xl:w-3/7"
					/>
					{/* <Image
						className="absolute hover:animate-pulse"
						src={Logo}
						alt="Logo"
					/> */}

					{/* <Image
						className="absolute animate-bounce duration-[3000ms] ease-in-out"
						src={Logo}
						alt="Logo"
					/> */}

					{/* <Image className="absolute" src={Logo} alt="Logo" /> */}
				</div>
			</div>
		</section>
	)
}
export default HeroSection
