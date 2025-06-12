'use client'
import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import YourProject from '@/public/YourProject.svg'
import Button from '@/components/UI/button/Button'
import Tab from '@/components/Launchpad/Explore-section/Tab'
import ProjectRowCard from '@/components/Launchpad/MyProject-section/ProjectRowCard'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useAccount } from 'wagmi'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'

const navItems = [
	{ id: 'all', label: 'All Donations' },
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'ongoing', label: 'On Going' },
	{ id: 'finished', label: 'Finished' },
]

const MyDonations = () => {
	const { address } = useAccount()
	const [activeTab, setActiveTab] = useState('all')
	const [visibleCount, setVisibleCount] = useState(6)
	const [donations, setDonations] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [lockOpen, setLockOpen] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	const fetchDonations = async () => {
		try {
			setLoading(true)
			const response = await axios.post('/api/charity/my-donations', {
				wallet_address: address,
			})
			const transformedDonations = response.data.data.map((donation: any) => ({
				id: donation.charity_id,
				name: donation.charity_name,
				images: [donation.charity_logo],
				shortDescription: donation.charity_short_des,
				donationAmount: donation.donation_amount,
				donationDate: donation.donation_date,
				endDate: donation.charity_end_date,
				status: donation.status // This should be calculated based on dates like in ExploreCharity
			}))
			setDonations(transformedDonations)
		} catch (error: any) {
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(
				error?.response?.data?.message ||
					'Something went wrong while fetching your donations.'
			)
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!address) {
			setLockOpen(true)
			return
		}

		setLockOpen(false)
		fetchDonations()
	}, [address])

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 6)
	}

	const filteredDonations = donations.filter((donation) => {
		if (activeTab === 'all') return true
		return donation.status === activeTab
	})

	const visibleDonations = filteredDonations.slice(0, visibleCount)
	const hasMore = visibleCount < filteredDonations.length

	return (
		<div className="min-h-screen font-exo">
			<AnimatedBlobs count={6} />
			{lockOpen ? (
				<LockModal
					open={lockOpen}
					onUnlock={() => setLockOpen(false)}
					canClose={true}
					message="Please connect your wallet to view your donations."
				/>
			) : loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
					<ExploreProject
						title="Your Donations"
						backgroundImage={YourProject}
						searchPlaceholder="Search donations..."
					/>
					<Tab
						navItems={navItems}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
					<ProjectRowCard
						projects={visibleDonations}
						showCountdown={true}
						countdownDuration={24}
						className="custom-class"
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
					<ErrorModal
						open={errorModalOpen}
						onOpenChange={setErrorModalOpen}
						errorCode={errorCode}
						errorMessage={errorMessage}
						onRetry={() => {
							setErrorModalOpen(false)
							setLoading(true)
							fetchDonations()
						}}
					/>
				</>
			)}
		</div>
	)
}

export default MyDonations 