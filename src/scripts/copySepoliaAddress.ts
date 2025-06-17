// import * from "../../../Launchty-Contracts/broadcast/LaunchpadFactory.s.sol/11155111/run-latest.json"

import { Config } from "@/app/config";
import { readFileSync, writeFileSync } from "fs";

// import * from "../app/config/chainConfig[11155111].json";
interface ContractData {
	transactions: {
		contractName: string;
		contractAddress: string;
		address: string;
		transactionHash: string;
		arguments: string[];
		function: string;
		additionalContracts: {
			address: string;
		}[];
	}[];
}

const contractDir =
	"../Launchty-Contracts/broadcast/LaunchpadFactory.s.sol/11155111/run-latest.json";
let outputDir = "src/app/config/chainConfig.json";
let chainConfig = Config;
const contractData: ContractData = JSON.parse(
	readFileSync(contractDir, { encoding: "utf-8" })
);

contractData.transactions.forEach((item) => {
	if (item.contractName === "LaunchpadFactory" && item.additionalContracts) {
		chainConfig[11155111].contracts.LaunchpadFactory.address =
			item.contractAddress;
		console.log(`LaunchpadFactory address: ${item.contractAddress}`);
		if (item.additionalContracts && item.additionalContracts.length > 0) {
			chainConfig[11155111].contracts.Launchpad.address =
				item.additionalContracts[0].address;
			console.log(
				`Launchpad address: ${item.additionalContracts[0].address}`
			);
		}
	}
	if (item.contractName === "CharityFactory" && item.additionalContracts) {
		chainConfig[11155111].contracts.CharityFactory.address =
			item.contractAddress;
		console.log(`CharityFactory address: ${item.contractAddress}`);
		if (item.additionalContracts && item.additionalContracts.length > 0) {
			chainConfig[11155111].contracts.Charity.address =
				item.additionalContracts[0].address;
			console.log(
				`Charity address: ${item.additionalContracts[0].address}`
			);
		}
	}
	// if (item.contractName === "Charity") {
	// 	chainConfig[11155111].contracts.Charity.address = item.contractAddress;
	// 	console.log(`Charity address: ${item.contractAddress}`);
	// }
	if (item.contractName === "MockERC20") {
		if (
			item.arguments &&
			item.function === null &&
			item.arguments[1] === "PTK"
		) {
			chainConfig[11155111].contracts.MockERC20.address =
				item.contractAddress;
			console.log(`MockERC20 address: ${item.contractAddress}`);
		} else if (
			item.arguments &&
			item.function === null &&
			item.arguments[1] === "ATK"
		) {
			chainConfig[11155111].contracts.AcceptedMockERC20.address =
				item.contractAddress;
			console.log(`AcceptedMockERC20 address: ${item.contractAddress}`);
		}
	}
});

// console.log(contractData);
writeFileSync(outputDir, JSON.stringify(chainConfig, null, 2));
console.log("Updated chainConfig.json with contract addresses.");

// const data = contractData.transactions[3].additionalContracts[0].address;
// console.log(data);

// chainConfig[11155111][11155111].contracts;
