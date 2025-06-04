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
						width={sizeMap[iconSize].x.width}
						height={sizeMap[iconSize].x.height}
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
						width={sizeMap[iconSize].facebook.width}
						height={sizeMap[iconSize].facebook.height}
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 0a8 8 0 1 0 8 8A8.009 8.009 0 0 0 8 0Zm2.285 8.009h-1.286v4.989H7.285V8.009H6.5V6.572h.785V5.771c0-.954.466-2.271 2.285-2.271h1.12v1.428h-.847c-.198 0-.473.099-.473.519v1.125h1.321Z" />
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
						width={sizeMap[iconSize].instagram.width}
						height={sizeMap[iconSize].instagram.height}
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 5.053A2.947 2.947 0 1 0 10.947 8 2.95 2.95 0 0 0 8 5.053ZM8 9.47A1.47 1.47 0 1 1 9.47 8 1.472 1.472 0 0 1 8 9.47Z" />
						<path d="M12.258 4.147a.686.686 0 1 1-.685-.685.684.684 0 0 1 .685.685Z" />
						<path d="M8 0C5.747 0 5.492.009 4.663.048 3.834.088 3.22.222 2.71.411a4.606 4.606 0 0 0-1.654 1.077A4.606 4.606 0 0 0 .411 3.14c-.189.51-.323 1.123-.363 1.952C.009 5.921 0 6.176 0 8s.009 2.079.048 2.908c.04.829.174 1.442.363 1.952a4.606 4.606 0 0 0 1.077 1.654 4.606 4.606 0 0 0 1.654 1.077c.51.189 1.123.323 1.952.363.829.04 1.084.048 2.908.048s2.079-.009 2.908-.048c.829-.04 1.442-.174 1.952-.363a4.606 4.606 0 0 0 1.654-1.077 4.606 4.606 0 0 0 1.077-1.654c.189-.51.323-1.123.363-1.952.04-.829.048-1.084.048-2.908s-.009-2.079-.048-2.908c-.04-.829-.174-1.442-.363-1.952a4.606 4.606 0 0 0-1.077-1.654A4.606 4.606 0 0 0 13.29.411c-.51-.189-1.123-.323-1.952-.363C10.079.009 9.824 0 8 0Zm0 1.453c2.21 0 2.475.008 3.349.048.807.037 1.246.172 1.537.286a3.078 3.078 0 0 1 1.113.725 3.078 3.078 0 0 1 .725 1.113c.114.291.249.73.286 1.537.04.874.048 1.139.048 3.349s-.008 2.475-.048 3.349c-.037.807-.172 1.246-.286 1.537a3.078 3.078 0 0 1-.725 1.113 3.078 3.078 0 0 1-1.113.725c-.291.114-.73.249-1.537.286-.874.04-1.139.048-3.349.048s-2.475-.008-3.349-.048c-.807-.037-1.246-.172-1.537-.286a3.078 3.078 0 0 1-1.113-.725 3.078 3.078 0 0 1-.725-1.113c-.114-.291-.249-.73-.286-1.537C1.461 10.475 1.453 10.21 1.453 8s.008-2.475.048-3.349c.037-.807.172-1.246.286-1.537a3.078 3.078 0 0 1 .725-1.113A3.078 3.078 0 0 1 3.625.786c.291-.114.73-.249 1.537-.286C5.525 1.461 5.79 1.453 8 1.453Z" />
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
