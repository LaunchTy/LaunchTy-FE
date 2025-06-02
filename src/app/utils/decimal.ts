import { ethers } from "ethers";

/**
 * Convert an off-chain number to on-chain format based on custom decimals.
 * @param amount - The human-readable amount (e.g., 1000).
 * @param decimals - The number of decimals for the token (e.g., 12 for Polkadot EVM).
 * @returns The on-chain representation of the amount.
 */
export function convertNumToOnChainFormat(
	amount: number,
	decimals: number
): string {
	return ethers.utils.parseUnits(amount.toString(), decimals).toString();
}

/**
 * Convert an on-chain number to off-chain format based on custom decimals.
 * @param amount - The on-chain amount (e.g., "1000000000000").
 * @param decimals - The number of decimals for the token (e.g., 12 for Polkadot EVM).
 * @returns The human-readable representation of the amount.
 */
export function convertNumToOffChainFormat(
	amount: string,
	decimals: number
): string {
	return ethers.utils.formatUnits(amount, decimals);
}

// // Example usage:
// const polkadotDecimals = 12; // Polkadot EVM chain uses 12 decimals

// const onChainValue = convertNumToOnChainFormat(1000, polkadotDecimals);
// console.log(onChainValue); // Outputs: 1000000000000

// const offChainValue = convertNumToOffChainFormat(
// 	onChainValue,
// 	polkadotDecimals
// );
// console.log(offChainValue); // Outputs: 1000.0
