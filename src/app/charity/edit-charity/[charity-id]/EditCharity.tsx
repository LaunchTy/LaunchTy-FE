'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CreateCharity from '../../create-charity/createCharity'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import ErrorModal from '@/components/UI/modal/ErrorModal'

const EditCharity = () => {
	const params = useParams()
	const charityId = params['charity-id'] as string
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	const {
		resetStore,
		setProjectName,
		setShortDescription,
		setLongDescription,
		setRepresentativeName,
		setPhoneNumber,
		setSelectedToken,
		setSocialLink,
		setLogo,
		setImages,
		setBackgroundImage,
		setLicenseAndCertification,
		setHistoryEvidence,
		setPersonalId,
		setFaceId,
		setStartDate,
		setEndDate,
	} = useCharityStore()

	useEffect(() => {
		const fetchCharityData = async () => {
			console.log('Starting to fetch charity data for ID:', charityId)
			if (!charityId) {
				console.error('No charity ID provided')
				return
			}

			try {
				setIsLoading(true)
				setIsDataLoaded(false)
				resetStore()

				console.log('Fetching from:', `/api/charity/get/${charityId}`)
				const response = await fetch(`/api/charity/get/${charityId}`)
				console.log('API Response status:', response.status)

				if (!response.ok) {
					throw new Error(`Failed to fetch charity data: ${response.status}`)
				}

				const data = await response.json()
				console.log('API Response data:', data)

				if (data.success) {
					const charity = data.data
					console.log('Setting charity data:', charity)

					setProjectName(charity.charity_name || '')
					setShortDescription(charity.charity_short_des || '')
					setLongDescription(charity.charity_long_des || '')
					setRepresentativeName(charity.repre_name || '')
					setPhoneNumber(charity.repre_phone || '')
					setSelectedToken(charity.charity_token_symbol || '')

					// Convert dates to datetime-local format (YYYY-MM-DDTHH:MM)
					const formatDateForInput = (dateString: string) => {
						if (!dateString) return ''
						const date = new Date(dateString)
						if (isNaN(date.getTime())) return ''

						// Format date to YYYY-MM-DDTHH:MM without timezone conversion
						const year = date.getFullYear()
						const month = String(date.getMonth() + 1).padStart(2, '0')
						const day = String(date.getDate()).padStart(2, '0')
						const hours = String(date.getHours()).padStart(2, '0')
						const minutes = String(date.getMinutes()).padStart(2, '0')

						return `${year}-${month}-${day}T${hours}:${minutes}`
					}

					setStartDate(formatDateForInput(charity.charity_start_date))
					setEndDate(formatDateForInput(charity.charity_end_date))

					// Set social links
					setSocialLink('facebook', charity.charity_fb || '')
					setSocialLink('twitter', charity.charity_x || '')
					setSocialLink('instagram', charity.charity_ig || '')
					setSocialLink('website', charity.charity_website || '')

					setLogo(charity.charity_logo || null)
					setImages(charity.charity_img || [])
					setLicenseAndCertification(charity.license_certificate || null)
					setHistoryEvidence(charity.evidence || [])
					setFaceId(charity.repre_faceid || null)

					if (charity.charity_img && charity.charity_img.length > 0) {
						setBackgroundImage(charity.charity_img[0])
					}
					console.log('All data set successfully')
					setIsDataLoaded(true)
				} else {
					throw new Error(data.error || 'Failed to fetch charity data')
				}
			} catch (error) {
				console.error('Error in fetchCharityData:', error)
				setError(
					error instanceof Error ? error.message : 'Failed to load charity data'
				)
			} finally {
				console.log('Setting loading to false')
				setIsLoading(false)
			}
		}

		fetchCharityData()
	}, [charityId, resetStore])

	console.log('Render state:', { isLoading, error, isDataLoaded })

	if (isLoading) {
		console.log('Showing loading modal')
		return <LoadingModal open={isLoading} onOpenChange={setIsLoading} />
	}

	if (error) {
		console.log('Showing error modal:', error)
		return (
			<ErrorModal
				open={!!error}
				onOpenChange={() => setError(null)}
				errorMessage={error}
				errorCode="500"
				onRetry={() => {
					setError(null)
					window.location.reload()
				}}
			/>
		)
	}

	if (!isDataLoaded) {
		console.log('Data not loaded yet')
		return <LoadingModal open={true} onOpenChange={() => {}} />
	}

	console.log('Rendering CreateCharity component')
	return (
		<div>
			<CreateCharity isEditing id={charityId} />
		</div>
	)
}

export default EditCharity
