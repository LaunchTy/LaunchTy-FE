import React from 'react'
import SplitText from '@/components/UI/text-effect/SplitText'
import CharityRowCard from '@/components/admin/CharityRowCard'
import Myproject from '@/public/MyProject.svg' // Adjust the import path as necessary
import { useState } from 'react' // Adjust the import path as necessary
import { useEffect } from 'react' // Adjust the import path as necessary

const adminprojects = [
	{
		id: '1',
		title: 'Name 1',
		image: Myproject,
		shortDescription: 'Short description 1',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '2',
		title: 'Name 2',
		image: Myproject,
		shortDescription: 'Short description 2',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '3',
		title: 'Name 3',
		image: Myproject,
		shortDescription: 'Short description 3',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '4',
		title: 'Name 4',
		image: Myproject,
		shortDescription: 'Short description 4',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '5',
		title: 'Name 5',
		image: Myproject,
		shortDescription: 'Short description 5',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '6',
		title: 'Name 6',
		image: Myproject,
		shortDescription: 'Short description 6',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '7',
		title: 'Name 7',
		image: Myproject,
		shortDescription: 'Short description 7',
		tokenSymbol: 'BNB',
		endTime: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
	},
	// Add more if needed
]

const Charity = () => {
	const [visibleCount, setVisibleCount] = useState(6)

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}

	const visibleProjects = adminprojects.slice(0, visibleCount)
	const hasMore = visibleCount < adminprojects.length
	return (
		<div className="min-h-screen font-exo">
			<div className=" text-center z-20 pt-40">
				<SplitText
					text="Admin Page"
					className="text-[64px] font-bold text-white"
					delay={70}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className=" text-center z-20 pt-5 px-56">
				<SplitText
					text="Approve the Project if the charity provides clear and verifiable information about its purpose, ensuring transparency and credibility. Additionally, the fundraising goal and allocation of funds should be explicitly stated to guarantee proper use of donations."
					className="text-sm text-white"
					delay={2}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
		</div>
	)
}
export default Charity
