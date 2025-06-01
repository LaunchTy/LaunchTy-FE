'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import CreateCharity from '../../create-charity/createCharity'
import { useCharityStore } from '@/store/charity/CreateCharityStore'

const EditCharity = () => {
	const { charityId } = useParams()

	const {
		resetStore,
		setProjectName,
		setShortDescription,
		setLongDescription,
		setRepresentativeName,
		setPhoneNumber,
		setTokenSupply,
		setSelectedToken,
		setSocialLink,
		setLogo,
		setImages,
		setBackgroundImage,
		setLicenseAndCertification,
		setHistoryEvidence,
		setPersonalId,
		setFaceId,
	} = useCharityStore()

	useEffect(() => {
		resetStore()

		const fetchCharityData = async () => {
			try {
				const dummyData = {
					projectName: 'Hope for Children',
					shortDescription: 'Support education for children in need.',
					longDescription:
						'This project focuses on building schools in rural areas...',
					representativeName: 'Nguyen Thi B',
					phoneNumber: '0987654321',
					tokenSupply: '500000',
					selectedToken: '0xabc123...DEF',
					socialLinks: {
						website: 'https://hopeforchildren.org',
						telegram: 'https://t.me/hopechildren',
						twitter: 'https://twitter.com/hopechildren',
						discord: 'https://discord.gg/hopechildren',
						github: 'https://github.com/hopechildren',
					},
					logo: null,
					images: [],
					backgroundImage: '',
					licenseAndCertification: null,
					historyEvidence: null,
					personalId: null,
					faceId: null,
				}

				setProjectName(dummyData.projectName)
				setShortDescription(dummyData.shortDescription)
				setLongDescription(dummyData.longDescription)
				setRepresentativeName(dummyData.representativeName)
				setPhoneNumber(dummyData.phoneNumber)
				setTokenSupply(dummyData.tokenSupply)
				setSelectedToken(dummyData.selectedToken)

				Object.entries(dummyData.socialLinks).forEach(([key, value]) => {
					setSocialLink(key as keyof typeof dummyData.socialLinks, value)
				})

				setLogo(dummyData.logo)
				setImages(dummyData.images)
				setBackgroundImage(dummyData.backgroundImage)
				setLicenseAndCertification(dummyData.licenseAndCertification)
				setHistoryEvidence(dummyData.historyEvidence)
				setPersonalId(dummyData.personalId)
				setFaceId(dummyData.faceId)
			} catch (error) {
				console.error('Failed to load charity data:', error)
			}
		}

		fetchCharityData()
	}, [charityId, resetStore])

	return (
		<div>
			<CreateCharity isEditing id={charityId as string} />
		</div>
	)
}

export default EditCharity
