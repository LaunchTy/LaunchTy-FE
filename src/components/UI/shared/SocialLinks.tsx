'use client'

import { FC } from 'react'

export interface SocialLinksProps {
	socials?: {
		website?: string
		ig?: string
		x?: string
		fb?: string
	}
	iconColor?: string
	hoverColor?: string
	iconSize?: 'small' | 'medium' | 'large'
	className?: string
	align?: 'start' | 'center' | 'end'
}

const SocialLinks: FC<SocialLinksProps> = ({
	socials,
	iconColor = 'text-white',
	hoverColor = 'text-gray-400',
	iconSize = 'medium',
	className = '',
	align = 'center',
}) => {
	// Only render if there are actually social links to display
	const hasSocialLinks =
		socials &&
		Object.values(socials).some(
			(link) => typeof link === 'string' && link.trim() !== ''
		)

	if (!hasSocialLinks) return null

	// Size mappings for the icons
	const sizeMap = {
		small: {
			website: { width: 16, height: 16 },
			x: { width: 14, height: 14 },
			facebook: { width: 16, height: 16 },
			instagram: { width: 18, height: 18 },
		},
		medium: {
			website: { width: 20, height: 20 },
			x: { width: 18, height: 18 },
			facebook: { width: 20, height: 20 },
			instagram: { width: 22, height: 22 },
		},
		large: {
			website: { width: 24, height: 24 },
			x: { width: 22, height: 22 },
			facebook: { width: 24, height: 24 },
			instagram: { width: 26, height: 26 },
		},
	}

	// Alignment class
	const alignClass = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
	}

	return (
		<div className={`flex ${alignClass[align]} gap-4 ${className}`}>
			{socials?.website && socials.website.trim() !== '' && (
				<a
					href={socials.website}
					target="_blank"
					rel="noopener noreferrer"
					className={`${iconColor} hover:${hoverColor} transition-colors`}
					title="Website"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={sizeMap[iconSize].website.width}
						height={sizeMap[iconSize].website.height}
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.615.338-2.5H8.5zM5.145 12c.138.386.295.744.47 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
					</svg>
				</a>
			)}

			{socials?.x && socials.x.trim() !== '' && (
				<a
					href={socials.x}
					target="_blank"
					rel="noopener noreferrer"
					className={`${iconColor} hover:${hoverColor} transition-colors`}
					title="X (Twitter)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="54"
						height="54"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
					</svg>
				</a>
			)}

			{socials?.fb && socials.fb.trim() !== '' && (
				<a
					href={socials.fb}
					target="_blank"
					rel="noopener noreferrer"
					className={`${iconColor} hover:${hoverColor} transition-colors`}
					title="Facebook"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="54"
						height="54"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
					</svg>
				</a>
			)}

			{socials?.ig && socials.ig.trim() !== '' && (
				<a
					href={socials.ig}
					target="_blank"
					rel="noopener noreferrer"
					className={`${iconColor} hover:${hoverColor} transition-colors`}
					title="Instagram"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="54"
						height="54"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.374.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
					</svg>
				</a>
			)}

			{/* {socials?.github && socials.github.trim() !== '' && (
				<a
					href={socials.github}
					target="_blank"
					rel="noopener noreferrer"
					className={`${iconColor} hover:${hoverColor} transition-colors`}
					title="GitHub"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={sizeMap[iconSize].github.width}
						height={sizeMap[iconSize].github.height}
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
					</svg>
				</a>
			)} */}
		</div>
	)
}

export default SocialLinks
