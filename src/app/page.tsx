import BenefitSection from '@/components/homepage-section/BenefitSection'
import FeatureSection from '@/components/homepage-section/FeatureSection'
import HeroSection from '@/components/homepage-section/HeroSection'
import MotivationSection from '@/components/homepage-section/MotivationSection'
import Image from 'next/image'

export default function Home() {
	return (
		<div>
			<HeroSection />
			<FeatureSection />
			<BenefitSection />
			<MotivationSection />
		</div>
	)
}
