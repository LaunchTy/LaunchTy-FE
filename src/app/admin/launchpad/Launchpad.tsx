'use client'
import React from 'react'
import SplitText from '@/components/UI/text-effect/SplitText'
import AdminRowCard from '@/components/admin/AdminRowCard'
import Myproject from '@/public/Myproject.svg' // Adjust the import path as necessary
import { useEffect, useState } from 'react' // Adjust the import path as necessary
import LeftNavBar from '@/components/admin/LeftNavBar' // Adjust the import path as necessary
import Button from '@/components/UI/button/Button' // Adjust the import path as necessary
import router from 'next/router' // Adjust the import path as necessary
import FilterStatus from '@/components/admin/Filter'
import axios from 'axios' // Adjust the import path as necessary

const Launchpad = () => {
	const [visibleCount, setVisibleCount] = useState(6)
	const [activeMenu, setActiveMenu] = useState('launchpad')
	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}
	const [filter, setFilter] = useState<string>('pending')
	const [projects, setProjects] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const fetchProjects = async () => {
			setLoading(true)
			try {
				const response = await axios.post('/api/admin/launchpad', {
					status: filter,
				})

				const data = response.data
				const formattedProjects = data.projects.map((p: any) => ({
					id: p.launchpad_id,
					title: p.launchpad_name,
					image: p.launchpad_logo,
					shortDescription: p.launchpad_short_des,
					tokenSymbol: p.launchpad_token,
					endTime: p.launchpad_end_date,
					status: p.status,
				}))
				setProjects(formattedProjects)
			} catch (error) {
				console.error('Failed to load projects:', error)
			}
		}
		fetchProjects()
		setLoading(false)
	}, [filter])

	const visibleProjects = projects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length
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

				<div className=" h-full flex flex-col w-full">
					<div className="flex justify-end w-full mb-4">
						<FilterStatus
							filter={filter}
							setFilter={setFilter}
							options={[
								{ value: 'pending', label: 'Pending' },
								{ value: 'approve', label: 'Approved' },
								{ value: 'deny', label: 'Denied' },
							]}
						/>
					</div>
					<div className="h-full">
						{visibleProjects.length > 0 ? (
							<AdminRowCard
								adminprojects={visibleProjects}
								showCountdown={true}
								countdownDuration={24}
								className="custom-class"
								onEdit={async (projectId, action) => {
									if (action === 'approve' || action === 'deny') {
										try {
											await axios.post('/api/admin/launchpad/action', {
												projectId,
												action,
											})
											alert(`Project ${action} successfully`)
											setProjects((prev) =>
												prev.filter((p) => p.id !== projectId)
											)
										} catch (error) {
											console.error(error)
											alert('Failed to update project status')
										}
									} else {
										router.push(`/admin/launchpad-detail/${projectId}`)
									}
								}}
								path="/admin/launchpad-detail"
							/>
						) : (
							<div className=" text-center z-20 pt-5">
								<SplitText
									text="No project available"
									className="text-sm text-white"
									delay={2}
									animationFrom={{
										opacity: 0,
										transform: 'translate3d(0,50px,0)',
									}}
									animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
									threshold={0.2}
									rootMargin="-50px"
								/>
							</div>
						)}
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
export default Launchpad
