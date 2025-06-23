// app/admin/dashboard/page.tsx
'use client'
import React, { useState } from 'react'
import SplitText from '@/components/UI/text-effect/SplitText'
import LeftNavBar from '@/components/admin/LeftNavBar'
import LaunchpadList from '@/components/admin/LaunchpadList'
import CharityList from '@/components/admin/CharityList'
import LockModal from '@/components/UI/modal/LockModal'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { useEffect } from 'react'

const AdminDashboard = () => {
	const [activeMenu, setActiveMenu] = useState('launchpad')
	const { address, isConnected } = useAccount()
	const [isAdmin, setIsAdmin] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkAdmin = async () => {
			if (!isConnected || !address) {
				setIsAdmin(false)
				setLoading(false)
				return
			}

			try {
				const res = await axios.get(`/api/admin/check-admin?address=${address}`)
				setIsAdmin(res.data.isAdmin)
			} catch (err) {
				console.error('Failed to check admin:', err)
				setIsAdmin(false)
			} finally {
				setLoading(false)
			}
		}

		checkAdmin()
	}, [address, isConnected])

	if (loading) return null

	if (!isConnected || !isAdmin) {
		return (
			<LockModal
				open={true}
				title="Restricted Access"
				description="Only admin wallets can view this page."
				message="Please connect with an admin wallet to access the dashboard."
				showUnlockButton={false}
				canClose={false}
			/>
		)
	}

	return (
		<div className="min-h-screen font-exo">
			<div className="text-center z-20 pt-40">
				<SplitText
					text="Admin Page"
					className="text-[64px] font-bold text-white"
					delay={70}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="text-center z-20 pt-5 px-56">
				<SplitText
					text="Approve the Project if the charity provides clear and verifiable information about its purpose, ensuring transparency and credibility. Additionally, the fundraising goal and allocation of funds should be explicitly stated to guarantee proper use of donations."
					className="text-sm text-white"
					delay={2}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="flex min-h-screen pt-10 gap-10">
				<div className="pl-20 h-full flex flex-col sticky top-6">
					<LeftNavBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
				</div>
				<div className="h-full flex flex-col w-full">
					{activeMenu === 'launchpad' && <LaunchpadList />}
					{activeMenu === 'charity' && <CharityList />}
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard
