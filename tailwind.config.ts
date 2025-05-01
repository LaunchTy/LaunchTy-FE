import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			backgroundColor: {
				"white/1": "rgba(255, 255, 255, 0.01)",
				"white/2": "rgba(255, 255, 255, 0.02)",
				"white/3": "rgba(255, 255, 255, 0.03)",
				"white/4": "rgba(255, 255, 255, 0.04)",
				"black/1": "rgba(0, 0, 0, 0.01)",
			},
			fontFamily: {
				exo: ["var(--font-exo)", ...fontFamily.sans], // Added Exo font
			},
		},
	},
	plugins: [],
};
export default config;
