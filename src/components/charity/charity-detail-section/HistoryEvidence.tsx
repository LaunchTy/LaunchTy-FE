'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HistoryEvidenceProps {
	images: {
		src: string
		alt: string
	}[]
}

interface ImageSize {
	width: number
	height: number
}

const UPSCALE_LIMIT = 1.0 // Only allow display at up to 100% of natural size

const HistoryEvidence = ({ images }: HistoryEvidenceProps) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [imageSizes, setImageSizes] = useState<ImageSize[]>([])
	const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
	const containerRef = useRef<HTMLDivElement>(null)

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % images.length)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
	}

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

	if (!images || images.length === 0) {
		return (
			<div className="h-[400px] flex items-center justify-center w-full rounded-xl glass-component-1 p-8">
				<span className="text-xl text-gray-500">No evidence available</span>
			</div>
		)
	}

	const currentImageSize = imageSizes[currentSlide]
	const isLargeEnough = currentImageSize && containerSize.width > 0 && containerSize.height > 0 && 
		(currentImageSize.width >= containerSize.width * UPSCALE_LIMIT || 
		 currentImageSize.height >= containerSize.height * UPSCALE_LIMIT)

	const isMuchSmaller = currentImageSize && containerSize.width > 0 && containerSize.height > 0 &&
		(currentImageSize.width < containerSize.width * 0.5 || 
		 currentImageSize.height < containerSize.height * 0.5)

	return (
		<div className="h-[525px] flex flex-col w-full rounded-xl glass-component-1 p-8">
			<span className="text-[30px] font-bold">History Evidence</span>

			<div 
				ref={containerRef}
				className="relative flex-1 w-full rounded-lg overflow-hidden bg-gray-100"
			>
				{/* Blurred background for small images */}
				{!isLargeEnough && (
					<div className="absolute inset-0">
						<Image
							src={images[currentSlide].src}
							alt={images[currentSlide].alt}
							fill
							className="object-cover filter blur-lg scale-110"
							onLoadingComplete={(img) => onLoadingComplete(currentSlide, img.naturalWidth, img.naturalHeight)}
						/>
					</div>
				)}

				{/* Main image */}
				{isLargeEnough ? (
					// Large enough image - render with fill and object-cover
					<div className="relative w-full h-full">
						<Image
							src={images[currentSlide].src}
							alt={images[currentSlide].alt}
							fill
							className="object-cover"
							onLoadingComplete={(img) => onLoadingComplete(currentSlide, img.naturalWidth, img.naturalHeight)}
						/>
					</div>
				) : (
					// Too small image - render pixel-perfect at natural size
					currentImageSize && (
						<div 
							className="absolute"
							style={{
								left: `calc(50% - ${currentImageSize.width / 2}px)`,
								top: `calc(50% - ${currentImageSize.height / 2}px)`,
							}}
						>
							<Image
								src={images[currentSlide].src}
								alt={images[currentSlide].alt}
								width={currentImageSize.width}
								height={currentImageSize.height}
								className="object-contain"
								onLoadingComplete={(img) => onLoadingComplete(currentSlide, img.naturalWidth, img.naturalHeight)}
							/>
						</div>
					)
				)}

				{/* Low-res badge for very small images */}
				{isMuchSmaller && (
					<div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
						Low Res
					</div>
				)}

				{/* Navigation Arrows */}
				<button
					onClick={prevSlide}
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
				>
					<ChevronLeft size={24} />
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
				>
					<ChevronRight size={24} />
				</button>

				{/* Dots Navigation */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-2 h-2 rounded-full transition-all ${
								currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default HistoryEvidence
