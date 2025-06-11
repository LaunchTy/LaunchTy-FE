import { create } from "zustand";

interface CharityDetailState {
	tokenAmount: number;
	setTokenAmount: (amount: number) => void;
}

const useCharityTokenAmountStore = create<CharityDetailState>((set) => ({
	tokenAmount: 0, // Default value for tokenAmount
	setTokenAmount: (amount) => set({ tokenAmount: amount }),
}));

export default useCharityTokenAmountStore;
