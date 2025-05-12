import React from 'react'
import ExploreProject from '@/components/Launchpad/Explore-section/ExploreProject'
import NavBar from '@/components/Launchpad/Explore-section/NavBar'
import ProjectSection from '@/components/Launchpad/Explore-section/ProjectSection'


const ExploreProjectPage = () => {
  return (
    <div className="min-h-screen font-exo">
      <ExploreProject />
      <NavBar />
      <ProjectSection/>
    </div>
  )
}

export default ExploreProjectPage 