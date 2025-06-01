'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import CreateLaunchpad from '../../create-launchpad/CreateLaunchpad'
import { useLaunchpadStore } from '@/store/launchpad/CreateLaunchpadStore'

const EditLaunchpadPage = () => {
	const { launchpadId } = useParams()
	const loadLaunchpad = useLaunchpadStore((state) => state.loadLaunchpad)
	const reset = useLaunchpadStore((state) => state.reset)

	useEffect(() => {
		// Reset any previous state
		reset()

		// TODO: Replace this with actual API call to fetch launchpad data
		const fetchLaunchpadData = async () => {
			try {
				// const response = await fetch(`/api/launchpad/${launchpadId}`)
				// const data = await response.json()
				// loadLaunchpad(data)

				// Temporary dummy data for testing
				const dummyData = {
					tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
					totalSupply: 1000000,
					selectedStakingToken: '0xabcdef...',
					selectedStakingTokenSymbol: 'ABC',
					maxInvestment: 5000,
					minInvestment: 100,
					softCap: 20000,
					hardCap: 50000,
					projectName: 'My Dummy Project',
					shortDescription: 'A brief overview of the dummy project.',
					longDescription:
						'A more detailed description of the dummy project for editing.',
					socialLinks: {
						website: 'https://example.com',
						facebook: 'https://t.me/example',
						twitter: 'https://twitter.com/example',
						instagram: 'https://instagram.gg/example',
						github: 'https://github.com/example',
					},
					whitepaper: 'https://example.com/whitepaper.pdf',
					logo: null,
					images: [],
					backgroundImage: '',
					startDate: '2025-06-01T10:00',
					endDate: '2025-06-07T18:00',
				}
				loadLaunchpad(dummyData)
			} catch (error) {
				console.error('Error fetching launchpad data:', error)
			}
		}

		fetchLaunchpadData()
	}, [launchpadId, loadLaunchpad, reset])

	return (
		<div>
			<CreateLaunchpad isEditing id={launchpadId as string} />
		</div>
	)
}

export default EditLaunchpadPage
