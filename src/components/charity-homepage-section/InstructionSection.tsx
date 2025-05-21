'use client'
import GridDot from '../UI/background/GridDot'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
const InstructionSection = () => {
	const sectionRef = useRef(null)
	const imageRef = useRef(null)
	const headingRef = useRef(null)
	const paragraphRef = useRef(null)
	const stepsRef = useRef(null)

	const isImageInView = useInView(imageRef, { once: true, amount: 0.5 })
	const isHeadingInView = useInView(headingRef, { once: true, amount: 0.5 })
	const isParagraphInView = useInView(paragraphRef, { once: true, amount: 0.5 })
	const isStepsInView = useInView(stepsRef, { once: true, amount: 0.5 })
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto flex items-center justify-center">
			<GridDot />
			<div
				ref={sectionRef}
				className="w-full flex flex-col md:flex-row items-center justify-center flex-wrap xl:flex-nowrap gap-10 z-20 relative max-w-[1500px] py-16 "
			>
				<motion.div
					ref={imageRef}
					initial={{ opacity: 0, x: -50 }}
					animate={
						isImageInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
					}
					transition={{ duration: 0.8 }}
					className="w-full md:w-1/2"
				>
					<Image
						src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D"
						alt="Image"
						width={900}
						height={500}
						className="w-full h-[550px] rounded-xl object-cover"
					/>
				</motion.div>

				<div className="w-full md:w-1/2 xl:h-[550px] h-[780px] glass-component-1 rounded-xl p-10 flex flex-col items-start justify-center gap-10">
					<motion.div
						ref={headingRef}
						className="text-[45px] font-bold"
						initial={{ opacity: 0, y: 20 }}
						animate={
							isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
						}
						transition={{ duration: 0.7 }}
					>
						<TextReveal
							text="Transforming Good Intentions into Good Actions"
							inView={isHeadingInView}
						/>
					</motion.div>

					<motion.span
						ref={paragraphRef}
						className="text-sm"
						initial={{ opacity: 0 }}
						animate={isParagraphInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
					>
						Nunc tristique quis leo duis gravida volutpat vitae quam quam.
						Ultrices urna nec massa commodo id sit diam amet et. Libero dictum
						ut purus ut vel sit egestas. Ut ac mattis senectus ac suspendisse
						vitae vel nulla eleifend. Est eros facilisi aenean nisl a. Vitae et
						fusce purus consectetur
					</motion.span>

					<motion.div
						ref={stepsRef}
						className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={
							isStepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
						}
						transition={{ duration: 0.7 }}
					>
						<div>
							<StepItem
								number={1}
								text="Choose your cause"
								delay={0}
								inView={isStepsInView}
							/>
							<StepItem
								number={2}
								text="Connect wallet on our website"
								delay={0.15}
								inView={isStepsInView}
							/>
						</div>
						<div>
							<StepItem
								number={3}
								text="Donate the amount you like"
								delay={0.3}
								inView={isStepsInView}
							/>
							<StepItem
								number={4}
								text="Stay tuned about cause"
								delay={0.45}
								inView={isStepsInView}
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

function StepItem({
	number,
	text,
	delay,
	inView,
}: {
	number: number
	text: string
	delay: number
	inView: boolean
}) {
	return (
		<motion.div
			className="w-full h-full flex gap-5 mb-4"
			initial={{ opacity: 0, x: -20 }}
			animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
			transition={{ duration: 0.5, delay: delay }}
			whileHover={{ x: 5 }}
		>
			<motion.div
				className="rounded-full w-5 h-5 bg-[#D45AC4] flex items-center justify-center text-white text-xs"
				whileHover={{ scale: 1.2 }}
				transition={{ type: 'spring', stiffness: 400, damping: 10 }}
			>
				{number}
			</motion.div>
			<span>{text}</span>
		</motion.div>
	)
}

function TextReveal({ text, inView }: { text: string; inView: boolean }) {
	const words = text.split(' ')

	const container = {
		hidden: { opacity: 0 },
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
		}),
	}

	const child = {
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
		hidden: {
			opacity: 0,
			y: 20,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
	}

	return (
		<motion.div
			style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
			variants={container}
			initial="hidden"
			animate={inView ? 'visible' : 'hidden'}
		>
			{words.map((word, index) => (
				<motion.span
					key={index}
					variants={child}
					style={{ marginRight: '0.25em' }}
				>
					{word}
				</motion.span>
			))}
		</motion.div>
	)
}

export default InstructionSection
