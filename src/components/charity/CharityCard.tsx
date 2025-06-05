import { BaseProject } from '@/interface/interface'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type CharityCardProps = {
	charityDetail: BaseProject
}

const CharityCard = ({ charityDetail }: CharityCardProps) => {
	const charity = charityDetail
	const route = useRouter()
	const handleSubmit = () => {
		if (charity.id) {
			route.push(`/charity/charity-detail/${charity.id}`)
		} else {
			console.error('Charity ID is not defined')
		}
	}

	return (
		<div
			onClick={() => handleSubmit()}
			className="border rounded-xl p-4 shadow-md bg-white glass-component-1 min-h-[450px] flex flex-col justify-between w-96 hover:scale-105 duration-300"
		>
			<Image
				src={
					Array.isArray(charity.images)
						? charity.images[0]
						: charity.images || '/default-image.jpg'
				}
				alt="Image"
				width={400}
				height={300}
				className="w-full h-48 object-cover rounded-xl "
			/>
			<div className="flex justify-between">
				<h3 className="text-lg font-bold">{charity.name}</h3>
				<Image
					src="https://s3.coinmarketcap.com/static-gravity/image/fecbf806c893460cbc5241d4e902b039.png"
					alt="Token"
					width={200}
					height={100}
					className="w-[25px] h-[25px] object-cover rounded-xl"
				/>
			</div>
			<p className="text-sm text-gray-300 min-h-[70px] flex flex-wrap">
				{charity.shortDescription}
			</p>
			<div className="w-full h-1	 bg-gray-200 rounded-full overflow-hidden my-2">
				<div className="h-full bg-gradient"></div>
			</div>

			{/* <div className=" flex justify-between">
				<span className="text-sm font-semibold">Goal:</span>
				<span>${charity..toLocaleString()}</span>
			</div> */}
			<div className=" flex justify-between">
				<span className="text-sm font-semibold">Raised:</span>
				<span>
					$
					{charity.totalDonationAmount
						? charity.totalDonationAmount.toLocaleString()
						: '0'}
				</span>
			</div>
		</div>
	)
}

export default CharityCard
