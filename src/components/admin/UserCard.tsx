'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface UserCardProps {
	title: string
	count: number
}

const UserCard: React.FC<UserCardProps> = ({ title, count }) => (
	<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[30px]  max-h-[220px]">
		<div className="p-3 px-6 gap-4">
			<h2 className="text-lg font-semibold text-white">{title}</h2>
			<p className="text-lg font-semibold text-white">{count}</p>
		</div>
	</div>
)
export default UserCard
