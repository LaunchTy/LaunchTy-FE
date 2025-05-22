// src/store/launchpad/CreateLaunchpadStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Social links type
export type SocialLinks = {
	website: string
	telegram: string
	twitter: string
	discord: string
	github: string
}

// Data interface for loading existing launchpad
export interface LaunchpadData {
	tokenAddress: string
	totalSupply: number
	selectedStakingToken: string
	selectedStakingTokenSymbol: string
	maxInvestment: number
	minInvestment: number
	softCap: number
	hardCap: number
	projectName: string
	shortDescription: string
	longDescription: string
	socialLinks: SocialLinks
	whitepaper: string
	logo: string | null
	images: string[]
	backgroundImage: string
	startDate: string
	endDate: string
}

// Main store state interface
interface LaunchpadState {
	// Token information
	projectTokenAddress: string
	tokenSupply: string
	selectedStakingToken: string
	selectedStakingTokenSymbol: string

	// Investment limits
	maxStakePerInvestor: string
	minStakePerInvestor: string
	softCap: string
	hardCap: string

	// Project information
	projectName: string
	shortDescription: string
	longDescription: string
	socialLinks: SocialLinks
	whitepaper: string

	// Media
	logo: string | null
	images: string[]
	backgroundImage: string

	// Time settings
	startDate: string
	endDate: string

	// Validation status
	isTokenValidated: boolean

	// Form actions
	setProjectTokenAddress: (address: string) => void
	setTokenSupply: (supply: string) => void
	setSelectedStakingToken: (token: string, symbol: string) => void
	setMaxStakePerInvestor: (amount: string) => void
	setMinStakePerInvestor: (amount: string) => void
	setSoftCap: (amount: string) => void
	setHardCap: (amount: string) => void
	setProjectName: (name: string) => void
	setShortDescription: (description: string) => void
	setLongDescription: (description: string) => void
	setSocialLink: (platform: keyof SocialLinks, url: string) => void
	setWhitepaper: (url: string) => void
	setLogo: (imageBase64: string | null) => void
	addImage: (imageBase64: string) => void
	removeImage: (index: number) => void
	setImages: (images: string[]) => void
	setBackgroundImage: (image: string) => void
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
	setIsTokenValidated: (isValidated: boolean) => void

	// Helpers
	reset: () => void
	validateForm: () => { isValid: boolean; errors: string[] }
	loadLaunchpad: (data: LaunchpadData) => void
}

// Initial state
const initialState = {
	projectTokenAddress: '',
	tokenSupply: '',
	selectedStakingToken: '',
	selectedStakingTokenSymbol: '',
	maxStakePerInvestor: '',
	minStakePerInvestor: '',
	softCap: '',
	hardCap: '',
	projectName: '',
	shortDescription: '',
	longDescription: '',
	socialLinks: {
		website: '',
		telegram: '',
		twitter: '',
		discord: '',
		github: '',
	},
	whitepaper: '',
	logo: null,
	images: [],
	backgroundImage: '',
	startDate: '',
	endDate: '',
	isTokenValidated: false,
}

// Create the store
type SetState = (partial: Partial<LaunchpadState>) => void
export const useLaunchpadStore = create<LaunchpadState>()(
	devtools((set, get) => ({
		...initialState,

		setProjectTokenAddress: (address) => set({ projectTokenAddress: address }),
		setTokenSupply: (supply) => set({ tokenSupply: supply }),
		setSelectedStakingToken: (token, symbol) =>
			set({ selectedStakingToken: token, selectedStakingTokenSymbol: symbol }),

		setMaxStakePerInvestor: (amount) => set({ maxStakePerInvestor: amount }),
		setMinStakePerInvestor: (amount) => set({ minStakePerInvestor: amount }),
		setSoftCap: (amount) => set({ softCap: amount }),
		setHardCap: (amount) => set({ hardCap: amount }),

		setProjectName: (name) => set({ projectName: name }),
		setShortDescription: (description) => set({ shortDescription: description }),
		setLongDescription: (description) => set({ longDescription: description }),
		setSocialLink: (platform, url) =>
			set((state) => ({ socialLinks: { ...state.socialLinks, [platform]: url } })),
		setWhitepaper: (url) => set({ whitepaper: url }),

		setLogo: (imageBase64) => set({ logo: imageBase64 }),
		addImage: (imageBase64) =>
			set((state) => ({ images: [...state.images, imageBase64] })),
		removeImage: (index) =>
			set((state) => ({ images: state.images.filter((_, i) => i !== index) })),
		setImages: (images) => set({ images }),
		setBackgroundImage: (image) => set({ backgroundImage: image }),

		setStartDate: (date) => set({ startDate: date }),
		setEndDate: (date) => set({ endDate: date }),

		setIsTokenValidated: (isValidated) => set({ isTokenValidated: isValidated }),

		reset: () => set(initialState),

		loadLaunchpad: (data) =>
			set({
				projectTokenAddress: data.tokenAddress,
				tokenSupply: data.totalSupply.toString(),
				selectedStakingToken: data.selectedStakingToken,
				selectedStakingTokenSymbol: data.selectedStakingTokenSymbol,
				maxStakePerInvestor: data.maxInvestment.toString(),
				minStakePerInvestor: data.minInvestment.toString(),
				softCap: data.softCap.toString(),
				hardCap: data.hardCap.toString(),
				projectName: data.projectName,
				shortDescription: data.shortDescription,
				longDescription: data.longDescription,
				socialLinks: data.socialLinks,
				whitepaper: data.whitepaper,
				logo: data.logo,
				images: data.images,
				backgroundImage: data.backgroundImage,
				startDate: data.startDate,
				endDate: data.endDate,
			}),

		validateForm: () => {
			const state = get()
			const errors: string[] = []

			if (!state.projectTokenAddress) errors.push('Project token address is required')
			if (!state.isTokenValidated) errors.push('Project token needs to be validated')
			if (!state.tokenSupply) errors.push('Token supply is required')
			if (!state.selectedStakingToken) errors.push('Staking token is required')
			if (!state.maxStakePerInvestor) errors.push('Maximum stake per investor is required')
			if (!state.minStakePerInvestor) errors.push('Minimum stake per investor is required')
			if (!state.softCap) errors.push('Soft cap is required')
			if (!state.hardCap) errors.push('Hard cap is required')
			if (!state.projectName) errors.push('Project name is required')
			if (!state.shortDescription) errors.push('Short description is required')
			if (!state.logo) errors.push('Project logo is required')
			if (!state.startDate) errors.push('Start date is required')
			if (!state.endDate) errors.push('End date is required')

			const numberFields = [
				{ value: state.tokenSupply, name: 'Token supply' },
				{ value: state.maxStakePerInvestor, name: 'Maximum stake per investor' },
				{ value: state.minStakePerInvestor, name: 'Minimum stake per investor' },
				{ value: state.softCap, name: 'Soft cap' },
				{ value: state.hardCap, name: 'Hard cap' },
			]

			numberFields.forEach((field) => {
				if (field.value && isNaN(Number(field.value))) {
					errors.push(`${field.name} must be a valid number`)
				}
			})

			if (state.startDate && state.endDate) {
				const start = new Date(state.startDate)
				const end = new Date(state.endDate)
				if (start >= end) errors.push('End date must be after start date')
				if (start < new Date()) errors.push('Start date cannot be in the past')
			}

			if (Number(state.minStakePerInvestor) > Number(state.maxStakePerInvestor)) {
				errors.push('Minimum stake cannot be greater than maximum stake')
			}
			if (Number(state.softCap) > Number(state.hardCap)) {
				errors.push('Soft cap cannot be greater than hard cap')
			}

			return { isValid: errors.length === 0, errors }
		},
	}))
)
