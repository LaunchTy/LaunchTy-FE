'use client'

interface AddressField {
	label: string
	value: string
}

interface AddressInfoProps {
	title?: string
	fields: AddressField[]
	className?: string
}

const AddressInfo = ({ title, fields, className = '' }: AddressInfoProps) => {
	return (
		<div
			className={`mb-28 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-8 ${className}`}
		>
			{title && <span className="text-[25px] font-bold">{title}</span>}
			{fields.map((field, i) => (
				<div key={i} className="flex items-center mb-6">
					<span className="flex-none w-52 text-right text-[19px] font-bold">
						{field.label}:
					</span>
					<span className="ml-10 text-[16px] text-left font-normal">
						{field.value}
					</span>
				</div>
			))}
		</div>
	)
}

export default AddressInfo
