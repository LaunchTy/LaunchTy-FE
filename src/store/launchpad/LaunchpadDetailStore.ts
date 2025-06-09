import { create } from "zustand";

interface LaunchpadDetailState {
	tokenAmount: number;
	setTokenAmount: (amount: number) => void;
}

const useLaunchpadTokenAmountStore = create<LaunchpadDetailState>((set) => ({
	tokenAmount: 0, // Default value for tokenAmount
	setTokenAmount: (amount) => set({ tokenAmount: amount }),
}));

export default useLaunchpadTokenAmountStore;
