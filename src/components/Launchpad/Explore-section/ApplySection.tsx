'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Button from '@/components/UI/button/Button'
import { Orbitron } from 'next/font/google'
import { useEffect, useRef } from 'react'

const orbitron = Orbitron({ subsets: ['latin'] })

const ApplySection = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 })
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e
			const sectionRect = sectionRef.current?.getBoundingClientRect()

			if (sectionRect) {
				const x = clientX - sectionRect.left
				const y = clientY - sectionRect.top

				mouseX.set(x)
				mouseY.set(y)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	return (
		<section ref={sectionRef} className="p-[100px] font-exo relative overflow-hidden">
			<motion.div
				className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none z-10"
				style={{
					x: smoothX,
					y: smoothY,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						ease: 'easeOut',
					}}
					viewport={{ margin: '-100px' }}
					className="flex flex-col justify-center items-center gap-5 glass-component-1 rounded-3xl w-full h-[420px] p-10 border-2 border-gradient-to-br from-pink-500 to-blue-500"
				>
					<div className="flex flex-col items-center">
						<span className={`text-[55px] font-bold text-center ${orbitron.className}`}>
							Apply for project
						</span>
						<span className={`text-[55px] font-bold text-center ${orbitron.className}`}>
							incubation
						</span>
					</div>
					<span className="text-[20px] font-light text-center py-5 gap-3 [letter-spacing: 0.8rem]">
                        If you want to start your project, it will be your perfect choice
					</span>
                    <Button 
					className="bg-gradient text-white px-[5rem] py-3 mb-3 rounded-full hover:opacity-90 transition-all duration-300">
					Add Project
				</Button>
				</motion.div>
		</section>
	)
}

export default ApplySection
