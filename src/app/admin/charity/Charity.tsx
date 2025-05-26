'use client'
import React from 'react'
import SplitText from '@/components/UI/text-effect/SplitText'
import AdminRowCard from '@/components/admin/AdminRowCard'
import Myproject from '@/public/Myproject.svg' // Adjust the import path as necessary
import { useState } from 'react' // Adjust the import path as necessary
import LeftNavBar from '@/components/admin/LeftNavBar' // Adjust the import path as necessary
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import router from 'next/router' // Adjust the import path as necessary

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
	const [activeMenu, setActiveMenu] = useState('charity')
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
			<div className="flex min-h-screen pt-10 gap-10">
				<div className="pl-20 h-full flex flex-col sticky top-6">
					<LeftNavBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
				</div>

				<div className=" h-full flex flex-col">
					<div className="h-full">
						<AdminRowCard
							adminprojects={visibleProjects}
							showCountdown={true}
							countdownDuration={24}
							className="custom-class"
							onEdit={(projectId) => {
								router.push(`/admin/charity-detail/${projectId}`)
							}}
							path="/admin/charity-detail"
						/>
						{hasMore && (
							<div className="align-center flex flex-col justify-center items-center p-8">
								<Button
									onClick={handleShowMore}
									className="font-bold bg-gradient text-white px-9 py-2.5 hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
								>
									Show more
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
export default Charity
