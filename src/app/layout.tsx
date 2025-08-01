import type { Metadata } from 'next'
import { Exo } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Web3Provider } from '../provider/provider'

const exo = Exo({ subsets: ['latin'], variable: '--font-exo' }) // Added Exo font

export const metadata: Metadata = {
	title: 'Launchty',
	description: 'Launchty',
	icons: {
		icon: '/favicon.ico',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${exo.variable}`}>
				<Web3Provider>
					<Navbar
						navItems={[
							{ name: 'About us', link: '/about-us' },
							{ name: 'Charity', link: '/charity/explore-charity' },
							{ name: 'Launchpad', link: '/launchpad/explore-launchpad' },
							{
								name: 'Activities',
								subItems: [
									{ name: 'My Launchpad', link: '/launchpad/my-launchpad' },
									{
										name: 'My Investment',
										link: '/launchpad/explore-launchpad-withdraw',
									},
									{ name: 'My Charity', link: '/charity/my-charity' },
									{ name: 'My Donations', link: '/charity/my-donations' },
								],
							},
						]}
					/>
					{children}
					<Footer />
				</Web3Provider>
			</body>
		</html>
	)
}
