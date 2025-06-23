// components/admin/CharityList.tsx
'use client'
import React, { useEffect, useState } from 'react'
import AdminRowCard from '@/components/admin/AdminRowCard'
import FilterStatus from '@/components/admin/Filter'
import axios from 'axios'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import SuccessModal from '@/components/UI/modal/SuccessModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import Button from '@/components/UI/button/Button'
import SplitText from '@/components/UI/text-effect/SplitText'
import router from 'next/router'

const CharityList = () => {
	const [visibleCount, setVisibleCount] = useState(6)
	const [filter, setFilter] = useState<string>('pending')
	const [projects, setProjects] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [successOpen, setSuccessOpen] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	const fetchProjects = async () => {
		setLoading(true)
		try {
			const response = await axios.post('/api/admin/charity', {
				status: filter,
			})
			const data = response.data
			const formattedProjects = data.projects.map((p: any) => ({
				id: p.charity_id,
				title: p.charity_name,
				image: p.charity_logo,
				shortDescription: p.charity_short_des,
				tokenSymbol: p.charity_token_symbol,
				endTime: p.charity_end_date,
				status: p.status,
			}))
			setProjects(formattedProjects)
		} catch (error: any) {
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(
				error?.response?.data?.message ||
					'Something went wrong while fetching your projects.'
			)
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProjects()
	}, [filter])

	const visibleProjects = projects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length

	return (
		<>
			<LoadingModal open={loading} onOpenChange={setLoading} />
			<SuccessModal
				open={successOpen}
				onOpenChange={setSuccessOpen}
				showContinueButton={false}
			/>
			<ErrorModal
				open={errorModalOpen}
				onOpenChange={setErrorModalOpen}
				errorCode={errorCode}
				errorMessage={errorMessage}
				onRetry={fetchProjects}
			/>

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

			{visibleProjects.length > 0 ? (
				<AdminRowCard
					adminprojects={visibleProjects}
					showCountdown={true}
					countdownDuration={24}
					className="custom-class"
					onEdit={async (projectId, action) => {
						if (action === 'approve' || action === 'deny') {
							try {
								await axios.post('/api/admin/charity/action', {
									projectId,
									action,
								})
								setProjects((prev) => prev.filter((p) => p.id !== projectId))
								setSuccessOpen(true)
							} catch (error) {
								console.error(error)
								alert('Failed to update project status')
							}
						} else {
							router.push(`/admin/charity-detail/${projectId}`)
						}
					}}
					path="/admin/charity-detail"
				/>
			) : (
				<div className="text-center z-20 pt-5">
					<SplitText
						text="No project available"
						className="text-sm text-white"
						delay={2}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						threshold={0.2}
						rootMargin="-50px"
					/>
				</div>
			)}

			{hasMore && (
				<div className="align-center flex flex-col justify-center items-center p-8">
					<Button
						onClick={() => setVisibleCount((prev) => prev + 6)}
						className="font-bold bg-gradient text-white px-9 py-2.5 hover:shadow-[0_0_15px_rgba(192,74,241,0.8),0_0_25px_rgba(39,159,232,0.6)] transition-shadow duration-300"
					>
						Show more
					</Button>
				</div>
			)}
		</>
	)
}

export default CharityList
