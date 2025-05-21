import Image from 'next/image'
import React from 'react'
// import AnimatedBlobs from '../UI/background/AnimatedBlobs'

const MotivationSection = () => {
	return (
		<section className="p-20 font-exo relative overflow-hidden min-h-auto flex items-center justify-center">
			{/* <AnimatedBlobs /> */}

			<div className="relative z-10 flex items-center justify-center gap-16 max-w-[1500px] glass-component-3 rounded-xl">
				{/* <div className="glass-component-3 h-96 w-96">fdvdfvdfvdf</div> */}
				<div className="flex justify-between p-10 flex-wrap lg:flex-nowrap gap-10">
					<div className="w-1/2 flex flex-col items-start justify-center gap-10 ">
						<span className="text-[65px] font-bold text-pink-500">&quot;</span>
						<span className="text-[45px] font-bold">
							Together, we can change lives for the better
						</span>
						<span>
							Believe in yourself and all that you are. Know that there is
							something inside you that is greater than any obstacle. Challenges
							may come, and failures may test you, but as long as you keep
							moving forward with determination, resilience, and an unwavering
							belief in your abilities, you will achieve more than you ever
							imagined.
						</span>
						<span>Author</span>
					</div>
					<div className="w-1/2">
						<Image
							src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D"
							alt="Image"
							width={900}
							height={500}
							className="w-full h-[550px] rounded-xl object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default MotivationSection
