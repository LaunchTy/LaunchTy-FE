'use client'
import Image from 'next/image'

interface ProjectHeaderProps {
	projectDetail: {
		name: string
		logo: string
		shortDescription: string
		startDate: string
		endDate: string
	}
}

const ProjectHeader = ({ projectDetail }: ProjectHeaderProps) => {
	const getStatus = (startDate: string, endDate: string) => {
		const now = new Date()
		const start = new Date(startDate)
		const end = new Date(endDate)

		if (now < start) return 'upcoming'
		if (now >= start && now <= end) return 'on-going'
		return 'ended'
	}

	const status = getStatus(projectDetail.startDate, projectDetail.endDate)

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'upcoming':
				return 'bg-yellow-500 text-black'
			case 'on-going':
				return 'bg-[#102821] text-[#0E9A36]'
			case 'ended':
				return 'bg-red-500 text-white'
			default:
				return 'bg-gray-500 text-white'
		}
	}

	return (
		<div className="text-white">
			<div className="flex justify-between px-8 w-full">
				<div className="flex flex-row gap-10">
					<div className="w-auto">
						<Image
							src={projectDetail.logo}
							alt="Project Logo"
							width={64}
							height={64}
							className="rounded-full object-cover items-center h-28 w-28 bg-slate-700"
						/>
					</div>

					<div className="flex flex-col">
						<div className="flex">
							<span className="text-2xl font-orbitron font-bold">
								{projectDetail.name}
							</span>
							<div
								className={`flex ml-14 justify-center items-center rounded-xl text-xs font-semibold px-5 py-1 ${getStatusColor(
									status
								)}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</div>
						</div>

						<div className="text-[#CACACA] font-comfortaa w-2/3 mt-2">
							{projectDetail.shortDescription}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectHeader
