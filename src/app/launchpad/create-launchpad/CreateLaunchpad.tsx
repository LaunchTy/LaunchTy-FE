'use client'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import Stepper, { Step } from '@/components/UI/shared/Stepper'
import SplitText from '@/components/UI/text-effect/SplitText'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Folder from '@/components/UI/shared/Folder'
import { useLaunchpadStore } from '@/store/launchpad/CreateLaunchpadStore'
import ImageManager from '@/components/UI/shared/ImageManager'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import LockModal from '@/components/UI/modal/LockModal'
import { chainConfig, anvilConfig } from '@/app/config'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'

interface CreateLaunchpadProps {
	isEditing?: boolean
	id?: string
}

const CreateLaunchpad = ({ isEditing = false, id }: CreateLaunchpadProps) => {
	const route = useRouter()
	const account = useAccount()
	const [loading, setLoading] = useState(false)
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [errorCode, setErrorCode] = useState('')

	// Add stepper ref to control it programmatically
	const stepperRef = useRef<any>(null)

	// Add validation state
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({})

	const {
		projectTokenAddress,
		setProjectTokenAddress,
		launchpadToken,
		setLaunchpadToken,
		tokenSupply,
		setTokenSupply,
		maxStakePerInvestor,
		setMaxStakePerInvestor,
		minStakePerInvestor,
		setMinStakePerInvestor,
		projectName,
		setProjectName,
		shortDescription,
		setShortDescription,
		longDescription,
		setLongDescription,
		socialLinks,
		setSocialLink,
		whitepaper,
		setWhitepaper,
		logo,
		setLogo,
		images,
		addImage,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		softCap,
		setSoftCap,
		hardCap,
		setHardCap,
		setImages,
		removeImage,
		selectedStakingToken,
		setSelectedStakingToken,
	} = useLaunchpadStore()

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files)
			const base64Images = await Promise.all(
				files.map((file) => convertToBase64(file))
			)
			setImages([...images, ...base64Images])
		}
	}

	const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const base64Logo = await convertToBase64(e.target.files[0])
			setLogo(base64Logo)
		}
	}

	const handleImageDelete = (id: string) => {
		const index = parseInt(id, 10)
		if (!isNaN(index)) {
			removeImage(index)
		}
	}

	const handleLogoDelete = () => {
		setLogo(null)
	}

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	}

	// Helper function to safely convert date to ISO string for datetime-local input
	const formatDateForInput = (date: Date | null): string => {
		if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
			return ''
		}
		return date.toISOString().slice(0, 16)
	}

	// Error message component
	const ErrorMessage = ({ error }: { error?: string }) =>
		error ? <div className="text-red-400 text-sm mt-1">{error}</div> : null

	const onFinalStepCompleted = async () => {
		try {
			// if (!account?.address) {
			// 	setLockOpen(true)
			// 	return
			// }

			// Client-side validation
			const missingFields = []
			if (!projectTokenAddress) missingFields.push('Token Address')
			if (!tokenSupply) missingFields.push('Total Supply')
			if (!launchpadToken) missingFields.push('Launchpad Token')
			if (!maxStakePerInvestor) missingFields.push('Max Stake Per Investor')
			if (!minStakePerInvestor) missingFields.push('Min Stake Per Investor')
			if (!softCap) missingFields.push('Soft Cap')
			if (!hardCap) missingFields.push('Hard Cap')
			if (!projectName) missingFields.push('Launchpad Name')
			if (!logo) missingFields.push('Logo')
			if (!shortDescription) missingFields.push('Short Description')
			if (!longDescription) missingFields.push('Long Description')
			if (!startDate) missingFields.push('Start Date')
			if (!endDate) missingFields.push('End Date')

			if (missingFields.length > 0) {
				throw new Error(
					`Please fill in all required fields: ${missingFields.join(', ')}`
				)
			}

			setLoading(true)

			if (isEditing && id) {
				// Update existing launchpad
				const launchpadData = {
					token_address: projectTokenAddress,
					total_supply: tokenSupply,
					launchpad_token: launchpadToken,
					max_stake: maxStakePerInvestor,
					min_stake: minStakePerInvestor,
					soft_cap: softCap,
					hard_cap: hardCap,
					launchpad_name: projectName,
					launchpad_logo: logo,
					launchpad_short_des: shortDescription,
					launchpad_long_des: longDescription,
					launchpad_fb: socialLinks.facebook || '',
					launchpad_x: socialLinks.twitter || '',
					launchpad_ig: socialLinks.instagram || '',
					launchpad_website: socialLinks.website || '',
					launchpad_whitepaper: whitepaper || '',
					launchpad_img: images,
					launchpad_start_date: startDate,
					launchpad_end_date: endDate,
					wallet_address: account.address,
				}

				const response = await fetch(
					`/api/launchpad/update?launchpad_id=${id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(launchpadData),
					}
				)

				if (!response.ok) {
					const errorData = await response.json()
					console.error('API Error Response:', errorData)
					throw new Error(
						errorData.error ||
							errorData.message ||
							`Failed to update launchpad (Status: ${response.status})`
					)
				}

				const data = await response.json()
				console.log('API Success Response:', data)

				if (!data.success) {
					console.error('API Success False:', data)
					throw new Error(
						data.error || data.message || 'Failed to update launchpad'
					)
				}

				route.push(`/launchpad/launchpad-detail/${id}`)
			} else {
				// Navigate to preview for new launchpad
				route.push('/launchpad/create-launchpad/preview')
			}
		} catch (error: any) {
			console.error(
				`Error ${isEditing ? 'updating' : 'creating'} launchpad:`,
				error
			)
			setErrorCode(error?.response?.status?.toString() || '500')
			setErrorMessage(
				error?.message ||
					`Failed to ${isEditing ? 'update' : 'create'} launchpad`
			)
			setErrorModalOpen(true)
		} finally {
			setLoading(false)
		}
	}

	// Function to reset to step 1
	const resetToStep1 = () => {
		if (stepperRef.current && stepperRef.current.goToStep) {
			stepperRef.current.goToStep(1)
		}
		// Clear validation errors
		setValidationErrors({})
	}

	// Handle retry - reset to step 1
	const handleRetry = () => {
		setErrorModalOpen(false)
		resetToStep1()
	}

	return (
		<div className="relative p-36 flex flex-col justify-center items-center font-exo">
			<AnimatedBlobs count={4} />
			{!account.isConnected ? (
				<div className="h-screen ">
					<LockModal
						// open={lockOpen}
						// onUnlock={() => setLockOpen(false)}
						// canClose={true}
						message="Please connect your wallet to create a charity."
					/>
				</div>
			) : loading ? (
				<LoadingModal open={loading} onOpenChange={setLoading} />
			) : (
				<>
					<div className=" text-center z-20">
						<SplitText
							text={
								isEditing
									? "Edit your project's information"
									: "Fill your project's information"
							}
							className="text-[45px] font-bold text-white"
							delay={50}
							animationFrom={{
								opacity: 0,
								transform: 'translate3d(0,50px,0)',
							}}
							animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
							threshold={0.2}
							rootMargin="-50px"
						/>
					</div>
					<div className="mt-[30px] text-center max-w-5xl mx-auto z-20">
						<SplitText
							text={
								isEditing
									? 'Update your project information to reflect any changes in your goals, timeline, or requirements. All updates will be reviewed by our team before being published.'
									: 'Enter detailed information about your project to help potential stakeholders understand your goals, timeline, and requirements. This comprehensive form is designed to gather all necessary details to showcase your project effectively on our platform'
							}
							className="content-text text-gray-300"
							delay={10}
							animationFrom={{
								opacity: 0,
								transform: 'translate3d(0,50px,0)',
							}}
							animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
							threshold={0.2}
							rootMargin="-50px"
						/>
					</div>

					<div
						className={`mt-14 w-[1200px] h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300 z-20`}
					>
						<Stepper
							ref={stepperRef}
							className="w-full z-20"
							initialStep={1}
							backButtonText="Previous"
							nextButtonText="Next"
							onFinalStepCompleted={onFinalStepCompleted}
						>
							{/* --------------------------------------Token Input And Token Validation----------------------------------------------------- */}
							<Step>
								<div className="flex flex-col items-center justify-center w-full gap-5">
									<span className="text-3xl  text-white mb-4 flex justify-center w-full">
										Token address <span className="ml-3 text-red-400"> *</span>
									</span>
									<div className="relative w-full">
										<input
											id="projectName"
											value={projectTokenAddress}
											onChange={(e) => {
												setProjectTokenAddress(e.target.value)
												if (validationErrors.projectTokenAddress) {
													setValidationErrors((prev) => ({
														...prev,
														projectTokenAddress: '',
													}))
												}
											}}
											placeholder="Enter your token address"
											className={`p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full ${
												validationErrors.projectTokenAddress
													? 'border-2 border-red-400'
													: ''
											}`}
											required
										/>
										<ErrorMessage
											error={validationErrors.projectTokenAddress}
										/>
									</div>
								</div>
							</Step>

							{/* --------------------------------------Create launchpad form----------------------------------------------------- */}

							<Step>
								<div className="">
									{/* <span className="text-xl   flex justify-start w-full">
								Select staking token
							</span> */}

									<motion.div
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className=" flex items-center justify-center flex-col gap-5"
									>
										<div className="w-full flex items-center justify-between p-2 gap-3">
											{/* Chain indicator */}

											<div className="w-full flex flex-col gap-3 relative">
												<span className=" text-lg">
													Token <span className="text-red-400">*</span>
												</span>

												<div className="relative group">
													<input
														id="projectName"
														value="GLMR"
														onChange={(e) => {
															setSelectedStakingToken(
																e.target.value,
																'GLMR symbol'
															)
															if (validationErrors.projectTokenAddress) {
																setValidationErrors((prev) => ({
																	...prev,
																	projectTokenAddress: '',
																}))
															}
														}}
														className={`p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full ${
															validationErrors.selectedStakingToken
																? 'border-2 border-red-400'
																: ''
														}`}
														readOnly
													/>
													{/* <select
														value={selectedStakingToken}
														onChange={(e) => {
															const selectedOption =
																e.target.options[e.target.selectedIndex]
															const tokenAddress = selectedOption.value
															const tokenSymbol = selectedOption.text
															setSelectedStakingToken(tokenAddress, tokenSymbol)
															if (validationErrors.selectedStakingToken) {
																setValidationErrors((prev) => ({
																	...prev,
																	selectedStakingToken: '',
																}))
															}
														}}
														className={`p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer ${
															validationErrors.selectedStakingToken
																? 'border-2 border-red-400'
																: ''
														}`}
														required
													>
														<option value="" disabled>
															Select staking token
														</option>
														{(anvilConfig as any)?.vAssets?.map(
															(token: any) => (
																<option
																	key={token.address}
																	value={token.address}
																>
																	{token.symbol}
																</option>
															)
														)}
													</select> */}

													{/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
														<svg
															className="w-5 h-5 text-white opacity-80"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 9l-7 7-7-7"
															/>
														</svg>
													</div> */}
												</div>
												<ErrorMessage
													error={validationErrors.selectedStakingToken}
												/>
											</div>
										</div>

										<div className="w-full flex flex-col p-2 gap-3">
											<span className=" text-lg">
												Project token supply{' '}
												<span className="text-red-400">*</span>
											</span>
											<div className="flex gap-5">
												<input
													type="number"
													min={1}
													value={tokenSupply}
													onChange={(e) => {
														setTokenSupply(e.target.value)
														if (validationErrors.tokenSupply) {
															setValidationErrors((prev) => ({
																...prev,
																tokenSupply: '',
															}))
														}
													}}
													onKeyDown={(e) => {
														const invalidChars = ['e', 'E', '+', '-', '.', ',']
														if (
															invalidChars.includes(e.key) ||
															(e.key.length === 1 && isNaN(Number(e.key)))
														) {
															e.preventDefault()
														}
													}}
													placeholder="Enter project token supply"
													className={`p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    																[&::-webkit-inner-spin-button]:appearance-none 
    																[&::-webkit-outer-spin-button]:appearance-none ${
																			validationErrors.tokenSupply
																				? 'border-2 border-red-400'
																				: ''
																		}`}
													required
												/>
											</div>
											<ErrorMessage error={validationErrors.tokenSupply} />
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className=" text-lg">
												Launchpad Token{' '}
												<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="text"
												value={launchpadToken}
												onChange={(e) => setLaunchpadToken(e.target.value)}
												placeholder="Enter launchpad token"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    																[&::-webkit-inner-spin-button]:appearance-none 
    																[&::-webkit-outer-spin-button]:appearance-none"
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className=" text-lg">
												Max stake per investor
												<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="number"
												value={maxStakePerInvestor}
												onChange={(e) => setMaxStakePerInvestor(e.target.value)}
												onKeyDown={(e) => {
													const invalidChars = ['e', 'E', '+', '-', '.', ',']
													if (
														invalidChars.includes(e.key) ||
														(e.key.length === 1 && isNaN(Number(e.key)))
													) {
														e.preventDefault()
													}
												}}
												placeholder="Enter max stake"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
											[&::-webkit-inner-spin-button]:appearance-none 
											[&::-webkit-outer-spin-button]:appearance-none"
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className=" text-lg">
												Min stake per investor
												<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="number"
												value={minStakePerInvestor}
												onChange={(e) => setMinStakePerInvestor(e.target.value)}
												onKeyDown={(e) => {
													const invalidChars = ['e', 'E', '+', '-', '.', ',']
													if (
														invalidChars.includes(e.key) ||
														(e.key.length === 1 && isNaN(Number(e.key)))
													) {
														e.preventDefault()
													}
												}}
												placeholder="Enter min stake"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
											[&::-webkit-inner-spin-button]:appearance-none 
											[&::-webkit-outer-spin-button]:appearance-none"
											/>
										</div>
										<div className="w-full flex  gap-3 p-2">
											<div className="w-1/2 flex flex-col gap-3">
												<span className=" text-lg">
													Soft cap<span className="ml-1 text-red-400">*</span>
												</span>
												<input
													type="number"
													value={softCap}
													onChange={(e) => setSoftCap(e.target.value)}
													onKeyDown={(e) => {
														const invalidChars = ['e', 'E', '+', '-', '.', ',']
														if (
															invalidChars.includes(e.key) ||
															(e.key.length === 1 && isNaN(Number(e.key)))
														) {
															e.preventDefault()
														}
													}}
													placeholder="Enter soft cap"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
											[&::-webkit-inner-spin-button]:appearance-none 
											[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
											<div className="w-1/2 flex flex-col gap-3">
												<span className=" text-lg">
													Hard cap<span className="ml-1 text-red-400">*</span>
												</span>
												<input
													type="number"
													value={hardCap}
													onChange={(e) => setHardCap(e.target.value)}
													onKeyDown={(e) => {
														const invalidChars = ['e', 'E', '+', '-', '.', ',']
														if (
															invalidChars.includes(e.key) ||
															(e.key.length === 1 && isNaN(Number(e.key)))
														) {
															e.preventDefault()
														}
													}}
													placeholder="Enter hard cap"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
											[&::-webkit-inner-spin-button]:appearance-none 
											[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
										</div>
									</motion.div>
								</div>
							</Step>

							{/* --------------------------------------Launchpad's information---------------------------------------------------- */}
							<Step>
								{/* <span className="text-xl   flex justify-start w-full">
								Select staking token
							</span> */}

								<motion.div
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className=" flex items-center justify-center flex-col gap-5"
								>
									<div className="w-full flex items-center justify-between p-2 gap-3">
										{/* Chain indicator */}

										<div className="w-full flex flex-col gap-3 relative">
											<span className=" text-lg">
												Project Name <span className="text-red-400">*</span>
											</span>
											<input
												type="text"
												value={projectName}
												onChange={(e) => {
													setProjectName(e.target.value)
													if (validationErrors.projectName) {
														setValidationErrors((prev) => ({
															...prev,
															projectName: '',
														}))
													}
												}}
												placeholder="Enter project name"
												className={`p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none ${
																		validationErrors.projectName
																			? 'border-2 border-red-400'
																			: ''
																	}`}
												required
											/>
											<ErrorMessage error={validationErrors.projectName} />
										</div>
									</div>

									<div className="w-full flex flex-col p-2 gap-3">
										<span className="text-lg">
											Short Description
											<span className="ml-1 text-red-400">*</span>
										</span>
										<div className="flex flex-col gap-2">
											<div className="flex gap-5">
												<textarea
													id="shortDescription"
													value={shortDescription}
													onChange={(e) => {
														const words = e.target.value
															.split(/\s+/)
															.filter((word) => word.length > 0)
														if (words.length <= 100) {
															setShortDescription(e.target.value)
														}
													}}
													placeholder="Brief overview of your launchpad (100 words max)"
													className="p-4 text-white rounded-xl glass-component-2 h-32 resize-none w-full text-sm"
												/>
											</div>
											<div className="text-xs text-gray-400 text-right">
												{
													shortDescription
														.split(/\s+/)
														.filter((word) => word.length > 0).length
												}
												/100 words
											</div>
										</div>
										{/* <div className="text-xs text-gray-400 text-right font-comfortaa">
										{
											createProjectStore.shortDescription
												.trim()
												.split(/\s+/)
												.filter(Boolean).length
										}
										/100 words
									</div> */}
									</div>

									<div className="w-full flex flex-col p-2 gap-3">
										<span className=" text-lg">
											Long Description
											<span className="ml-1 text-red-400">*</span>
										</span>
										<div className="flex gap-5">
											<textarea
												id="longDescription"
												value={longDescription}
												onChange={(e) => setLongDescription(e.target.value)}
												placeholder="Detailed description of your launchpad"
												className="p-4 rounded-xl glass-component-2 text-white  h-56 resize-none w-full text-sm"
											/>
										</div>
									</div>
									<div className="w-full flex flex-col p-2 gap-5">
										<span className=" text-lg">
											Socials<span className="ml-1 text-red-400">*</span>
										</span>
										<div className="flex flex-col gap-5">
											<div className="flex gap-5">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="54"
													height="54"
													fill="currentColor"
													viewBox="0 0 16 16"
												>
													<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.615.338-2.5H8.5zM5.145 12c.138.386.295.744.47 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
												</svg>
												<input
													type="text"
													value={socialLinks.website}
													onChange={(e) =>
														setSocialLink('website', e.target.value)
													}
													placeholder="Enter your website here"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-5">
											<div className="flex gap-5">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="54"
													height="54"
													fill="currentColor"
													viewBox="0 0 16 16"
												>
													<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
												</svg>
												<input
													type="text"
													value={socialLinks.facebook}
													onChange={(e) =>
														setSocialLink('facebook', e.target.value)
													}
													placeholder="Enter your facebook here"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-5">
											<div className="flex gap-5">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="54"
													height="54"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
												</svg>

												<input
													type="text"
													value={socialLinks.twitter}
													onChange={(e) =>
														setSocialLink('twitter', e.target.value)
													}
													placeholder="Enter your twitter here"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-5">
											<div className="flex gap-5">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="54"
													height="54"
													fill="currentColor"
													viewBox="0 0 16 16"
												>
													<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.374.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
												</svg>

												<input
													type="text"
													value={socialLinks.instagram}
													onChange={(e) =>
														setSocialLink('instagram', e.target.value)
													}
													placeholder="Enter your instagram here"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
												/>
											</div>
										</div>
										{/* <div className="flex flex-col gap-5">
									<div className="flex gap-5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="54"
											height="54"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
										</svg>
										<input
											type="text"
											value={socialLinks.instagram}
											onChange={(e) =>
												setSocialLink('instagram', e.target.value)
											}
											placeholder="Enter your github here"
											className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
										/>
									</div>
								</div> */}
									</div>
									<div className="w-full flex items-center justify-between p-2 gap-3">
										{/* Chain indicator */}

										<div className="w-full flex flex-col gap-3 relative">
											<span className=" text-lg">
												Whitepaper<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="text"
												value={whitepaper}
												onChange={(e) => setWhitepaper(e.target.value)}
												placeholder="Enter your whitepaper link here"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
											/>
										</div>
									</div>
									<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Project Images Upload */}
										<div className="w-full flex flex-col gap-3 p-2">
											<span className="text-lg">
												Images<span className="ml-1 text-red-400">*</span>
											</span>
											<div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible">
												<input
													type="file"
													id="projectImageUpload"
													accept="image/*"
													multiple
													onChange={handleImageUpload}
													className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												/>
												<Folder
													color="#00d8ff"
													size={0.8}
													items={images.map((image: string, index: number) => (
														<div
															key={`folder-image-${index}`}
															className="w-full h-full flex items-center justify-center"
														>
															<Image
																key={`image-${index}`}
																src={image}
																alt={`Image ${index + 1}`}
																width={512}
																height={512}
																className="max-w-full max-h-full object-contain rounded"
															/>
														</div>
													))}
													maxItems={3}
												/>
											</div>
											{/* Preview and Delete Options */}
											{/* <div className="flex gap-2 flex-wrap mt-4">
											{images.map((image, index) => (
												<div key={index} className="relative w-20 h-20">
													<Image
														src={image}
														alt={`Preview ${index}`}
														width={80}
														height={80}
														className="object-cover rounded"
													/>
													<button
														onClick={() => handleImageDelete(index)}
														className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
													>
														X
													</button>
												</div>
											))}
										</div> */}
										</div>

										{/* Project Logo Upload */}
										<div className="w-full flex flex-col gap-3 p-2">
											<span className="text-lg">
												Logo<span className="ml-1 text-red-400">*</span>
											</span>
											<div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible">
												<input
													type="file"
													id="projectLogoUpload"
													accept="image/*"
													onChange={handleLogoUpload}
													className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												/>
												<Folder
													color="#00d8ff"
													size={0.8}
													items={
														logo
															? [
																	<div
																		key={'image-${index}'}
																		className="w-full h-full flex items-center justify-center"
																	>
																		<Image
																			src={logo}
																			alt="Logo"
																			width={512}
																			height={512}
																			className="max-w-full max-h-full object-contain rounded"
																		/>
																	</div>,
																]
															: []
													}
													maxItems={1}
												/>
											</div>
										</div>
									</div>

									<div className="w-full ">
										<ImageManager
											images={images.map((base64: string, index: number) => ({
												id: index.toString(),
												base64,
												name: `Image ${index + 1}`,
												type: 'project',
											}))}
											logo={
												logo
													? {
															base64: logo,
															name: 'Project Logo',
														}
													: null
											}
											onDeleteImage={handleImageDelete}
											onDeleteLogo={handleLogoDelete}
											title="Manage Project Media"
											buttonText="Manage Uploaded Images"
											emptyText="No images uploaded yet"
											showLogoTab={true}
											tabs={[
												{
													id: 'project',
													label: 'Project Images',
												},
											]}
											defaultTab="project"
										/>
									</div>

									<div className="w-full flex gap-6">
										<div className="w-1/2 flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className=" text-base sm:text-lg">
												From<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="datetime-local"
												value={startDate}
												onChange={(e) => setStartDate(e.target.value)}
												placeholder="Enter start date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
										<div className="w-1/2 flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className=" text-base sm:text-lg">
												To<span className="ml-1 text-red-400">*</span>
											</span>
											<input
												type="datetime-local"
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
												placeholder="Enter end date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
									</div>
								</motion.div>
							</Step>
						</Stepper>
					</div>
				</>
			)}

			<ErrorModal
				open={errorModalOpen}
				onOpenChange={setErrorModalOpen}
				errorCode={errorCode}
				errorMessage={errorMessage}
				onRetry={handleRetry}
			/>

			{/* --------------------------------------Title & Subtitle----------------------------------------------------- */}
		</div>
	)
}

export default CreateLaunchpad
