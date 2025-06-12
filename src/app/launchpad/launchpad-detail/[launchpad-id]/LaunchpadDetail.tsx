'use client'

import { LaunchpadABI, MockERC20ABI } from '@/app/abi'
import { chainConfig } from '@/app/config'
import ProjectHeader from '@/components/project-component/ProjectHeader'
import ProjectProgress from '@/components/project-component/ProjectProgress'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import { Modal } from '@/components/UI/modal/AnimatedModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import StakeArea from '@/components/UI/shared/StakeArea'
import { Launchpad } from '@/interface/interface'
import useLaunchpadTokenAmountStore from '@/store/launchpad/LaunchpadDetailStore'
// import { projectDetail } from '@/constants/utils'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { publicClient } from '../../create-launchpad/preview/Preview'
import { convertNumToOnChainFormat } from '@/app/utils/decimal'
import SuccessModal from '@/components/UI/modal/SuccessModal'
interface ModalProjectProps {
	projectDetail: {
		socials: any[]
		tokenPools: {
			id: string
			name: string
		}[]
	}
}
const LaunchpadDetail = () => {
	const params = useParams()
	const launchpad_id = params['launchpad-id']
	const [launchpad, setLaunchpad] = useState<Launchpad>({} as Launchpad)
	const [loading, setLoading] = useState(true)
	const [backgroundImage, setBackgroundImage] = useState<string>('')
	const { tokenAmount } = useLaunchpadTokenAmountStore()
	const { writeContractAsync: writeToToken, error: errorToken } =
		useWriteContract()
	const { writeContractAsync: writeToDeposit, error: errorDeposit } =
		useWriteContract()
	const user = useAccount()
	const userAddress: Address = user.address as Address
	const [steps, setSteps] = useState(2)
	const [successOpen, setSuccessOpen] = useState(false)

	// const { data: allowance, error: allowanceError } = useReadContract({
	// 	abi: LaunchpadABI,
	// 	address: launchpad_id as Address,
	// 	functionName: 'allowance',
	// 	args: [userAddress, launchpad_id as Address],
	// })

	useEffect(() => {
		if (!launchpad.launchpad_start_date || !launchpad.launchpad_end_date) return

		const startDate = new Date(launchpad.launchpad_start_date)
		const endDate = new Date(launchpad.launchpad_end_date)
		const now = new Date()

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

		if (now < startDate) {
			setSteps(0)
		} else if (now >= startDate && now <= endDate) {
			setSteps(1)
		}
	}, [launchpad.launchpad_start_date, launchpad.launchpad_end_date])

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get(
					`/api/launchpad/launchpad-detail?launchpad_id=${launchpad_id}`
				)
				setLaunchpad(response.data.data)
			} catch (error) {
				console.error('Failed to load projects:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchProjects()
	}, [launchpad_id])

	// useEffect(() => {
	// 	const fetchAllowance = async () => {
	// 		if (!launchpad_id || !userAddress) return
	// 		console.log('allowance: ', allowance)
	// 	}
	// 	fetchAllowance()
	// }, [launchpad_id, userAddress])

	useEffect(() => {
		if (errorDeposit) {
			console.error('Deposit transaction failed: ', errorDeposit)
			return
		}
	}, [errorDeposit])

	const handleDeposit = async () => {
		try {
			if (!launchpad_id || !tokenAmount) return
			console.log('Deposit function called with launchpad_id', launchpad_id)
			//log all the below address
			// console.log()
			const acceptedTokenAddress =
				chainConfig.contracts.AcceptedMockERC20.address
			const allowance = await readContract(publicClient, {
				abi: MockERC20ABI,
				address: acceptedTokenAddress as Address,
				functionName: 'allowance',
				args: [userAddress, launchpad_id as Address],
			})

			console.log('allowancesiogseoigh:', allowance)

			// if (!allowance) {
			// 	console.error('Failed to fetch allowance')
			// 	return
			// }
			console.log('eoisfjsoigjiroj')
			const allowanceBN = BigNumber.from(allowance as string)
			if (allowanceBN.gte(tokenAmount)) {
				console.log('Allowance is sufficient, no need to approve.')
			} else {
				// const MockERC20Address = chainConfig.contracts.MockERC20.address
				const approveHash = await writeToToken({
					abi: MockERC20ABI,
					address: acceptedTokenAddress as Address,
					functionName: 'approve',
					args: [
						launchpad_id as Address,
						convertNumToOnChainFormat(tokenAmount, 18),
					],
				})
				console.log('Approval transaction hash:', approveHash)
				console.log('Appoved')

				const receipt = await waitForTransactionReceipt(publicClient, {
					hash: approveHash,
				})

				const newAllowance = await readContract(publicClient, {
					abi: MockERC20ABI,
					address: acceptedTokenAddress as Address,
					functionName: 'allowance',
					args: [userAddress, launchpad_id as Address],
				})

				console.log('New allowance:', newAllowance)

				if (receipt.status !== 'success') {
					console.error('Approval transaction failed')
					console.log('Write to Token error: ', errorToken)
					return
				}
			}
			const hash = await writeToDeposit({
				abi: LaunchpadABI,
				address: launchpad_id as Address,
				functionName: 'deposit',
				args: [convertNumToOnChainFormat(tokenAmount, 18)],
			})

			const depositReceipt = await waitForTransactionReceipt(publicClient, {
				hash,
			})
			console.log('LaunchpadID: ', launchpad_id)
			console.log('Deposit transaction receipt:', depositReceipt)

			if (depositReceipt.status !== 'success') {
				console.error('Deposit transaction failed')
				console.log('Write to Deposit error: ', errorDeposit)
				return
			}

			const userDepositAmount = await readContract(publicClient, {
				abi: LaunchpadABI,
				address: launchpad_id as Address,
				functionName: 'getUserDeposits',
				args: [userAddress],
			})
			console.log('User deposit amount:', userDepositAmount)
			console.log('Deposit transaction hash:', hash)
			// const receipt = await waitForTransactionReceipt(publicClient, {
			// 	hash: hash,
			// })
			// console.log('Deposit transaction receipt:', receipt)

			console.log('Launchpad ID: ', launchpad_id)
			console.log('userAddress: ', userAddress)
			console.log('tokenAmount: ', tokenAmount)
			console.log('hash: ', hash)
			const response = await axios.post('/api/launchpad/deposit', {
				launchpad_id: launchpad_id,
				wallet_address: userAddress,
				deposit_amount: tokenAmount,
				tx_hash: hash,
			})
			console.log('response: ', response)
			if (!response) {
				console.error('Failed to create deposit record in database')
				alert('Failed to create deposit record in database. Please try again.')
				return
			}
		} catch (error) {
			console.error('Error during deposit:', error)
			alert('Error during deposit. Please try again later.')
			// setLoadingOpen(false) // Hide loading modal
		}
		setSuccessOpen(true)
	}

	// Handler for image changes from the carousel
	const handleImageChange = (imageSrc: string) => {
		setBackgroundImage(imageSrc)
	}
	return (
		<Modal>
			<div className="relative min-h-screen w-full font-exo pb-10">
				<AnimatedBlobs count={6} />
				{loading ? (
					<LoadingModal open={loading} onOpenChange={setLoading} />
				) : (
					<>
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
						<SuccessModal open={successOpen} onOpenChange={setSuccessOpen} />
						<div className="relative px-20 pt-48 pb-12 z-10">
							<ProjectHeader
								projectDetail={{
									name: launchpad.launchpad_name || 'Unknown Project',
									logo: launchpad.launchpad_logo || '',
									shortDescription: launchpad.launchpad_short_des,
									startDate: launchpad.launchpad_start_date,
									endDate: launchpad.launchpad_end_date,
								}}
							/>
						</div>

						<div className="flex items-start justify-center gap-12 m-">
							<div className="w-7/12">
								{/* <ThumbNailCarousel
							fullWidthBackground={false}
							onImageChange={handleImageChange}
						/> */}
								{launchpad?.launchpad_img?.length > 0 && (
									<ThumbNailCarousel
										fullWidthBackground={false}
										onImageChange={handleImageChange}
										projectImages={launchpad.launchpad_img.map(
											(image: string) => ({
												src: image,
												alt: 'Image',
												description: 'Image',
											})
										)}
									/>
								)}

								<div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-5">
									<span className="text-[45px] font-bold">Description</span>
									<span>
										{launchpad.launchpad_long_des ||
											'No description available for this project.'}
									</span>
								</div>
							</div>
							{/* Right Sticky Column */}
							<div className="w-3/12 h-fit sticky top-12 flex flex-col">
								<div className="">
									<ProjectProgress
										website={launchpad.launchpad_website}
										fb={launchpad.launchpad_fb}
										x={launchpad.launchpad_x}
										ig={launchpad.launchpad_ig}
										currentStep={steps}
									/>
								</div>
								<div className="">
									<StakeArea handleDeposit={handleDeposit} />
								</div>
							</div>
						</div>
					</>
				)}
				{/* Full-width background container */}

				{/* <ModalBody>
					<ModalContent>
						<div className="z-30">
							<div className="mb-9 font-orbitron font-bold text-white text-center text-xl">
								All Pool
							</div>
							<div className="max-h-96 overflow-x-hidden overflow-y-auto px-4">
								{projectDetail.tokenPools.map((pool) => (
									<div key={pool.id}>
										<motion.div
											className="glass-component-1 h-12 mb-6 rounded-xl flex flex-row items-center hover:bg-gray-700 transition-colors duration-300"
											whileHover={{
												scale: 1.05,
											}}
											whileTap={{ scale: 0.95 }}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="mx-3 bg-white rounded-full w-8 h-8"></div>
											<div className="text-white font-bold">{pool.name}</div>
										</motion.div>
									</div>
								))}
							</div>
						</div>
					</ModalContent>
				</ModalBody> */}
			</div>
		</Modal>
	)
}

export default LaunchpadDetail
