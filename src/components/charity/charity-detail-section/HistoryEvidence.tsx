'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HistoryEvidenceProps {
	images: {
		src: string
		alt: string
	}[]
}

const HistoryEvidence = ({ images }: HistoryEvidenceProps) => {
	const [currentSlide, setCurrentSlide] = useState(0)

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % images.length)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
	}
	if (!images || images.length === 0) {
		return (
			<div className="h-[400px] flex items-center justify-center w-full rounded-xl glass-component-1 p-8">
				<span className="text-xl text-gray-500">No evidence available</span>
			</div>
		)
	}

	return (
		<div className="h-[400px] flex flex-col gap-5 w-full rounded-xl glass-component-1 p-8">
			<span className="text-[30px] font-bold">History Evidence</span>

			<div className="relative flex-1 w-full rounded-lg overflow-hidden">
				{/* Main Image */}
				<div className="relative w-full h-full">
					<Image
						src={images[currentSlide].src}
						alt={images[currentSlide].alt}
						fill
						className="object-cover"
					/>
				</div>

				{/* Navigation Arrows */}
				<button
					onClick={prevSlide}
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
				>
					<ChevronLeft size={24} />
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
				>
					<ChevronRight size={24} />
				</button>

				{/* Dots Navigation */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
