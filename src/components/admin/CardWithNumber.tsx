'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface NumberCardProps {
	title: string
	count: number
}

const NumberCard: React.FC<NumberCardProps> = ({ title, count }) => (
	<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[30px]  max-h-[250px]">
		<div className="py-3 px-6 gap-3">
			<div className="text-lg font-semibold text-white">{title}</div>
			<div className="flex h-full w-full items-center justify-center">
				<h1 className="text-3xl font-bold text-white">{count}</h1>
			</div>
		</div>
	</div>
)
export default NumberCard
