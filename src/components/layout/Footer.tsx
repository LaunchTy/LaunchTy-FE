import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import Particles from '@/app/components/UI/background/Particles'
import Logo from '@/public/Logo.png'
import { FOOTER_LINKS } from '@/constants/utils'
import AnimatedBlobs from '../UI/background/AnimatedBlobs'

const CURRENT_YEAR = new Date().getFullYear()

type FooterColumnProps = {
	title: string
	children: React.ReactNode
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
	return (
		<div className="flex flex-col gap-5">
			<h4 className="font-bold whitespace-nowrap">
				{title}
				<div className="h-[1px] bg-gradient w-full mx-auto mt-3"></div>
			</h4>
			<span>{children}</span>
		</div>
	)
}
export function Footer() {
	return (
		<footer className=" relative bg-[#251749] text-white overflow-hidden h-auto ">
			<AnimatedBlobs count={4} />
			<div className="relative z-10 flex w-full flex-col gap-14 px-10 pt-10">
				<div className="flex flex-col items-start justify-center gap-[10%] md:flex-row z-30">
					<div className="flex flex-col gap-10  items-start flex-shrink-0  p-3">
						<div className="flex transition-transform transform hover:-translate-y-1 duration-300">
							<Image src={Logo} alt="Logo" className="h-6 w-8 sm:w-10 mr-2" />{' '}
							<Link href={'/'}>
								<span className="text-xl tracking-tight text-white font-bold">
									LaunchTy
								</span>
							</Link>
						</div>
						<span className="break-words xl:w-[650px] lg:w-[600px] md:w-[400px] sm:w-[500px] opacity-50 text-sm">
							Our platform bridges innovation and compassion by empowering
							blockchain projects to raise funds while supporting meaningful
							charitable causes. Through our unique launchpad, users can
							contribute to new token launches and make a real-world impact.
							Every transaction helps fund vetted charities, ensuring
							transparency and trust. Join us to support the future of Web3 and
							the betterment of global communities.
						</span>
					</div>

					<div className="flex flex-wrap gap-16 sm:justify-end md:flex-1">
						{FOOTER_LINKS.map((columns, index) => (
							<FooterColumn key={index} title={columns.title}>
								<ul className="regular-14 flex flex-col gap-4 text-gray-30 ">
									{columns.links.map((link) => (
										<Link
											href={link.url}
											key={link.name}
											className="hover:text-[#8132a2] duration-200 transform transition-transform hover:scale-105 active:scale-95"
										>
											{link.name}
										</Link>
									))}
								</ul>
							</FooterColumn>
						))}
					</div>
				</div>

				<div className=" w-full text-center text-gray-30 pt-10 ">
					<div className="h-[1px] bg-gradient w-full mb-5"></div>

					<span className="opacity-35 ">
						&copy; {CURRENT_YEAR} Empowering communities through staking and
						charity.
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
