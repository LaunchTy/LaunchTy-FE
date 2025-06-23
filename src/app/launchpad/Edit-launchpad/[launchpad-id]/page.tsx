'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CreateLaunchpad from '../../create-launchpad/CreateLaunchpad'
import {
	useLaunchpadStore,
	LaunchpadState,
} from '@/store/launchpad/CreateLaunchpadStore'
import axios from 'axios'
import LoadingModal from '@/components/UI/modal/LoadingModal'

const EditLaunchpadPage = () => {
	const { 'launchpad-id': launchpadId } = useParams()
	const router = useRouter()
	const loadLaunchpad = useLaunchpadStore((state) => state.loadLaunchpad)
	const reset = useLaunchpadStore((state) => state.reset)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const formatDateForInput = (dateStr: string) => {
		if (!dateStr) return ''
		const date = new Date(dateStr)
		const offset = date.getTimezoneOffset()
		const localDate = new Date(date.getTime() - offset * 60 * 1000)
		return localDate.toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
	}

	useEffect(() => {
		// Reset any previous state
		reset()

		const fetchLaunchpadData = async () => {
			if (!launchpadId) {
				setError('Launchpad ID is required')
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				const response = await axios.get(
					`/api/launchpad/launchpad-detail?launchpad_id=${launchpadId}`
				)

				if (!response.data.success) {
					throw new Error(
						response.data.error || 'Failed to fetch launchpad data'
					)
				}

				const launchpadData = response.data.data

				// Map the API data to the store format
				const mappedData: LaunchpadState = {
					projectTokenAddress: launchpadData.token_address || '',
					tokenSupply: launchpadData.total_supply || 0,
					launchpadToken: launchpadData.launchpad_token || '',
					selectedStakingToken: launchpadData.accepted_token_address || '',
					selectedStakingTokenSymbol: '', // This might need to be fetched separately
					maxStakePerInvestor: launchpadData.max_stake || 0,
					minStakePerInvestor: launchpadData.min_stake || 0,
					softCap: launchpadData.soft_cap || 0,
					hardCap: launchpadData.hard_cap || 0,
					projectName: launchpadData.launchpad_name || '',
					shortDescription: launchpadData.launchpad_short_des || '',
					longDescription: launchpadData.launchpad_long_des || '',
					socialLinks: {
						website: launchpadData.launchpad_website || '',
						facebook: launchpadData.launchpad_fb || '',
						twitter: launchpadData.launchpad_x || '',
						instagram: launchpadData.launchpad_ig || '',
					},
					whitepaper: launchpadData.launchpad_whitepaper || '',
					logo: launchpadData.launchpad_logo || null,
					images: launchpadData.launchpad_img || [],
					backgroundImage: '',
					startDate: formatDateForInput(launchpadData.launchpad_start_date),
					endDate: formatDateForInput(launchpadData.launchpad_end_date),
					isTokenValidated: true, // Assuming if it exists in DB, it's validated
					// Add all the setter functions (these will be provided by the store)
					setProjectTokenAddress: () => {},
					setTokenSupply: () => {},
					setLaunchpadToken: () => {},
					setSelectedStakingToken: () => {},
					setMaxStakePerInvestor: () => {},
					setMinStakePerInvestor: () => {},
					setSoftCap: () => {},
					setHardCap: () => {},
					setProjectName: () => {},
					setShortDescription: () => {},
					setLongDescription: () => {},
					setSocialLink: () => {},
					setWhitepaper: () => {},
					setLogo: () => {},
					addImage: () => {},
					removeImage: () => {},
					setImages: () => {},
					setBackgroundImage: () => {},
					setStartDate: () => {},
					setEndDate: () => {},
					setIsTokenValidated: () => {},
					reset: () => {},
					validateForm: () => ({ isValid: false, errors: [] }),
					loadLaunchpad: () => {},
				}

				// Load the mapped data into the store
				loadLaunchpad(mappedData)
				console.log('Launchpad data loaded successfully:', mappedData)
				setError(null)
			} catch (error: any) {
				console.error('Error fetching launchpad data:', error)
				setError(error.message || 'Failed to load launchpad data')
			} finally {
				setLoading(false)
			}
		}

		fetchLaunchpadData()
	}, [launchpadId, loadLaunchpad, reset])

	if (loading) {
		return <LoadingModal open={true} />
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={() => router.back()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Go Back
					</button>
				</div>
			</div>
		)
	}

	return (
		<div>
			<CreateLaunchpad isEditing id={launchpadId as string} />
		</div>
	)
}

export default EditLaunchpadPage
