'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { UploadCloud } from 'lucide-react'
import Folder from '@/components/UI/shared/Folder'

type Props = {
	onFilesSelected?: (files: File[]) => void
	disabled?: boolean
	charityId: string
}

const UploadHistoryEvidence = ({
	onFilesSelected,
	disabled,
	charityId,
}: Props) => {
	const [previewImages, setPreviewImages] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [historyEvidence, setHistoryEvidence] = useState<string[]>([])

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	}

	const handleHistoryUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files) {
			const files = Array.from(e.target.files)
			const base64Images = await Promise.all(
				files.map((file) => convertToBase64(file))
			)
			setHistoryEvidence([...historyEvidence, ...base64Images])
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files)
			const previews = files.map((file) => URL.createObjectURL(file))
			setPreviewImages(previews)
			onFilesSelected?.(files)
		}
	}

	return (
		<div className="h-[520px] flex flex-col gap-4 w-full">
			{/* Phần Upload */}
			<div className="border rounded-xl glass-component-1 text-white w-full p-6 flex flex-col gap-5">
				<span className="text-lg font-semibold text-white">
					Upload History Evidence (for project owner)
				</span>

				{/* Drop Zone */}
				{/* <div
					className={`w-full h-56 border-2 border-dashed rounded-lg transition-all duration-300 relative flex flex-col items-center justify-center ${
						disabled
							? 'border-gray-600 opacity-50 cursor-not-allowed'
							: 'border-gray-500 hover:border-blue-400 cursor-pointer'
					}`}
					onClick={() => !disabled && fileInputRef.current?.click()}
				> */}
				<div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible">
					<input
						type="file"
						id="historyUpload"
						accept="image/*"
						multiple
						onChange={handleHistoryUpload}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>

					{/* <div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible"> */}
					<Folder
						color="#00d8ff"
						size={0.8}
						items={historyEvidence.map((image: string, index: number) => (
							<div
								key={`history-image-${index}`}
								className="w-full h-full flex items-center justify-center"
							>
								<Image
									src={image}
									alt={`History Evidence ${index + 1}`}
									width={512}
									height={512}
									className="max-w-full max-h-full object-contain rounded"
								/>
							</div>
						))}
						maxItems={3}
					/>
					{/* </div> */}
				</div>
			</div>
			{/* Upload Button */}
			<button
				disabled={disabled}
				className={`mt-2 w-full py-3 rounded-full text-white font-bold text-lg transition-all ${
					disabled
						? 'bg-gray-400 cursor-not-allowed'
						: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-80'
				}`}
			>
				Upload
			</button>
			{/* </div> */}
			{/* Folder-style preview */}
		</div>
	)
}

export default UploadHistoryEvidence
