'use client'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { useRef, useState, useEffect } from 'react'
import '@splidejs/splide/css'
import ImageBarCarousel from './ImageBarCarousel'
import Image from 'next/image'
import Vector from '@/public/Vector.svg'

interface Image {
	src: string
	alt: string
	description: string
}

interface ImageCarouselProps {
	projectImages?: Image[]
}

const ThumbNailCarousel: React.FC<ImageCarouselProps> = ({ projectImages }) => {
	const [index, setIndex] = useState(0)
	const ref = useRef<Splide>(null)

	// Default images as fallback if no project images are provided
	const defaultImages: Image[] = [
		{
			src: 'https://i.pinimg.com/736x/e9/c7/11/e9c71190d73b76d12f4bf7c03b997a09.jpg',
			alt: 'Beautiful Landscape 1',
			description: 'Description 01',
		},
		{
			src: 'https://i.pinimg.com/736x/5b/0f/99/5b0f990c1f7063aafeb946a011d9ce9e.jpg',
			alt: 'Beautiful Landscape 2',
			description: 'Description 02',
		},
		{
			src: 'https://i.pinimg.com/736x/33/d7/a8/33d7a8acced6aff0818ec4d162255fb2.jpg',
			alt: 'Beautiful Landscape 3',
			description: 'Description 03',
		},
		{
			src: 'https://i.pinimg.com/736x/7c/88/fd/7c88fd5515bb0e91d2982c777bc5d923.jpg',
			alt: 'Something',
			description: 'Something',
		},
	]

	// Use provided project images or default to fallback images
	const images =
		projectImages && projectImages.length > 0 ? projectImages : defaultImages

	useEffect(() => {
		if (ref.current && ref.current.splide) {
			const splideInstance = ref.current.splide

			splideInstance.on('move', (newIndex: number) => {
				setIndex(newIndex)
			})

			return () => {
				splideInstance.destroy()
			}
		}
	}, [])

	const goToSlide = (i: number) => {
		ref.current?.splide?.go(i)
	}

	return (
		<div className="relative w-full z-0">
			<div className="flex flex-col items-center">
				<section
					id="image-carousel"
					className="relative w-full max-w-full mx-auto"
					aria-label="Beautiful Images"
				>
					{/* Custom Arrows */}
					<button
						onClick={() => ref.current?.splide?.go('<')}
						className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10  hover:scale-125  duration-300 rounded-full w-10 p-2  pr-1 "
					>
						<Image
							src={Vector}
							alt="Previous"
							width={16}
							height={16}
							className="rotate-180"
						/>
					</button>
					<button
						onClick={() => ref.current?.splide?.go('>')}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10  hover:scale-125 duration-300 rounded-full w-10 p-2  pl-3"
					>
						<Image src={Vector} alt="Next" width={16} height={16} />
					</button>

					<Splide
						options={{
							type: 'loop',
							perPage: 1,
							gap: '1rem',
							heightRatio: 0.5,
							arrows: false, // Disable default arrows
							pagination: false, // Disable default pagination
						}}
						ref={ref}
					>
						{images.map((image, index) => (
							<SplideSlide key={index}>
								<Image
									src={image.src}
									alt={image.alt}
									width={956}
									height={478}
									className="w-full h-full object-cover rounded-lg shadow-md"
								/>
								<div className="bottom-0 bg-black bg-opacity-50 text-white text-center p-2 w-full">
									{image.description}
								</div>
							</SplideSlide>
						))}
					</Splide>
				</section>

				<ImageBarCarousel
					image={images}
					currentIndex={index}
					goToSlide={goToSlide}
				/>
			</div>
		</div>
	)
}

export default ThumbNailCarousel
