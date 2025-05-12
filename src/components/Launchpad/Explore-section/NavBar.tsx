'use client'
import { useEffect, useRef, useState } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
} from 'framer-motion'

export type NavBarProps = {
	navItems: { id: string; label: string }[]
	activeTab: string
	onTabChange: (tabId: string) => void
	className?: string
}

const NavBar = ({ navItems, activeTab, onTabChange, className = '' }: NavBarProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)
	const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 })
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 })

	// Scroll animation setup
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start end', 'end start'],
	})

	const borderRadius = useTransform(
		scrollYProgress,
		[0, 0.2],
		['0.375rem', '1rem']
	)

	const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

	const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e
			const sectionRect = sectionRef.current?.getBoundingClientRect()

			if (sectionRect) {
				const x = clientX - sectionRect.left
				const y = clientY - sectionRect.top

				setMousePosition({ x, y })
				mouseX.set(x)
				mouseY.set(y)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	useEffect(() => {
		const activeIdx = navItems.findIndex(item => item.id === activeTab)
		if (tabRefs.current[activeIdx]) {
			const node = tabRefs.current[activeIdx]
			setUnderlineStyle({
				left: node.offsetLeft,
				width: node.offsetWidth,
			})
		}
	}, [activeTab, navItems])

	return (
		<section
			ref={sectionRef}
			className={`p-20 font-exo relative overflow-hidden min-h-auto ${className}`}
		>
			<motion.div
				className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[80px] opacity-70 pointer-events-none z-10"
				style={{
					x: smoothX,
					y: smoothY,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>

			<div className="relative z-20 p-5 border border-gray-300 shadow-md glass-component-2 rounded-full" >
				<div className="relative">
					<nav className="flex items-center justify-center relative w-fit mx-auto">
						{navItems.map((item, idx) => (
							<button
								key={item.id}
								ref={el => { tabRefs.current[idx] = el; }}
								onClick={() => onTabChange(item.id)}
								className={`px-6 py-3 rounded-lg transition-all duration-300 text-white text-xl font-bold bg-transparent ${
									activeTab === item.id
										? 'text-white'
										: 'text-gray-400 hover:text-white'
								} ${idx !== 0 ? 'ml-8' : ''}`}
								style={{ background: 'none', position: 'relative' }}
							>
								{item.label}
							</button>
						))}
						{/* Animated Underline */}
						<span
							className="absolute bottom-0 h-[3px] rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 transition-all duration-300"
							style={{
								left: underlineStyle.left,
								width: underlineStyle.width,
								pointerEvents: 'none',
							}}
						/>
					</nav>
				</div>
			</div>
		</section>
	)
}

export default NavBar