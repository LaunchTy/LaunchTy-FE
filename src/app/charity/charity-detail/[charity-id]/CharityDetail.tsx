'use client'

import ProjectHeader from '@/components/project-component/ProjectHeader'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import {
	Modal,
	ModalBody,
	ModalContent,
} from '@/components/UI/modal/AnimatedModal'
import DonateArea from '@/components/UI/shared/DonateArea'
import CustomTabs from '@/components/UI/shared/Tabs'
import Tabs from '@/components/UI/shared/Tabs'
import { projectDetail } from '@/constants/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import HistoryEvidence from '@/components/charity/charity-detail-section/HistoryEvidence'
import AddressInfo from '@/components/charity/charity-detail-section/AddressInfo'
import ProjectImg from '@/public/Project.png'
import DonorsTable from '@/components/charity/charity-detail-section/DonorsTable'
import CountdownTimer from '@/components/UI/countdown/CountdownTimer'
import { useParams } from 'next/navigation'
import { Charity } from '@/interface/interface'
import { NextResponse } from "next/server";
import prismaClient from "@/prisma";
import LoadingModal from '@/components/UI/modal/LoadingModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LockModal from '@/components/UI/modal/LockModal'

// Dummy data for testing
const dummyCharityData: Charity = {
	charity_id: 'dummy-charity-1',
	charity_name: 'Test Charity Organization',
	charity_short_des: 'A test charity organization for development purposes',
	charity_long_des: 'This is a detailed description of our test charity organization. We are dedicated to helping those in need and making a positive impact in our community. Our mission is to provide support and resources to those who need it most.',
	charity_logo: 'https://picsum.photos/200',
	charity_img: [
		'https://picsum.photos/800/600',
		'https://picsum.photos/800/601',
		'https://picsum.photos/800/602'
	],
	charity_start_date: new Date().toISOString(),
	charity_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
	charity_fb: 'https://facebook.com/testcharity',
	charity_x: 'https://twitter.com/testcharity',
	charity_ig: 'https://instagram.com/testcharity',
	charity_website: 'https://testcharity.org',
	charity_token_symbol: 'TEST',
	evidence: [
		'https://picsum.photos/400/300',
		'https://picsum.photos/400/301'
	],
	repre_name: 'John Doe',
	repre_phone: '+1234567890',
	repre_faceid: 'face123',
	totalDonationAmount: 5000,
	donations: [],
	charity_email: 'test@charity.org',
	repre_id: 'dummy-repre-1',
	status: 'approved'
}

const dummyDonations = [
	{
		id: 1,
		user: { user_name: 'Alice Smith' },
		datetime: new Date().toISOString(),
		amount: 1000
	},
	{
		id: 2,
		user: { user_name: 'Bob Johnson' },
		datetime: new Date().toISOString(),
		amount: 750
	},
	{
		id: 3,
		user: { user_name: 'Carol White' },
		datetime: new Date().toISOString(),
		amount: 500
	}
]

const CharityDetail = () => {
	const [backgroundImage, setBackgroundImage] = useState<string>('')
	const [charity, setCharity] = useState<Charity | null>(null)
	const [donations, setDonations] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const [lockOpen, setLockOpen] = useState(false)
	const params = useParams()

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Set a timeout for the API calls
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Request timeout')), 5000)
				);

				// Fetch charity details with timeout
				const charityResponse = await Promise.race([
					fetch(`/api/charity/get/${params['charity-id']}`),
					timeoutPromise
				]) as Response;
				const charityData = await charityResponse.json()
				
				// Fetch donations with timeout
				const donationsResponse = await Promise.race([
					fetch(`/api/donation/get/${params['charity-id']}`),
					timeoutPromise
				]) as Response;
				const donationsData = await donationsResponse.json()

				if (charityData.success) {
					setCharity(charityData.data)
					if (charityData.data.charity_img && charityData.data.charity_img.length > 0) {
						setBackgroundImage(charityData.data.charity_img[0])
					}
				} else {
					console.warn('Using dummy data due to API failure')
					setCharity(dummyCharityData)
					setBackgroundImage(dummyCharityData.charity_img[0])
				}

				if (donationsData.success) {
					setDonations(donationsData.data)
				} else {
					console.warn('Using dummy donations due to API failure')
					setDonations(dummyDonations)
				}
			} catch (error: any) {
				console.error('Error fetching data:', error)
				console.warn('Using dummy data due to error')
				setCharity(dummyCharityData)
				setBackgroundImage(dummyCharityData.charity_img[0])
				setDonations(dummyDonations)
				setErrorCode(error?.response?.status?.toString() || '500')
				setErrorMessage(error?.message || 'An unexpected error occurred')
				setErrorModalOpen(true)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [params['charity-id']])

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}

	if (loading) {
		return <LoadingModal open={loading} onOpenChange={setLoading} />
	}

	if (!charity) {
		return (
			<ErrorModal
				open={true}
				onOpenChange={() => {}}
				errorCode="404"
				errorMessage="Charity not found"
				onRetry={() => window.location.reload()}
			/>
		)
	}

	// Calculate status based on dates
	const now = new Date()
	const startDate = new Date(charity.charity_start_date)
	const endDate = new Date(charity.charity_end_date)
	let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
	if (now < startDate) status = 'upcoming'
	else if (now >= startDate && now <= endDate) status = 'ongoing'

	return (
		<Modal>
			<div className="relative min-h-screen w-full font-exo pb-10">
				<AnimatedBlobs count={6} />

				{/* Full-width background container */}
				<AnimatePresence mode="wait">
					{backgroundImage && (
						<motion.div
							key={backgroundImage}
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.2 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 w-full h-2/3 z-0 bg-cover bg-center scale-110"
							style={{
								backgroundImage: `url(${backgroundImage})`,
								filter: 'blur(15px)',
							}}
						/>
					)}
				</AnimatePresence>

				<div className="relative px-20 pt-48 pb-12 z-10">
					<div className="flex justify-between items-center">
						<ProjectHeader 
							projectDetail={{
								id: charity.charity_id,
								name: charity.charity_name,
								shortDescription: charity.charity_short_des,
								longDescription: charity.charity_long_des,
								logo: charity.charity_logo,
								images: charity.charity_img,
								startDate: charity.charity_start_date,
								endDate: charity.charity_end_date,
								facebook: charity.charity_fb,
								x: charity.charity_x,
								instagram: charity.charity_ig,
								website: charity.charity_website,
								type: 'charity',
								status,
								charity_token_symbol: charity.charity_token_symbol,
								evidence: charity.evidence,
								repre_name: charity.repre_name,
								repre_phone: charity.repre_phone,
								repre_faceid: charity.repre_faceid,
								totalDonationAmount: charity.totalDonationAmount,
								donations: charity.donations
							}} 
						/>
						<CountdownTimer
							endTime={charity.charity_end_date}
						/>
					</div>
				</div>

				<div className="flex items-start justify-center gap-12">
					<div className="w-10/12">
						<ThumbNailCarousel
							projectImages={charity.charity_img.map(img => ({
								src: img,
								alt: charity.charity_name,
								description: charity.charity_name
							}))}
							fullWidthBackground={false}
							onImageChange={handleImageChange}
						/>
						<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-8 pb-16">
							<span className="text-[45px] font-bold">Description</span>
							<span>{charity.charity_long_des}</span>
						</div>
					</div>
				</div>
				<div className="flex items-start justify-center gap-9">
					<div className="w-6/12">
						<div className="h-[500px]">
							<HistoryEvidence
								images={charity.evidence.map((img, index) => ({
									src: img,
									alt: `Charity evidence ${index + 1}`
								}))}
							/>
						</div>
						<AddressInfo
							fields={[
								{
									label: 'Representative Name',
									value: charity.repre_name,
								},
								{
									label: 'Phone',
									value: charity.repre_phone,
								},
								{
									label: 'Status',
									value: status,
								},
							]}
						/>
					</div>
					<div className="w-4/12 h-fit top-12 flex flex-col">
						<div className="h-[500px] flex flex-col gap-5 w-full">
							<DonateArea enabled={true} />
						</div>
						<AddressInfo
							fields={[
								{
									label: 'Total charity raised',
									value: charity.totalDonationAmount?.toString() || '0',
								},
								{
									label: 'Total donors',
									value: charity.donations?.length.toString() || '0',
								},
								{
									label: 'Token Symbol',
									value: charity.charity_token_symbol,
								},
							]}
						/>
					</div>
				</div>
				<div className="flex items-start justify-center gap-12">
					<div className="w-10/12">
						<DonorsTable
							donors={donations.map((donation, index) => ({
								ranking: index + 1,
								name: donation.user?.user_name || 'Anonymous',
								date: new Date(donation.datetime).toISOString().split('T')[0],
								amount: donation.amount,
								currency: 'USD',
							}))}
						/>
					</div>
				</div>
			</div>
			<ErrorModal
				open={errorModalOpen}
				onOpenChange={setErrorModalOpen}
				errorCode={errorCode}
				errorMessage={errorMessage}
				onRetry={() => {
					setErrorModalOpen(false)
					window.location.reload()
				}}
			/>
		</Modal>
	)
}

export default CharityDetail
