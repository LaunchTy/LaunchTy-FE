'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { UploadCloud } from 'lucide-react'
import Folder from '@/components/UI/shared/Folder'

type Props = {
	onFilesSelected?: (files: File[]) => void
	disabled?: boolean
	charityId: string
	onUploadSuccess?: () => void
	onError?: (message: string, code: string) => void
}

const UploadHistoryEvidence = ({
	onFilesSelected,
	disabled,
	charityId,
	onUploadSuccess,
	onError,
}: Props) => {
	const [previewImages, setPreviewImages] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [historyEvidence, setHistoryEvidence] = useState<string[]>([])
	const [isUploading, setIsUploading] = useState(false)
	const [isOpeningFileExplorer, setIsOpeningFileExplorer] = useState(false)

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
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files)
			const base64Images = await Promise.all(
				files.map((file) => convertToBase64(file))
			)
			setHistoryEvidence(prev => [...prev, ...base64Images])
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

	const handleUpload = async () => {
		if (historyEvidence.length === 0) {
			onError?.('Please select images to upload', '400')
			return
		}

		setIsUploading(true)
		try {
			// First, fetch the current charity data to get existing evidence
			const getResponse = await fetch(`/api/charity/get/${charityId}`)
			if (!getResponse.ok) {
				onError?.('Failed to fetch current charity data', '500')
				return
			}
			
			const charityData = await getResponse.json()
			if (!charityData.success) {
				onError?.('Failed to fetch current charity data', '500')
				return
			}

			// Combine existing evidence with new evidence
			const existingEvidence = charityData.data.evidence || []
			const updatedEvidence = [...existingEvidence, ...historyEvidence]

			// Update the charity with combined evidence
			const response = await fetch(`/api/charity/update/${charityId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					evidence: updatedEvidence,
				}),
			})

			if (response.ok) {
				const result = await response.json()
				if (result.success) {
					setHistoryEvidence([])
					// Clear the file input to ensure onChange triggers on next selection
					if (fileInputRef.current) {
						fileInputRef.current.value = ''
					}
					// Reset the file explorer flag
					setIsOpeningFileExplorer(false)
					onUploadSuccess?.()
				} else {
					onError?.('Failed to upload history evidence: ' + result.error, '500')
				}
			} else {
				onError?.('Failed to upload history evidence', '500')
			}
		} catch (error) {
			console.error('Upload error:', error)
			onError?.('Error uploading history evidence', '500')
		} finally {
			setIsUploading(false)
			// Reset the file explorer flag in all cases
			setIsOpeningFileExplorer(false)
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
				<div 
					className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible cursor-pointer"
					onClick={() => {
						// Prevent double opening
						if (isOpeningFileExplorer) {
							return
						}
						
						setIsOpeningFileExplorer(true)
						
						// Only clear if there are already images selected
						if (historyEvidence.length > 0) {
							// Clear the file input first to ensure fresh selection
							if (fileInputRef.current) {
								fileInputRef.current.value = ''
							}
							// Clear the current selection
							setHistoryEvidence([])
						}
						
						// Open file explorer
						fileInputRef.current?.click()
						
						// Reset flag after a delay
						setTimeout(() => {
							setIsOpeningFileExplorer(false)
						}, 1000)
					}}
				>
					<input
						ref={fileInputRef}
						type="file"
						id="historyUpload"
						accept="image/*"
						multiple
						onChange={handleHistoryUpload}
						className="hidden"
					/>

					{historyEvidence.length > 0 ? (
						<div className="w-full h-full flex flex-col items-center justify-center">
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
							<div className="mt-2 text-sm text-gray-300">
								{historyEvidence.length} image{historyEvidence.length !== 1 ? 's' : ''} selected
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center text-gray-400">
							<UploadCloud size={48} className="mb-2" />
							<div className="text-center">
								<div className="font-semibold">Click to upload images</div>
								<div className="text-sm">or drag and drop multiple images here</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* Upload Button */}
			<button
				disabled={disabled || isUploading || historyEvidence.length === 0}
				onClick={handleUpload}
				className={`mt-2 w-full py-3 rounded-full text-white font-bold text-lg transition-all ${
					disabled || isUploading || historyEvidence.length === 0
						? 'bg-gray-400 cursor-not-allowed'
						: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-80'
				}`}
			>
				{isUploading ? 'Uploading...' : `Upload ${historyEvidence.length > 0 ? `(${historyEvidence.length} images)` : ''}`}
			</button>
		</div>
	)
}

export default UploadHistoryEvidence
