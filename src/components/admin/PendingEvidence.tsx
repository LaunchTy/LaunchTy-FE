'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import Button from '@/components/UI/button/Button'
import { Evidence } from '@/interface/interface'

interface PendingEvidenceProps {
	charityId: string
	onEvidenceAction?: () => void
}

const PendingEvidence = ({ charityId, onEvidenceAction }: PendingEvidenceProps) => {
	const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([])
	const [currentEvidenceIndex, setCurrentEvidenceIndex] = useState(0)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetchPendingEvidence()
	}, [charityId])

	const fetchPendingEvidence = async () => {
		try {
			const response = await fetch(`/api/evidence/get/${charityId}`)
			if (response.ok) {
				const result = await response.json()
				if (result.success) {
					// Filter only pending evidence
					const pending = result.data.filter((evidence: Evidence) => evidence.status === 'pending')
					setPendingEvidence(pending)
				}
			}
		} catch (error) {
			console.error('Failed to fetch pending evidence:', error)
		}
	}

	const handleEvidenceAction = async (evidenceId: string, action: 'approve' | 'deny') => {
		setLoading(true)
		try {
			const response = await fetch('/api/admin/evidence/action', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					evidence_id: evidenceId,
					action,
				}),
			})

			if (response.ok) {
				const result = await response.json()
				if (result.success) {
					// Remove the processed evidence from the list
					setPendingEvidence(prev => prev.filter(evidence => evidence.evidence_id !== evidenceId))
					
					// Reset indices if needed
					if (currentEvidenceIndex >= pendingEvidence.length - 1) {
						setCurrentEvidenceIndex(Math.max(0, pendingEvidence.length - 2))
					}
					setCurrentImageIndex(0)
					
					onEvidenceAction?.()
				}
			}
		} catch (error) {
			console.error('Failed to process evidence:', error)
		} finally {
			setLoading(false)
		}
	}

	const nextEvidence = () => {
		if (currentEvidenceIndex < pendingEvidence.length - 1) {
			setCurrentEvidenceIndex(prev => prev + 1)
			setCurrentImageIndex(0)
		}
	}

	const prevEvidence = () => {
		if (currentEvidenceIndex > 0) {
			setCurrentEvidenceIndex(prev => prev - 1)
			setCurrentImageIndex(0)
		}
	}

	const nextImage = () => {
		const currentEvidence = pendingEvidence[currentEvidenceIndex]
		if (currentEvidence && currentImageIndex < currentEvidence.evidence_images.length - 1) {
			setCurrentImageIndex(prev => prev + 1)
		}
	}

	const prevImage = () => {
		if (currentImageIndex > 0) {
			setCurrentImageIndex(prev => prev - 1)
		}
	}

	if (pendingEvidence.length === 0) {
		return (
			<div className="h-[400px] flex items-center justify-center w-full rounded-xl glass-component-1 p-8">
				<span className="text-xl text-gray-500">No pending evidence submissions</span>
			</div>
		)
	}

	const currentEvidence = pendingEvidence[currentEvidenceIndex]
	const currentImage = currentEvidence?.evidence_images[currentImageIndex]

	return (
		<div className="h-[525px] flex flex-col w-full rounded-xl glass-component-1 p-8">
			<div className="flex items-center justify-between mb-4">
				<span className="text-[30px] font-bold">Pending Evidence</span>
				<span className="text-sm text-gray-400">
					{currentEvidenceIndex + 1} of {pendingEvidence.length} submissions
				</span>
			</div>

			<div className="relative flex-1 w-full rounded-lg overflow-hidden bg-gray-100">
				{/* Main image */}
				<div className="relative w-full h-full">
					<Image
						src={currentImage}
						alt={`Evidence ${currentImageIndex + 1}`}
						fill
						className="object-contain"
					/>
				</div>

				{/* Image navigation arrows */}
				{currentEvidence.evidence_images.length > 1 && (
					<>
						<button
							onClick={prevImage}
							disabled={currentImageIndex === 0}
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronLeft size={24} />
						</button>
						<button
							onClick={nextImage}
							disabled={currentImageIndex === currentEvidence.evidence_images.length - 1}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronRight size={24} />
						</button>
					</>
				)}

				{/* Evidence navigation arrows */}
				{pendingEvidence.length > 1 && (
					<>
						<button
							onClick={prevEvidence}
							disabled={currentEvidenceIndex === 0}
							className="absolute left-4 top-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={nextEvidence}
							disabled={currentEvidenceIndex === pendingEvidence.length - 1}
							className="absolute right-4 top-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronRight size={20} />
						</button>
					</>
				)}

				{/* Image counter */}
				<div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
					{currentImageIndex + 1} of {currentEvidence.evidence_images.length}
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex items-center justify-center gap-4 mt-4">
				<Button
					onClick={() => handleEvidenceAction(currentEvidence.evidence_id, 'approve')}
					disabled={loading}
					className="bg-green-600 text-white px-6 py-2 text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					<Check size={16} />
					Approve
				</Button>
				<Button
					onClick={() => handleEvidenceAction(currentEvidence.evidence_id, 'deny')}
					disabled={loading}
					className="bg-red-600 text-white px-6 py-2 text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					<X size={16} />
					Deny
				</Button>
			</div>
		</div>
	)
}

export default PendingEvidence 