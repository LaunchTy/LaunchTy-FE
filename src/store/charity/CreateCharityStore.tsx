import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type SocialLinks = {
	website: string
	facebook: string
	twitter: string
	instagram: string
	discord: string
	telegram: string
	github: string
}

interface CharityState {
	// Basic Information
	projectName: string
	shortDescription: string
	longDescription: string
	representativeName: string
	phoneNumber: string

	// Token Information
	tokenSupply: string
	selectedToken: string

	// Social Links
	socialLinks: SocialLinks

	// Media
	logo: string | null
	images: string[]
	backgroundImage: string
	licenseAndCertification: string | null
	historyEvidence: string[]
	personalId: string | null
	faceId: string | null

	// Dates
	startDate: string
	endDate: string

	// Actions
	setProjectName: (name: string) => void
	setShortDescription: (description: string) => void
	setLongDescription: (description: string) => void
	setRepresentativeName: (name: string) => void
	setPhoneNumber: (phone: string) => void
	setTokenSupply: (supply: string) => void
	setSelectedToken: (token: string) => void
	setSocialLink: (platform: keyof SocialLinks, url: string) => void
	setLogo: (imageBase64: string | null) => void
	addImage: (imageBase64: string) => void
	removeImage: (index: number) => void
	setImages: (images: string[]) => void
	setBackgroundImage: (image: string) => void
	setLicenseAndCertification: (image: string | null) => void
	setHistoryEvidence: (images: string[]) => void
	setPersonalId: (image: string | null) => void
	setFaceId: (image: string | null) => void
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
	resetStore: () => void
}

const initialState = {
	projectName: '',
	shortDescription: '',
	longDescription: '',
	representativeName: '',
	phoneNumber: '',
	tokenSupply: '',
	selectedToken: '',
	socialLinks: {
		website: '',
		facebook: '',
		twitter: '',
		instagram: '',
		discord: '',
		telegram: '',
		github: '',
	},
	logo: null,
	images: [],
	backgroundImage: '',
	licenseAndCertification: null,
	historyEvidence: [],
	personalId: null,
	faceId: null,
	startDate: '',
	endDate: '',
}

export const useCharityStore = create<CharityState>()(
	devtools((set) => ({
		...initialState,

		setProjectName: (name) => set({ projectName: name }),
		setShortDescription: (description) =>
			set({ shortDescription: description }),
		setLongDescription: (description) => set({ longDescription: description }),
		setRepresentativeName: (name) => set({ representativeName: name }),
		setPhoneNumber: (phone) => set({ phoneNumber: phone }),
		setTokenSupply: (supply) => set({ tokenSupply: supply }),
		setSelectedToken: (token) => set({ selectedToken: token }),
		setStartDate: (date) => set({ startDate: date }),
		setEndDate: (date) => set({ endDate: date }),

		setSocialLink: (platform, url) =>
			set((state) => ({
				socialLinks: { ...state.socialLinks, [platform]: url },
			})),

		setLogo: (imageBase64) => set({ logo: imageBase64 }),
		addImage: (imageBase64) =>
			set((state) => ({ images: [...state.images, imageBase64] })),
		removeImage: (index) =>
			set((state) => ({
				images: state.images.filter((_, i) => i !== index),
			})),
		setImages: (images) => set({ images }),
		setBackgroundImage: (image) => set({ backgroundImage: image }),

		setLicenseAndCertification: (image) =>
			set({ licenseAndCertification: image }),
		setHistoryEvidence: (images) => set({ historyEvidence: images }),
		setPersonalId: (image) => set({ personalId: image }),
		setFaceId: (image) => set({ faceId: image }),

		resetStore: () => set(initialState),
	}))
)
