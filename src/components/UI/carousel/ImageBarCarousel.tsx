'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { current } from 'tailwindcss/colors'

interface Image {
	src: string
	alt: string
	description: string
}

interface ImageBarCarouselProps {
	image: Image[]
	currentIndex: number
	goToSlide: (index: number) => void
}

interface ImageSize {
	width: number
	height: number
}

const UPSCALE_LIMIT = 1.0 // Only allow display at up to 100% of natural size

const ImageBarCarousel = ({
	image,
	currentIndex,
	goToSlide,
}: ImageBarCarouselProps) => {
	const [imageSizes, setImageSizes] = useState<ImageSize[]>([])
	const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
	const containerRef = useRef<HTMLDivElement>(null)

	// Track container size changes
	useEffect(() => {
		if (!containerRef.current) return

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect
				setContainerSize({ width, height })
			}
		})

		resizeObserver.observe(containerRef.current)

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	const onLoadingComplete = (index: number, naturalWidth: number, naturalHeight: number) => {
		setImageSizes(prev => {
			const newSizes = [...prev]
			newSizes[index] = { width: naturalWidth, height: naturalHeight }
			return newSizes
		})
	}

	const getVisibleThumbnails = () => {
		const total = image.length

		// Handle edge cases for first and last items
		if (currentIndex === 0) return image.slice(0, 3)
		if (currentIndex == 1) return image.slice(0, 3)
		if (currentIndex === total - 1) return image.slice(total - 3)

		return image.slice(currentIndex - 1, currentIndex + 2)
	}
	//Current index log
	useEffect(() => {
		console.log('Current index:', currentIndex)
	})

	const visibleThumbnails = getVisibleThumbnails()

	return (
		<div className="w-full flex justify-center mt-6">
			<div className="w-full h-full mx-auto">
				<div className="flex flex-row justify-center gap-4">
					{visibleThumbnails.map((img, index) => {
						// Actual index in the full image list
						const realIndex = image.indexOf(img)
						const imageSize = imageSizes[realIndex]
						const isLargeEnough = imageSize && containerSize.width > 0 && containerSize.height > 0 && 
							(imageSize.width >= containerSize.width * UPSCALE_LIMIT || 
							 imageSize.height >= containerSize.height * UPSCALE_LIMIT)

						return (
							<div
								key={realIndex}
								ref={containerRef}
								onClick={() => goToSlide(realIndex)}
								className={`relative cursor-pointer rounded overflow-hidden w-full h-[160px] group transition-all duration-300 bg-gray-100 ${
									realIndex === currentIndex
										? 'ring-2 ring-blue-500'
										: 'opacity-60 hover:opacity-100'
								}`}
							>
								{realIndex === currentIndex && (
									<motion.div
										layoutId="highlight"
										transition={{ type: 'spring', stiffness: 500, damping: 30 }}
										className="absolute top-0 left-0 w-full h-full z-0 rounded-lg bg-blue-500/20"
									/>
								)}

								{/* Blurred background for small images */}
								{!isLargeEnough && (
									<div className="absolute inset-0">
										<Image
											src={img.src}
											alt={img.alt}
											fill
											className="object-cover filter blur-lg scale-110"
											onLoadingComplete={(img) => onLoadingComplete(realIndex, img.naturalWidth, img.naturalHeight)}
										/>
									</div>
								)}

								{/* Main thumbnail image */}
								{isLargeEnough ? (
									// Large enough image - render with fill and object-cover
									<Image
										src={img.src}
										alt={img.alt}
										fill
										className="object-cover relative"
										onLoadingComplete={(img) => onLoadingComplete(realIndex, img.naturalWidth, img.naturalHeight)}
									/>
								) : (
									// Too small image - render pixel-perfect at natural size
									imageSize && (
										<div 
											className="absolute"
											style={{
												left: `calc(50% - ${imageSize.width / 2}px)`,
												top: `calc(50% - ${imageSize.height / 2}px)`,
											}}
										>
											<Image
												src={img.src}
												alt={img.alt}
												width={imageSize.width}
												height={imageSize.height}
												className="object-contain relative"
												onLoadingComplete={(img) => onLoadingComplete(realIndex, img.naturalWidth, img.naturalHeight)}
											/>
										</div>
									)
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default ImageBarCarousel
