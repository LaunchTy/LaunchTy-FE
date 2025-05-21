import CategorySection from '@/components/charity-homepage-section/CategorySection'
import HeroSection from '@/components/charity-homepage-section/HeroSection'
import InstructionSection from '@/components/charity-homepage-section/InstructionSection'
import MotivationSection from '@/components/charity-homepage-section/MotivationSection'
import ProjectSection from '@/components/charity-homepage-section/ProjectSection'
import React from 'react'

const CharityHomepage = () => {
	return (
		<div>
			<HeroSection />
			<InstructionSection />
			<CategorySection />
			<ProjectSection />
			<MotivationSection />
		</div>
	)
}

export default CharityHomepage
