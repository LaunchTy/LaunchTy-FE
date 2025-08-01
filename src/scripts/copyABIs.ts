// CommonJS-style TypeScript (works with ts-node directly)
import * as fs from "fs";
import * as path from "path";
// Adjust path to Foundry's output ABI JSON
// const contractsDir = path.resolve(__dirname, "../../../Launchty-Contracts/out");
const contractsDir = path.resolve(__dirname, "../../../LaunchTy-Contract/out");
const outputDir = path.resolve(__dirname, "../app/abi");

// Manually list the contracts
const contractsToCopy = [
	"Launchpad.sol/Launchpad.json",
	"LaunchpadFactory.sol/LaunchpadFactory.json",
	"CharityFactory.sol/CharityFactory.json",
	"Charity.sol/Charity.json",
	"MockERC20.sol/MockERC20.json",
];

contractsToCopy.forEach((contractPath) => {
	const fullInputPath = path.join(contractsDir, contractPath);
	const contractName = path.basename(contractPath, ".json");
	const fullOutputPath = path.join(outputDir, `${contractName}.json`);

	if (!fs.existsSync(fullInputPath)) {
		console.error(`❌ ABI not found: ${fullInputPath}`);
		return;
	}

	const artifact = JSON.parse(fs.readFileSync(fullInputPath, "utf-8"));
	// const abiOnly = JSON.stringify(artifact.abi, null, 2);
	const abiFile = JSON.stringify(artifact, null, 2);
	fs.writeFileSync(fullOutputPath, abiFile);

	console.log(`✅ Copied: ${contractName}.json`);
});
