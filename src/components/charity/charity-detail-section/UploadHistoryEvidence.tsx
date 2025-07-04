'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { UploadCloud, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Folder from '@/components/UI/shared/Folder'

type Props = {
	onFilesSelected?: (files: File[]) => void
	disabled?: boolean
	charityId: string
	onUploadSuccess?: () => void
	onError?: (message: string, code: string) => void
}

interface Evidence {
	evidence_id: string
	evidence_images: string[]
	charity_id: string
	status: 'pending' | 'approve' | 'deny'
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
	const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([])
	const [deniedEvidence, setDeniedEvidence] = useState<Evidence[]>([])
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [previousPendingCount, setPreviousPendingCount] = useState(0)

	// Fetch existing evidence submissions
	const fetchEvidenceSubmissions = async () => {
		setIsRefreshing(true)
		try {
			const response = await fetch(`/api/evidence/get/${charityId}`)
			if (response.ok) {
				const result = await response.json()
				if (result.success) {
					const pending = result.data.filter((evidence: Evidence) => evidence.status === 'pending')
					const denied = result.data.filter((evidence: Evidence) => evidence.status === 'deny')
					
					// Check if pending count decreased (evidence was approved/denied)
					if (pending.length < previousPendingCount && previousPendingCount > 0) {
						const approvedCount = previousPendingCount - pending.length
						// Use a more subtle notification instead of alert
						console.log(`Great news! ${approvedCount} evidence submission${approvedCount !== 1 ? 's' : ''} ${approvedCount === 1 ? 'has been' : 'have been'} processed.`)
					}
					
					setPendingEvidence(pending)
					setDeniedEvidence(denied)
					setPreviousPendingCount(pending.length)
				}
			}
		} catch (error) {
			console.error('Failed to fetch evidence submissions:', error)
		} finally {
			setIsRefreshing(false)
		}
	}

	useEffect(() => {
		fetchEvidenceSubmissions()
		
		// Set up periodic refresh every 30 seconds
		const interval = setInterval(() => {
			fetchEvidenceSubmissions()
		}, 30000)
		
		return () => clearInterval(interval)
	}, [charityId])

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
			setHistoryEvidence((prev) => [...prev, ...base64Images])
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
			// Create evidence entry with pending status for admin approval
			const response = await fetch('/api/evidence/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					evidence_images: historyEvidence,
					charity_id: charityId,
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
					// Refresh evidence submissions to show the new pending one
					await fetchEvidenceSubmissions()
					onUploadSuccess?.()
					// Success message is handled by the parent component's success modal
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
		<div className="h-auto flex flex-col gap-4 w-full">
			{/* Summary Section */}
			{(pendingEvidence.length > 0 || deniedEvidence.length > 0) && (
				<div className="border rounded-xl glass-component-1 text-white w-full p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{pendingEvidence.length > 0 && (
								<div className="flex items-center gap-2">
									<Clock className="text-yellow-400" size={16} />
									<span className="text-sm">
										{pendingEvidence.length} pending submission{pendingEvidence.length !== 1 ? 's' : ''}
									</span>
								</div>
							)}
							{deniedEvidence.length > 0 && (
								<div className="flex items-center gap-2">
									<XCircle className="text-red-400" size={16} />
									<span className="text-sm">
										{deniedEvidence.length} denied submission{deniedEvidence.length !== 1 ? 's' : ''}
									</span>
								</div>
							)}
						</div>
						<button
							onClick={fetchEvidenceSubmissions}
							disabled={isRefreshing}
							className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50"
						>
							<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
							Check for updates
						</button>
					</div>
				</div>
			)}

			{/* Pending Evidence Section */}
			{pendingEvidence.length > 0 && (
				<div className="border rounded-xl glass-component-1 text-white w-full p-6 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Clock className="text-yellow-400" size={20} />
							<span className="text-lg font-semibold text-white">
								Pending Evidence ({pendingEvidence.length})
							</span>
						</div>
						<button
							onClick={fetchEvidenceSubmissions}
							disabled={isRefreshing}
							className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
						>
							<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
							Refresh
						</button>
					</div>
					<div className="text-sm text-gray-300">
						Your evidence submissions are waiting for admin approval
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{pendingEvidence.map((evidence, index) => (
							<div key={evidence.evidence_id} className="border border-yellow-500/30 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Clock className="text-yellow-400" size={16} />
									<span className="text-sm font-medium">Submission {index + 1}</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									{evidence.evidence_images.slice(0, 4).map((image, imgIndex) => (
										<div key={imgIndex} className="relative aspect-square">
											<Image
												src={image}
												alt={`Evidence ${imgIndex + 1}`}
												fill
												className="object-cover rounded"
											/>
										</div>
									))}
									{evidence.evidence_images.length > 4 && (
										<div className="relative aspect-square bg-gray-700 rounded flex items-center justify-center">
											<span className="text-xs text-gray-300">
												+{evidence.evidence_images.length - 4} more
											</span>
										</div>
									)}
								</div>
								<div className="text-xs text-yellow-400 mt-2">
									{evidence.evidence_images.length} image{evidence.evidence_images.length !== 1 ? 's' : ''} • Awaiting review
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Denied Evidence Section */}
			{deniedEvidence.length > 0 && (
				<div className="border rounded-xl glass-component-1 text-white w-full p-6 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<XCircle className="text-red-400" size={20} />
							<span className="text-lg font-semibold text-white">
								Denied Evidence ({deniedEvidence.length})
							</span>
						</div>
						<button
							onClick={fetchEvidenceSubmissions}
							disabled={isRefreshing}
							className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
						>
							<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
							Refresh
						</button>
					</div>
					<div className="text-sm text-gray-300">
						These submissions were not approved. You can submit new evidence.
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{deniedEvidence.map((evidence, index) => (
							<div key={evidence.evidence_id} className="border border-red-500/30 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<XCircle className="text-red-400" size={16} />
									<span className="text-sm font-medium">Submission {index + 1}</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									{evidence.evidence_images.slice(0, 4).map((image, imgIndex) => (
										<div key={imgIndex} className="relative aspect-square">
											<Image
												src={image}
												alt={`Evidence ${imgIndex + 1}`}
												fill
												className="object-cover rounded opacity-50"
											/>
										</div>
									))}
									{evidence.evidence_images.length > 4 && (
										<div className="relative aspect-square bg-gray-700 rounded flex items-center justify-center">
											<span className="text-xs text-gray-300">
												+{evidence.evidence_images.length - 4} more
											</span>
										</div>
									)}
								</div>
								<div className="text-xs text-red-400 mt-2">
									{evidence.evidence_images.length} image{evidence.evidence_images.length !== 1 ? 's' : ''} • Not approved
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Upload Section */}
			<div className={`border rounded-xl glass-component-1 text-white w-full p-6 flex flex-col gap-5 ${
				pendingEvidence.length > 0 ? 'border-blue-500/50 bg-blue-500/5' : ''
			}`}>
				<div className="flex items-center gap-2">
					<UploadCloud className="text-blue-400" size={20} />
					<span className="text-lg font-semibold text-white">
						Upload New History Evidence
					</span>
					{pendingEvidence.length > 0 && (
						<span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
							{pendingEvidence.length} pending
						</span>
					)}
				</div>

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
								{historyEvidence.length} image
								{historyEvidence.length !== 1 ? 's' : ''} selected
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center text-gray-400">
							<UploadCloud size={48} className="mb-2" />
							<div className="text-center">
								<div className="font-semibold">Click to upload images</div>
								<div className="text-sm">
									or drag and drop multiple images here
								</div>
								{pendingEvidence.length > 0 && (
									<div className="text-xs text-yellow-400 mt-2">
										You can continue submitting while waiting for approval
									</div>
								)}
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
				{isUploading
					? 'Uploading for Admin Review...'
					: `Submit for Review ${historyEvidence.length > 0 ? `(${historyEvidence.length} images)` : ''}`}
			</button>
		</div>
	)
}

export default UploadHistoryEvidence
