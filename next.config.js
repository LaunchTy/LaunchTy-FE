/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},

	webpack(config) {
		config.module.rules.push({
			test: /HeartbeatWorker\.js$/,
			type: "javascript/auto",
		});
		return config;
	},

	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = nextConfig;
