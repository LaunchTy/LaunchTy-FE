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
import SocialLinks from '@/components/UI/shared/SocialLinks'
import { projectDetail } from '@/constants/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import HistoryEvidence from '@/components/charity/charity-detail-section/HistoryEvidence'
import AddressInfo from '@/components/charity/charity-detail-section/AddressInfo'
import ProjectImg from '@/public/Project.png'
import DonorsTable from '@/components/charity/charity-detail-section/DonorsTable'
import CountdownTimer from '@/components/UI/countdown/CountdownTimer'
import { useParams, useRouter } from 'next/navigation'
import { Charity } from '@/interface/interface'
import { NextResponse } from 'next/server'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LockModal from '@/components/UI/modal/LockModal'
import SuccessModal from '@/components/UI/modal/SuccessModal'
import useCharityTokenAmountStore from '@/store/launchpad/LaunchpadDetailStore'
import { useAccount, useWriteContract } from 'wagmi'
import { chainConfig } from '@/app/config'
import { Address } from 'viem'
import { CharityABI, MockERC20ABI } from '@/app/abi'
import { convertNumToOnChainFormat } from '@/app/utils/decimal'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { publicClient } from '@/app/launchpad/my-launchpad/MyLaunchpad'
import { BigNumber } from 'ethers'
import Button from '@/components/UI/button/Button'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import UploadHistoryEvidence from '@/components/charity/charity-detail-section/UploadHistoryEvidence'
import Folder from '@/components/UI/shared/Folder'
import Image from 'next/image'

const CharityDetail = () => {
	const account = useAccount()
	const userAddress = account.address
	const router = useRouter()
	const [backgroundImage, setBackgroundImage] = useState<string>('')
	const [charity, setCharity] = useState<Charity | null>(null)
	const [donations, setDonations] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')
	const [lockOpen, setLockOpen] = useState(false)
	const [successOpen, setSuccessOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const params = useParams()
	const charityAddress = params['charity-id']
	const { tokenAmount } = useCharityTokenAmountStore()
	const { writeContractAsync: writeDonate, error: donateError } =
		useWriteContract()
	const { writeContractAsync: writeToToken, error: tokenError } =
		useWriteContract()

	const { resetStore } = useCharityStore()
	// const [historyEvidence, setHistoryEvidence] = useState<string[]>([])

	// const convertToBase64 = (file: File): Promise<string> => {
	// 	return new Promise((resolve, reject) => {
	// 		const reader = new FileReader()
	// 		reader.readAsDataURL(file)
	// 		reader.onload = () => resolve(reader.result as string)
	// 		reader.onerror = (error) => reject(error)
	// 	})
	// }

	// const handleHistoryUpload = async (
	// 	e: React.ChangeEvent<HTMLInputElement>
	// ) => {
	// 	if (e.target.files) {
	// 		const files = Array.from(e.target.files)
	// 		const base64Images = await Promise.all(
	// 			files.map((file) => convertToBase64(file))
	// 		)
	// 		setHistoryEvidence([...historyEvidence, ...base64Images])
	// 	}
	// }

	// Monitor contract errors
	useEffect(() => {
		if (tokenError) {
			console.error('Token contract error:', tokenError)
			// Only show error if it's not already being handled in the main function
			if (!loading) {
				setErrorMessage(
					'Token approval failed. Please check your wallet and try again.'
				)
				setErrorCode('500')
				setErrorModalOpen(true)
			}
		}
	}, [tokenError, loading])

	useEffect(() => {
		if (donateError) {
			console.error('Donation contract error:', donateError)
			if (!loading) {
				setErrorMessage(
					'Donation transaction failed. Please check your wallet and try again.'
				)
				setErrorCode('500')
				setErrorModalOpen(true)
			}
		}
	}, [donateError, loading])

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)

				const charityResponse = await fetch(
					`/api/charity/get/${params['charity-id']}`
				)
				const charityData = await charityResponse.json()

				if (charityData.success) {
					setCharity(charityData.data)
					if (charityData.data.charity_img?.length > 0) {
						setBackgroundImage(charityData.data.charity_img[0])
					}

					if (userAddress) {
						const checkOwnerRes = await fetch(
							'/api/charity/check-project-owner',
							{
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									charity_id: charityData.data.charity_id,
									wallet_address: userAddress,
								}),
							}
						)
						const checkOwnerJson = await checkOwnerRes.json()
						setIsOwner(checkOwnerJson.isOwner || false)
					}
					console.log('Charity data fetched successfully:', charityData.data)
				} else {
					throw new Error('Failed to fetch charity data')
				}

				const donationsResponse = await fetch(
					`/api/donation/get/${params['charity-id']}`
				)
				const donationsData = await donationsResponse.json()

				if (donationsData.success) {
					setDonations(donationsData.data)
				} else {
					setDonations([])
				}
			} catch (error: any) {
				console.error('Error fetching data:', error)
				setErrorCode(error?.response?.status?.toString() || '500')
				setErrorMessage(error?.message || 'An unexpected error occurred')
				setErrorModalOpen(true)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [params['charity-id'], userAddress])

	const handleDonate = async () => {
		console.log('Handling donation...')
		if (!userAddress) {
			setErrorMessage('Please connect your wallet to donate')
			setErrorCode('401')
			setErrorModalOpen(true)
			return
		}
		console.log('User addressssssss:', userAddress)
		if (tokenAmount <= 0) {
			setErrorMessage('Please enter a valid donation amount')
			setErrorCode('400')
			setErrorModalOpen(true)
			return
		}
		console.log('Token amount:', tokenAmount)

		// Clear any previous errors
		setErrorModalOpen(false)
		setErrorMessage('')
		setErrorCode('')

		console.log('Starting donation process...')
		console.log('User address:', userAddress)
		console.log('Charity address:', charityAddress)
		console.log('Token amount:', tokenAmount)

		setLoading(true)

		try {
			const acceptedTokenAddress =
				chainConfig.contracts.AcceptedMockERC20.address
			console.log('Accepted token address:', acceptedTokenAddress)
			const allowance = await readContract(publicClient, {
				abi: MockERC20ABI,
				address: acceptedTokenAddress as Address,
				functionName: 'allowance',
				args: [userAddress, charityAddress as Address],
			})

			console.log('Current allowance:', allowance)

			const allowanceBN = BigNumber.from(allowance as string)
			if (allowanceBN.gte(tokenAmount)) {
				console.log('Allowance is sufficient, no need to approve.')
			} else {
				console.log('Insufficient allowance, requesting approval...')
				// Handle token approval with comprehensive error handling
				try {
					const approveHash = await writeToToken({
						abi: MockERC20ABI,
						address: acceptedTokenAddress as Address,
						functionName: 'approve',
						args: [
							charityAddress as Address,
							convertNumToOnChainFormat(tokenAmount, 18),
						],
					})
					console.log('Approval transaction hash:', approveHash)

					const receipt = await waitForTransactionReceipt(publicClient, {
						hash: approveHash,
					})

					if (receipt.status !== 'success') {
						setErrorMessage(
							'Token approval transaction failed. Please try again.'
						)
						setErrorCode('500')
						setErrorModalOpen(true)
						return
					}

					console.log('Token approval successful')
				} catch (approvalError: any) {
					console.error('Token approval error:', approvalError)

					// Handle specific MetaMask errors
					if (
						approvalError.message?.includes('User rejected') ||
						approvalError.message?.includes('user rejected') ||
						approvalError.message?.includes('User denied') ||
						approvalError.message?.includes('user denied')
					) {
						setErrorMessage('Token approval was cancelled by user.')
						setErrorCode('USER_REJECTED')
					} else if (
						approvalError.message?.includes('insufficient funds') ||
						approvalError.message?.includes('Insufficient funds')
					) {
						setErrorMessage(
							'Insufficient funds for token approval. Please check your balance.'
						)
						setErrorCode('INSUFFICIENT_FUNDS')
					} else if (
						approvalError.message?.includes('network') ||
						approvalError.message?.includes('Network')
					) {
						setErrorMessage(
							'Network error. Please check your connection and try again.'
						)
						setErrorCode('NETWORK_ERROR')
					} else if (
						approvalError.message?.includes('gas') ||
						approvalError.message?.includes('Gas')
					) {
						setErrorMessage(
							'Gas estimation failed. Please try again with a different amount.'
						)
						setErrorCode('GAS_ERROR')
					} else {
						setErrorMessage(
							'Token approval failed. Please check your wallet and try again.'
						)
						setErrorCode('500')
					}
					setErrorModalOpen(true)
					return
				}
			}

			// Handle donation transaction with comprehensive error handling
			console.log('Starting donation transaction...')
			try {
				const hash = await writeDonate({
					address: charityAddress as Address,
					abi: CharityABI,
					functionName: 'deposit',
					args: [convertNumToOnChainFormat(tokenAmount, 18)],
				})

				console.log('Donation transaction hash:', hash)

				const receipt = await waitForTransactionReceipt(publicClient, {
					hash,
				})

				console.log('Donation receipt:', receipt)

				if (receipt.status !== 'success') {
					setErrorMessage('Donation transaction failed. Please try again.')
					setErrorCode('500')
					setErrorModalOpen(true)
					console.error(
						'Donation transaction failed. Please try again.',
						donateError
					)
					return
				}

				console.log('Donation transaction successful, recording in database...')

				// Record donation in database
				try {
					const donationResponse = await fetch('/api/donation', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							charity_id: params['charity-id'],
							wallet_address: userAddress,
							amount: tokenAmount,
							tx_hash: hash,
							datetime: new Date().toISOString(),
						}),
					})

					if (!donationResponse.ok) {
						console.error('Failed to record donation in database')
						setErrorMessage(
							'Donation recorded on blockchain but failed to save to database'
						)
						setErrorCode('500')
						setErrorModalOpen(true)
						return
					}

					const donationData = await donationResponse.json()
					console.log('Donation recorded in database:', donationData)

					// Show success modal
					setSuccessOpen(true)
				} catch (dbError) {
					console.error('Database error:', dbError)
					setErrorMessage(
						'Donation recorded on blockchain but failed to save to database'
					)
					setErrorCode('500')
					setErrorModalOpen(true)
					return
				}
			} catch (donationError: any) {
				console.error('Donation transaction error:', donationError)

				// Handle specific MetaMask errors
				if (
					donationError.message?.includes('User rejected') ||
					donationError.message?.includes('user rejected') ||
					donationError.message?.includes('User denied') ||
					donationError.message?.includes('user denied')
				) {
					setErrorMessage('Donation was cancelled by user.')
					setErrorCode('USER_REJECTED')
				} else if (
					donationError.message?.includes('insufficient funds') ||
					donationError.message?.includes('Insufficient funds')
				) {
					setErrorMessage(
						'Insufficient funds for donation. Please check your balance.'
					)
					setErrorCode('INSUFFICIENT_FUNDS')
				} else if (
					donationError.message?.includes('network') ||
					donationError.message?.includes('Network')
				) {
					setErrorMessage(
						'Network error. Please check your connection and try again.'
					)
					setErrorCode('NETWORK_ERROR')
				} else if (
					donationError.message?.includes('gas') ||
					donationError.message?.includes('Gas')
				) {
					setErrorMessage(
						'Gas estimation failed. Please try again with a different amount.'
					)
					setErrorCode('GAS_ERROR')
				} else if (
					donationError.message?.includes('execution reverted') ||
					donationError.message?.includes('reverted')
				) {
					setErrorMessage(
						'Transaction reverted. Please check the charity contract and try again.'
					)
					setErrorCode('CONTRACT_ERROR')
				} else {
					setErrorMessage(
						'Donation transaction failed. Please check your wallet and try again.'
					)
					setErrorCode('500')
				}
				setErrorModalOpen(true)
				return
			}
		} catch (error: any) {
			console.error('General error during donation:', error)
			setErrorMessage('Failed to process donation. Please try again.')
			setErrorCode('500')
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}

	const handleSuccessClose = () => {
		setSuccessOpen(false)
		// Refresh the page to show updated donation data or new evidence
		window.location.reload()
	}

	const handleEdit = () => {
		resetStore()
		router.push(`/charity/edit-charity/${params['charity-id']}`)
	}

	const handleSubmit = async () => {
		try {
			// Redirect to my-charity page instead of reloading
			router.push('/charity/my-charity')
		} catch (error: any) {
			setErrorMessage(error.message || 'Failed to submit charity')
			setErrorCode('500')
			setErrorModalOpen(true)
		}
	}

	const handleUploadSuccess = () => {
		// Show success modal and then refresh the charity data
		setSuccessOpen(true)
	}

	const handleUploadError = (message: string, code: string) => {
		setErrorMessage(message)
		setErrorCode(code)
		setErrorModalOpen(true)
	}

	// Check if user is the owner of this charity
	// console.log('Charity data:', charity)
	// console.log('User address:', userAddress)
	// console.log('Project owner:', charity?.project_owner)
	// console.log(
	// 	'Is owner check:',
	// 	charity?.project_owner?.wallet_address === userAddress
	// )

	// const canEdit =isOwner && (charity?.status === 'pending' || charity?.status === 'approve')
	const canEdit = false
	const canSubmit = isOwner && charity?.status === 'pending'

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

				<SuccessModal open={successOpen} onOpenChange={handleSuccessClose} />

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
								donations: charity.donations,
							}}
						/>
						<CountdownTimer endTime={charity.charity_end_date} />
					</div>
				</div>

				<div className="flex items-start justify-center gap-12">
					<div className="w-10/12">
						<ThumbNailCarousel
							projectImages={charity.charity_img.map((img) => ({
								src: img,
								alt: charity.charity_name,
								description: charity.charity_name,
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
					<div className="w-6/12 h-fit top-12 flex flex-col">
						<div className="h-[500px]">
							<HistoryEvidence
								images={charity.evidence.map((img, index) => ({
									src: img,
									alt: `Charity evidence ${index + 1}`,
								}))}
							/>
						</div>
						<div className="">
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
								className="h-[200px]"
							/>
						</div>
						<div className="">
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
								className="h-[200px]"
							/>
						</div>
					</div>
					<div className="w-4/12 h-fit top-12 flex flex-col gap-3">
						{/* Social Links Section */}
						{(charity.charity_website ||
							charity.charity_fb ||
							charity.charity_x) && (
							<div className="border rounded-xl glass-component-1 text-white w-full p-6">
								<div className="text-xl font-bold font-orbitron mb-4 bg-gradient-to-r bg-white bg-clip-text text-transparent">
									Follow Us
								</div>
								<SocialLinks
									socials={{
										website: charity.charity_website,
										fb: charity.charity_fb,
										x: charity.charity_x,
										ig: charity.charity_ig,
									}}
									iconSize="medium"
									align="start"
								/>
							</div>
						)}
						<div className="flex flex-col gap-2 w-full">
							{isOwner ? (
								<UploadHistoryEvidence
									charityId={charity.charity_id}
									onUploadSuccess={handleUploadSuccess}
									onError={handleUploadError}
								></UploadHistoryEvidence>
							) : (
								<DonateArea
									enabled={charity.status === 'publish'}
									handleDonate={handleDonate}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Action Buttons - Only show for charity owner */}
				{isOwner && (
					<div className="flex justify-center gap-4 mt-8">
						{canEdit && (
							<Button
								onClick={handleEdit}
								className="min-w-[100px] flex items-center justify-center rounded-full 
									bg-gradient py-1.5 px-3.5 
									font-comfortaa font-bold tracking-tight text-white 
									transition-all duration-300 hover:shadow-[0_0_15px_rgba(84,164,242,0.6)] 
									hover:brightness-110 active:brightness-90"
							>
								Edit Information
							</Button>
						)}
						{canSubmit && (
							<Button
								onClick={handleSubmit}
								className="min-w-[100px] flex items-center justify-center rounded-full 
									bg-gradient py-1.5 px-3.5 
									font-comfortaa font-bold tracking-tight text-white 
									transition-all duration-300 hover:shadow-[0_0_15px_rgba(84,164,242,0.6)] 
									hover:brightness-110 active:brightness-90"
							>
								Submit Charity
							</Button>
						)}
					</div>
				)}

				{/* Donors Table - Only show for approved charities */}
				{charity.status === 'approve' && (
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
				)}
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
