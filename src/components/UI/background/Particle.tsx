'use client'

import { useEffect, useRef } from 'react'
import type React from 'react'

interface Particle {
	x: number
	y: number
	size: number
	speedX: number
	speedY: number
	opacity: number
	color: string
}

interface MotionParticlesProps {
	className?: string
	particleCount?: number
	colorPalette?: string[]
	maxSpeed?: number
	connectParticles?: boolean
}

export const MotionParticles: React.FC<MotionParticlesProps> = ({
	className = '',
	particleCount = 50,
	colorPalette = ['#8132a2', '#6a3093', '#5631b4', '#4a2a9e', '#3c2283'],
	maxSpeed = 0.5,
	connectParticles = true,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const particlesRef = useRef<Particle[]>([])
	const mouseRef = useRef({ x: 0, y: 0, radius: 150 })

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set canvas dimensions
		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth
			canvas.height = canvas.offsetHeight
			initParticles()
		}

		const initParticles = () => {
			particlesRef.current = []
			for (let i = 0; i < particleCount; i++) {
				const size = Math.random() * 3 + 1
				particlesRef.current.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: size,
					speedX: (Math.random() - 0.5) * maxSpeed,
					speedY: (Math.random() - 0.5) * maxSpeed,
					opacity: Math.random() * 0.5 + 0.3,
					color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
				})
			}
		}

		const updateParticles = () => {
			for (const p of particlesRef.current) {
				// Move particles
				p.x += p.speedX
				p.y += p.speedY

				// Bounce off edges
				if (p.x > canvas.width) {
					p.x = 0
				} else if (p.x < 0) {
					p.x = canvas.width
				}

				if (p.y > canvas.height) {
					p.y = 0
				} else if (p.y < 0) {
					p.y = canvas.height
				}

				// Mouse interaction
				const dx = p.x - mouseRef.current.x
				const dy = p.y - mouseRef.current.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < mouseRef.current.radius) {
					const angle = Math.atan2(dy, dx)
					const force =
						(mouseRef.current.radius - distance) / mouseRef.current.radius
					p.speedX += Math.cos(angle) * force * 0.2
					p.speedY += Math.sin(angle) * force * 0.2
				}

				// Limit speed
				const speed = Math.sqrt(p.speedX * p.speedX + p.speedY * p.speedY)
				if (speed > maxSpeed) {
					p.speedX = (p.speedX / speed) * maxSpeed
					p.speedY = (p.speedY / speed) * maxSpeed
				}

				// Add some randomness
				if (Math.random() < 0.01) {
					p.speedX += (Math.random() - 0.5) * 0.2
					p.speedY += (Math.random() - 0.5) * 0.2
				}
			}
		}

		const drawParticles = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// Draw particles
			for (const p of particlesRef.current) {
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
				ctx.fillStyle = p.color
				ctx.globalAlpha = p.opacity
				ctx.fill()
			}

			// Connect particles
			if (connectParticles) {
				ctx.globalAlpha = 0.1
				ctx.strokeStyle = '#ffffff'
				ctx.lineWidth = 0.5

				for (let i = 0; i < particlesRef.current.length; i++) {
					for (let j = i + 1; j < particlesRef.current.length; j++) {
						const p1 = particlesRef.current[i]
						const p2 = particlesRef.current[j]
						const dx = p1.x - p2.x
						const dy = p1.y - p2.y
						const distance = Math.sqrt(dx * dx + dy * dy)

						if (distance < 150) {
							ctx.beginPath()
							ctx.moveTo(p1.x, p1.y)
							ctx.lineTo(p2.x, p2.y)
							ctx.stroke()
						}
					}
				}
			}
		}

		// Mouse move handler
		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			mouseRef.current.x = e.clientX - rect.left
			mouseRef.current.y = e.clientY - rect.top
		}

		// Initialize
		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)
		canvas.addEventListener('mousemove', handleMouseMove)

		// Animation loop
		let animationId: number
		const animate = () => {
			updateParticles()
			drawParticles()
			animationId = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			canvas.removeEventListener('mousemove', handleMouseMove)
			cancelAnimationFrame(animationId)
		}
	}, [particleCount, colorPalette, maxSpeed, connectParticles])

	return (
		<canvas
			ref={canvasRef}
			className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
		/>
	)
}
