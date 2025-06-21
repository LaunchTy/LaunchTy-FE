'use client'
import { MotionParticles } from '@/components/UI/background/Particle'
import { motion } from 'framer-motion'
import Image from 'next/image'

const AboutUsPage = () => {
	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		whileInView: { opacity: 1, y: 0 },
		transition: { duration: 0.6, ease: 'easeOut' },
		viewport: { margin: '-100px' },
	}

	const staggerContainer = {
		initial: {},
		whileInView: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	}

	const teamMembers = [
		{
			name: 'Lê Nguyễn Hải Như',
			role: 'Team Leader',
			description:
				'Research feature, template, design user interface and workflow',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/0776ba9c9556c7ceb2200dd7e2a1da/3c0776ba9c9556c7ceb2200dd7e2a1da.gif?w=300',
		},
		{
			name: 'Phan Nguyễn Hoàng Long',
			role: 'Fullstack Developer',
			description: 'Research feature, library, technology, design database',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/697a86689eee3120ddd5878a714147/7d697a86689eee3120ddd5878a714147.gif?w=350',
		},
		{
			name: 'Trần Mạnh Tuấn',
			role: 'Fullstack Developer',
			description: 'Research library, technology, template',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/2545bd663b3011f6f0df9a7bfd49d3/272545bd663b3011f6f0df9a7bfd49d3.gif?w=350',
		},
		{
			name: 'Nguyễn Trần Quốc Khánh',
			role: 'Fullstack Developer',
			description:
				'Research feature, library, technology, design user interface',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/970552bfaf8935b1f70b830cc251f6/a7970552bfaf8935b1f70b830cc251f6.gif?w=350',
		},
		{
			name: 'Phạm Nguyễn Khánh Băng',
			role: 'Market Researcher',
			description:
				'Market research report, Customer analysis, Competitive analysis',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/97b04d8bcbccc9eda44eaa8f2d3d81/2197b04d8bcbccc9eda44eaa8f2d3d81.gif?w=350',
		},
		{
			name: 'Lê Văn Hà',
			role: 'Market Researcher',
			description:
				'Market research report, Customer analysis, Competitive analysis',
			image:
				'https://i2.seadn.io/base/0xf20a43f8396f8e28100d6d454e34483d78094c29/9d01e2cded906e8b2978a47baa4daa/719d01e2cded906e8b2978a47baa4daa.gif?w=350',
		},
	]

	const values = [
		{
			icon: '🔒',
			title: 'Transparency',
			description:
				'Every transaction is recorded on the blockchain for complete visibility',
		},
		{
			icon: '🤝',
			title: 'Trust',
			description:
				'Building confidence between donors and charitable organizations',
		},
		{
			icon: '⚡',
			title: 'Innovation',
			description:
				'Leveraging cutting-edge technology to solve real-world problems',
		},
		{
			icon: '🌍',
			title: 'Impact',
			description:
				'Maximizing the reach and effectiveness of charitable giving',
		},
	]

	return (
		<div className="min-h-screen font-exo mt-32">
			{/* Hero Section */}
			<MotionParticles particleCount={40} connectParticles={true} />

			<section className="relative overflow-hidden py-10 px-8">
				<div className="max-w-6xl mx-auto">
					<motion.div {...fadeInUp} className="text-center mb-16">
						<h1 className="text-6xl font-bold text-white mb-6">
							About{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
								LaunchTy
							</span>
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							We&#39;re pioneering the future of blockchain innovation through
							our dual-platform ecosystem - empowering crypto projects with our
							launchpad and revolutionizing charitable giving with transparent
							blockchain solutions.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-10 px-8">
				<div className="max-w-6xl mx-auto">
					<motion.div
						{...fadeInUp}
						className="glass-component-1 rounded-2xl p-12 mb-16"
					>
						<h2 className="text-4xl font-bold text-white mb-8 text-center">
							Our Mission
						</h2>
						<p className="text-lg text-gray-200 leading-relaxed text-center max-w-4xl mx-auto">
							To create a comprehensive blockchain ecosystem that serves two
							critical needs: launching innovative crypto projects through our
							secure launchpad platform, and transforming charitable giving
							through transparent, blockchain-powered donation systems. We
							bridge traditional finance with decentralized innovation, ensuring
							that both emerging projects and charitable causes can thrive in
							the Web3 era.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-10 px-8">
				<div className="max-w-6xl mx-auto">
					<motion.h2
						{...fadeInUp}
						className="text-4xl font-bold text-white mb-16 text-center"
					>
						Our Core Values
					</motion.h2>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="whileInView"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
					>
						{values.map((value, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								className="glass-component-2 rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300"
							>
								<div className="text-4xl mb-4">{value.icon}</div>
								<h3 className="text-xl font-bold text-white mb-4">
									{value.title}
								</h3>
								<p className="text-gray-300">{value.description}</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-10 px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<motion.div {...fadeInUp}>
							<h2 className="text-4xl font-bold text-white mb-8">Our Story</h2>
							<div className="space-y-6 text-gray-200">
								<p>
									Founded in 2025, LaunchTy was born from the vision of creating
									a comprehensive blockchain ecosystem that serves both the
									growing crypto economy and social good. We recognized two
									major opportunities in the Web3 space: the need for a secure,
									reliable launchpad for emerging projects, and the potential to
									revolutionize charitable giving through blockchain
									transparency.
								</p>
								<p>
									Our dual-platform approach allows us to leverage the success
									of our launchpad operations to fund and support our charitable
									initiatives. Every successful project launch contributes to
									our mission of creating positive social impact through our
									charity platform, creating a sustainable cycle of innovation
									and giving.
								</p>
								<p>
									Today, we&#39;ve successfully launched 25+ blockchain projects
									while facilitating over $500K in transparent charitable
									donations. We&#39;re building the future where blockchain
									innovation and social responsibility go hand in hand.
								</p>
							</div>
						</motion.div>
						<motion.div
							{...fadeInUp}
							className="glass-component-1 rounded-2xl p-8"
						>
							<div className="text-center">
								<div className="text-6xl mb-4">📈</div>
								<h3 className="text-2xl font-bold text-white mb-6">
									Platform Statistics
								</h3>
								<div className="grid grid-cols-2 gap-6">
									<div>
										<div className="text-3xl font-bold text-purple-400">
											50+
										</div>
										<div className="text-gray-300">Charity Partners</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-purple-400">
											$2M+
										</div>
										<div className="text-gray-300">Donated</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-purple-400">
											10K+
										</div>
										<div className="text-gray-300">Donors</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-purple-400">
											100%
										</div>
										<div className="text-gray-300">Transparency</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-10 px-8">
				<div className="max-w-6xl mx-auto">
					<motion.h2
						{...fadeInUp}
						className="text-4xl font-bold text-white mb-16 text-center"
					>
						Meet Our Team
					</motion.h2>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="whileInView"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						{teamMembers.map((member, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								className="glass-component-2 rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center"
							>
								{/* <div className="text-6xl mb-4">{member.image}</div> */}
								<Image
									src={member.image}
									alt={`${member.name}'s profile picture`}
									width={100}
									height={100}
									className="mb-10"
								/>
								<h3 className="text-xl font-bold text-white mb-2">
									{member.name}
								</h3>
								<p className="text-purple-400 font-semibold mb-4">
									{member.role}
								</p>
								<p className="text-gray-300 text-sm">{member.description}</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-10 px-8">
				<div className="max-w-4xl mx-auto">
					<motion.div
						{...fadeInUp}
						className="glass-component-1 rounded-2xl p-12 text-center"
					>
						<h2 className="text-4xl font-bold text-white mb-6">
							Join Our Mission
						</h2>
						<p className="text-xl text-gray-200 mb-8">
							Whether you&#39;re launching the next breakthrough blockchain
							project or supporting meaningful charitable causes, our
							dual-platform ecosystem is designed to help you achieve your goals
							with transparency and security.
						</p>
						{/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
								Start Your Campaign
							</button>
							<button className="px-8 py-4 glass-component-2 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
								Explore Charities
							</button>
						</div> */}
					</motion.div>
				</div>
			</section>
		</div>
	)
}

export default AboutUsPage
