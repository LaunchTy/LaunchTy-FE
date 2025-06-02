'use client'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import Stepper, { Step } from '@/components/UI/shared/Stepper'
import SplitText from '@/components/UI/text-effect/SplitText'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Folder from '@/components/UI/shared/Folder'
import {
	useLaunchpadStore,
	LaunchpadState,
} from '@/store/launchpad/CreateLaunchpadStore'
import ImageManager from '@/components/UI/shared/ImageManager'
import { useRouter } from 'next/navigation'

interface CreateLaunchpadProps {
	isEditing?: boolean
	id?: string
}

const CreateLaunchpad = ({ isEditing = false, id }: CreateLaunchpadProps) => {
	const route = useRouter()

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

	const onFinalStepCompleted = () => {
		if (isEditing) {
			// TODO: Call update API here
			route.push(`/launchpad/${id}`)
		} else {
			route.push('/launchpad/create-launchpad/preview')
		}
	}

	return (
		<div className="relative p-36 flex flex-col justify-center items-center font-exo">
			<AnimatedBlobs count={4} />
			{/* --------------------------------------Title & Subtitle----------------------------------------------------- */}
			<div className=" text-center z-20">
				<SplitText
					text="Fill your project ‘s information"
					className="text-[45px] font-bold text-white"
					delay={50}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="mt-[30px] text-center max-w-5xl mx-auto z-20">
				<SplitText
					text="Enter detailed information about your project to help potential stakeholders understand your goals, timeline, and requirements. This comprehensive form is designed to gather all necessary details to showcase your project effectively on our platform "
					className="content-text text-gray-300"
					delay={10}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>

			<div
				className={`mt-14 w-[1200px] h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300 z-20`}
			>
				<Stepper
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
								Token address
							</span>
							<div className="relative w-full">
								<input
									id="projectName"
									value={projectTokenAddress}
									onChange={(e) => setProjectTokenAddress(e.target.value)}
									placeholder="Enter your token address"
									className={`p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full`}
								/>
								{/* {isValidatingToken && (
									<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
										<Spinner heightWidth={5} className="border-blue-400" />
									</div>
								)} */}
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
										<span className=" text-lg">Token</span>

										<div className="relative group">
											<select
												// value={poolData[poolId]?.vTokenAddress || ''}
												// onChange={(e) => {
												// 	const selectedOption =
												// 		e.target.options[e.target.selectedIndex]
												// 	const vTokenAddress = selectedOption.value
												// 	console.log('vToken selected: ', vTokenAddress)
												// 	handleChangePool(
												// 		poolId,
												// 		'vTokenAddress',
												// 		vTokenAddress
												// 	)
												// 	handleChangePool(
												// 		poolId,
												// 		'vTokenSymbol',
												// 		selectedOption.text
												// 	)
												// }}
												className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer"
											>
												<option value="" disabled>
													Select staking token
												</option>
												{/* {currentChainConfig?.tokens.map((token) => (
														<option key={token.address} value={token.address}>
															{token.symbol}
														</option>
													))} */}
											</select>

											{/* Custom dropdown arrow */}
											<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
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
											</div>
										</div>
									</div>
								</div>

								<div className="w-full flex flex-col p-2 gap-3">
									<span className=" text-lg">Project token supply</span>
									<div className="flex gap-5">
										<input
											type="number"
											min={1}
											value={tokenSupply}
											onChange={(e) => setTokenSupply(e.target.value)}
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
											className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    																[&::-webkit-inner-spin-button]:appearance-none 
    																[&::-webkit-outer-spin-button]:appearance-none"
										/>

										<Button className="glass-component-3 rounded-xl">
											Check
										</Button>
									</div>
								</div>

								<div className="w-full flex flex-col gap-3 p-2">
									<span className=" text-lg">Launchpad Token</span>
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
									<span className=" text-lg">Max stake per investor</span>
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
									<span className=" text-lg">Min stake per investor</span>
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
									<div className="w-1/2 flex flex-col gap-3 p-2">
										<span className=" text-lg">Soft cap</span>
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
									<div className="w-1/2 flex flex-col gap-3 p-2">
										<span className=" text-lg">Hard cap</span>
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
									<span className=" text-lg">Project Name</span>
									<input
										type="text"
										value={projectName}
										onChange={(e) => setProjectName(e.target.value)}
										placeholder="Enter project name"
										className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
									/>
								</div>
							</div>

							<div className="w-full flex flex-col p-2 gap-3">
								<span className="text-lg">Short Description</span>
								<div className="flex gap-5">
									<textarea
										id="shortDescription"
										value={shortDescription}
										onChange={(e) => setShortDescription(e.target.value)}
										placeholder="Brief overview of your launchpad (100 words max)"
										className="p-4  text-white rounded-xl glass-component-2 h-32 resize-none w-full text-sm"
									/>
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
								<span className=" text-lg">Long Description</span>
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
								<span className=" text-lg">Socials</span>
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
											onChange={(e) => setSocialLink('website', e.target.value)}
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
											<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
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
											onChange={(e) => setSocialLink('twitter', e.target.value)}
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
											<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
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
									<span className=" text-lg">Whitepaper</span>
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
									<span className="text-lg">Images</span>
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
									<span className="text-lg">Logo</span>
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
									<span className=" text-base sm:text-lg">From</span>
									<input
										type="datetime-local"
										value={
											startDate ? startDate.toISOString().slice(0, 16) : ''
										}
										onChange={(e) => setStartDate(e.target.value)}
										placeholder="Enter start date"
										className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
									/>
								</div>
								<div className="w-1/2 flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
									<span className=" text-base sm:text-lg">To</span>
									<input
										type="datetime-local"
										value={endDate ? endDate.toISOString().slice(0, 16) : ''}
										onChange={(e) => setEndDate(e.target.value)}
										placeholder="Enter start date"
										className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
									/>
								</div>
							</div>
						</motion.div>
					</Step>
				</Stepper>
			</div>
		</div>
	)
}

export default CreateLaunchpad
