import Image from 'next/image'

type Charity = {
	id: number
	image: string
	tokenImage?: string
	title: string
	shortDescription: string
	longDescription: string
	goal: number
	raised: number
}

type CharityCardProps = {
	charityDetail: Charity // 👈 không còn là Charity[]
}

const CharityCard = ({ charityDetail }: CharityCardProps) => {
	const charity = charityDetail

	return (
		<div className="border rounded-xl p-4 shadow-md bg-white glass-component-1">
			<Image
				src={charity.image}
				alt={charity.title}
				width={400}
				height={300}
				className="w-full h-48 object-cover rounded-xl mb-4"
			/>
			<div className="flex justify-between">
				<h3 className="text-lg font-bold">{charity.title}</h3>
				<Image
					src={charity.tokenImage || ''}
					alt={charity.title}
					width={400}
					height={300}
					className="w-[30px] h-[30px] object-cover rounded-xl mb-4"
				/>
			</div>
			<p className="text-sm text-gray-600 mt-2">{charity.shortDescription}</p>
			<div className="mt-4 flex justify-between">
				<span className="text-sm font-semibold">Goal:</span>
				<span>${charity.goal.toLocaleString()}</span>
			</div>
			<div className="mt-2 flex justify-between">
				<span className="text-sm font-semibold">Raised:</span>
				<span>${charity.raised.toLocaleString()}</span>
			</div>
		</div>
	)
}

export default CharityCard
