'use client'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const getRandomVW = (min: number, max: number) =>
	`${Math.random() * (max - min) + min}vw`
const getRandomVH = (min: number, max: number) =>
	`${Math.random() * (max - min) + min}vh`

const gradients = [
	'from-[#C04AF1] via-[#A566F1] to-[#279FE8]',
	'from-[#279FE8] via-[#6F9FF1] to-[#C04AF1]',
	'from-[#C04AF1] via-[#279FE8] to-[#C04AF1]',
]

const AnimatedBlobs = ({ count = 3 }: { count?: number }) => {
	const blobs = useMemo(() => {
		return Array.from({ length: count }).map(() => ({
			top: getRandomVH(0, 40),
			left: getRandomVW(-30, 50),
			width: `${25 + Math.random() * 5}vw`,
			height: `${25 + Math.random() * 5}vw`,
			blur: `${10 + Math.random()}vw`,
			duration: 6 + Math.random() * 4,
			dx: 5 + Math.random() * 10,
			dy: Math.random() > 0.5 ? 5 : 0,
			gradient: gradients[Math.floor(Math.random() * gradients.length)],
		}))
	}, [count])

	return (
		<>
			{blobs.map((blob, index) => (
				<motion.div
					key={index}
					className={`absolute rounded-full opacity-20 z-0 bg-gradient-to-r ${blob.gradient}`}
					style={{
						top: blob.top,
						left: blob.left,
						width: blob.width,
						height: blob.height,
						filter: `blur(${blob.blur})`,
					}}
					animate={{
						x: [`-${blob.dx}vw`, `${blob.dx}vw`, `-${blob.dx}vw`],
						y:
							blob.dy > 0
								? [`-${blob.dy}vh`, `${blob.dy}vh`, `-${blob.dy}vh`]
								: undefined,
					}}
					transition={{
						duration: blob.duration,
						repeat: Infinity,
						repeatType: 'mirror',
						ease: 'easeInOut',
					}}
				/>
			))}
		</>
	)
}

export default AnimatedBlobs
