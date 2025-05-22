// src/app/launchpad/[id]/edit/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import CreateLaunchpad from '../../create-launchpad/CreateLaunchpad'
import { useLaunchpadStore, LaunchpadData } from '@/store/launchpad/CreateLaunchpadStore'

const EditLaunchpadPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const loadLaunchpad = useLaunchpadStore((state) => state.loadLaunchpad)
  const reset = useLaunchpadStore((state) => state.reset)

  useEffect(() => {
    // Reset any previous state
    reset()

    // Simulate fetching existing launchpad data for given id
    const dummyData: LaunchpadData = {
      tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
      totalSupply: 1000000,
      selectedStakingToken: '0xabcdef...',
      selectedStakingTokenSymbol: 'ABC',
      maxInvestment: 5000,
      minInvestment: 100,
      softCap: 20000,
      hardCap: 50000,
      projectName: 'My Dummy Project',
      shortDescription: 'A brief overview of the dummy project.',
      longDescription: 'A more detailed description of the dummy project for editing.',
      socialLinks: {
        website: 'https://example.com',
        telegram: 'https://t.me/example',
        twitter: 'https://twitter.com/example',
        discord: 'https://discord.gg/example',
        github: 'https://github.com/example',
      },
      whitepaper: 'https://example.com/whitepaper.pdf',
      logo: null,
      images: [],
      backgroundImage: '',
      startDate: '2025-06-01T10:00',
      endDate: '2025-06-07T18:00',
    }

    // Load into store
    loadLaunchpad(dummyData)
  }, [id, loadLaunchpad, reset])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Launchpad</h1>
        <CreateLaunchpad isEditing />
      </div>
    </div>
  )
}

export default EditLaunchpadPage
