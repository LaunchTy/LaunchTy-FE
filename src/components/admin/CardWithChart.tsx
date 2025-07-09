'use client'
import React from 'react'
import ReactApexChart from 'react-apexcharts'

type LegendItem = {
	color: string
	label: string
	value?: number
}

type CardWithChartProps = {
	title: string
	count: number
	legend: LegendItem[]
	series?: number[]
}

const CardWithChart: React.FC<CardWithChartProps> = ({
	title,
	count,
	legend,
	series,
}) => {
	// Use real series or fallback dummy
	const finalSeries: number[] =
		series && series.length === legend.length
			? series
			: Array(legend.length).fill(count / legend.length)

	// Automatically extract colors from legend
	const chartColors = legend.map((item) => item.color)

	const options = {
		chart: {
			type: 'donut' as const,
		},
		labels: legend.map((item) => item.label),
		colors: chartColors,
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
				},
			},
		},
	}

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
						<div key={idx} className="flex items-center gap-2 text-white">
							<span
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span>{item.label}</span>
						</div>
					))}
				</div>
				<div className="w-[120px] h-[120px]">
					<ReactApexChart
						options={options}
						series={finalSeries}
						type="donut"
						width={120}
						height={120}
					/>
				</div>
			</div>
		</div>
	)
}

export default CardWithChart
