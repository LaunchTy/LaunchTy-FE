'use client'

import React, { useState, useRef, useEffect } from 'react'

interface FilterOption {
	value: string
	label: string
}

interface FilterStatusProps {
	filter: string
	setFilter: (value: string) => void
	options: FilterOption[]
}

const FilterStatus: React.FC<FilterStatusProps> = ({
	filter,
	setFilter,
	options,
}) => {
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Đóng dropdown khi click ngoài
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSelect = (value: string) => {
		setFilter(value)
		setOpen(false)
	}

	const selectedLabel = options.find((o) => o.value === filter)?.label || ''

	return (
		<div className="relative inline-block w-60 pr-20" ref={dropdownRef}>
			{/* Button hiển thị filter hiện tại + arrow */}
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="
          w-full 
          flex 
          items-center 
          justify-between 
          px-5
          py-2 
          rounded-[40px] 
          glass-component-2 
          backdrop-blur-sm 
          border border-gray-300 
          shadow-md 
          text-gray-300
          font-semibold 
          text-sm
          transition
        "
			>
				<span>{selectedLabel}</span>
				<svg
					className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
						open ? 'rotate-180' : ''
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{/* Dropdown list */}
			{open && (
				<ul
					className="
            absolute 
            mt-2 
            w-full 
            max-h-60 
            overflow-auto 
            rounded-xl 
            bg-white/30 
            backdrop-blur-lg 
            border 
            border-gray-200 
            shadow-lg 
            z-50
          "
				>
					{options.map((option) => (
						<li
							key={option.value}
							onClick={() => handleSelect(option.value)}
							className={`
                px-5 
                py-2 
                cursor-pointer 
                select-none
                transition
                ${option.value === filter ? 'font-bold' : 'text-gray-300'}
              `}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default FilterStatus
