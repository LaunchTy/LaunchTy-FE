'use client'
import React from 'react'

type LegendItem = {
	color: string
	label: string
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
}) => (
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
					</div>
				))}
			</div>
			<div className="w-[120px] h-[120px]">
				{/* Replace with actual Pie Chart */}
				<div className="rounded-full bg-gradient-to-br from-white/20 to-white/5 w-full h-full" />
			</div>
		</div>
	</div>
)

export default CardWithChart
