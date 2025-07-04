'use client'
import React from 'react'

type LegendItem = {
	color: string
	label: string
	value?: number
}

type CardWithChartProps = {
	title: string
	count: number
	chartColors?: string[]
	legend: LegendItem[]
}

const CardWithChart: React.FC<CardWithChartProps> = ({
	title,
	count,
	chartColors,
	legend,
}) => {
	// Calculate pie chart data
	const total = legend.reduce((sum, item) => sum + (item.value || 0), 0)
	const radius = 50
	const centerX = 60
	const centerY = 60
	
	// Generate pie chart segments
	const pieSegments = legend
		.filter(item => (item.value || 0) > 0)
		.map((item, index, arr) => {
			const value = item.value || 0
			const percentage = total > 0 ? value / total : 0
			const prevItems = arr.slice(0, index)
			const startAngle = prevItems.reduce((sum, prevItem) => sum + ((prevItem.value || 0) / total) * 2 * Math.PI, 0)
			const endAngle = startAngle + percentage * 2 * Math.PI
			const x1 = centerX + radius * Math.cos(startAngle)
			const y1 = centerY + radius * Math.sin(startAngle)
			const x2 = centerX + radius * Math.cos(endAngle)
			const y2 = centerY + radius * Math.sin(endAngle)
			const largeArcFlag = percentage > 0.5 ? 1 : 0
			const pathData = [
				`M ${centerX} ${centerY}`,
				`L ${x1} ${y1}`,
				`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
				'Z'
			].join(' ')
			return {
				path: pathData,
				color: item.color,
				percentage: percentage * 100
			}
		})

	return (
		<div className="flex flex-col border border-gray-300 shadow-md glass-component-2 rounded-[40px] w-full max-h-[250px] gap-1">
			<div className="flex flex-row gap-4 pt-3 px-6">
				<h2 className="text-lg font-semibold text-white">{title}</h2>
				<p className="justify-items-end text-lg font-semibold text-white line-clamp-2 ">
					{count}
				</p>
			</div>
			<div className="gap-20 px-6 flex flex-row pb-2">
				<div className="flex flex-col text-sm pt-4">
					{legend.map((item, idx) => (
						<div key={idx} className="flex items-center gap-2">
							<span
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span>{item.label}</span>
							{item.value !== undefined && (
								<span className="text-white/70">({item.value})</span>
							)}
						</div>
					))}
				</div>
				<div className="w-[120px] h-[120px] flex items-center justify-center">
					{total > 0 ? (
						<svg width="120" height="120" viewBox="0 0 120 120">
							{pieSegments.map((segment, index) => (
								<path
									key={index}
									d={segment.path}
									fill={segment.color}
									stroke="rgba(255,255,255,0.1)"
									strokeWidth="1"
								/>
							))}
							{/* Center circle for better appearance */}
							<circle
								cx={centerX}
								cy={centerY}
								r="15"
								fill="rgba(255,255,255,0.1)"
							/>
						</svg>
					) : (
						<div className="rounded-full bg-gradient-to-br from-white/20 to-white/5 w-full h-full flex items-center justify-center">
							<span className="text-white/50 text-xs">No data</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default CardWithChart
