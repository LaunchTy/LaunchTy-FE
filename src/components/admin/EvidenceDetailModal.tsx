'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Check, X, X as CloseIcon } from 'lucide-react'
import Button from '@/components/UI/button/Button'
import { Evidence, Charity } from '@/interface/interface'
import axios from 'axios'

interface EvidenceDetailModalProps {
	isOpen: boolean
	onClose: () => void
	charityId: string
	onEvidenceAction?: () => void
}

const EvidenceDetailModal = ({ 
	isOpen, 
	onClose, 
	charityId, 
	onEvidenceAction 
}: EvidenceDetailModalProps) => {
	const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([])
	const [charityInfo, setCharityInfo] = useState<Charity | null>(null)
	const [currentEvidenceIndex, setCurrentEvidenceIndex] = useState(0)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [loading, setLoading] = useState(false)
	const [isLoadingData, setIsLoadingData] = useState(true)

	useEffect(() => {
		if (isOpen && charityId) {
			fetchData()
		}
	}, [isOpen, charityId])

	const fetchData = async () => {
		setIsLoadingData(true)
		try {
			// Fetch charity information
			const charityResponse = await axios.get(`/api/charity/get/${charityId}`)
			if (charityResponse.data.success) {
				setCharityInfo(charityResponse.data.data)
			}

			// Fetch pending evidence
			const evidenceResponse = await axios.get(`/api/evidence/get/${charityId}`)
			if (evidenceResponse.data.success) {
				const pending = evidenceResponse.data.data.filter(
					(evidence: Evidence) => evidence.status === 'pending'
				)
				setPendingEvidence(pending)
			}
		} catch (error) {
			console.error('Failed to fetch data:', error)
		} finally {
			setIsLoadingData(false)
		}
	}

	const handleEvidenceAction = async (evidenceId: string, action: 'approve' | 'deny') => {
		setLoading(true)
		try {
			const response = await axios.post('/api/admin/evidence/action', {
				evidence_id: evidenceId,
				action,
			})

			if (response.data.success) {
				// Remove the processed evidence from the list
				setPendingEvidence(prev => prev.filter(evidence => evidence.evidence_id !== evidenceId))
				
				// Reset indices if needed
				if (currentEvidenceIndex >= pendingEvidence.length - 1) {
					setCurrentEvidenceIndex(Math.max(0, pendingEvidence.length - 2))
				}
				setCurrentImageIndex(0)
				
				onEvidenceAction?.()
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

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
			<div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
					<div>
						<h2 className="text-2xl font-bold text-white">
							Evidence Review - {charityInfo?.charity_name || 'Loading...'}
						</h2>
						<p className="text-gray-300 text-sm">
							{pendingEvidence.length} pending evidence submissions
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
					>
						<CloseIcon size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="flex h-[calc(90vh-120px)]">
					{/* Left side - Charity Info */}
					<div className="w-1/3 p-6 border-r border-gray-700 overflow-y-auto bg-gray-900">
						{isLoadingData ? (
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						) : charityInfo ? (
							<div className="space-y-6">
								{/* Charity Logo and Basic Info */}
								<div className="text-center">
									<div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
										<Image
											src={charityInfo.charity_logo}
											alt={charityInfo.charity_name}
											width={96}
											height={96}
											className="object-cover w-full h-full"
										/>
									</div>
									<h3 className="text-xl font-semibold text-white">
										{charityInfo.charity_name}
									</h3>
									<p className="text-sm text-gray-300 mt-1">
										Token: {charityInfo.charity_token_symbol}
									</p>
								</div>

								{/* Charity Description */}
								<div>
									<h4 className="font-semibold text-white mb-2">Description</h4>
									<p className="text-sm text-gray-300 leading-relaxed">
										{charityInfo.charity_short_des}
									</p>
								</div>

								{/* Representative Info */}
								<div>
									<h4 className="font-semibold text-white mb-2">Representative</h4>
									<div className="space-y-1 text-sm text-gray-300">
										<p><span className="font-medium">Name:</span> {charityInfo.repre_name}</p>
										<p><span className="font-medium">Phone:</span> {charityInfo.repre_phone}</p>
										<p><span className="font-medium">Email:</span> {charityInfo.charity_email || 'N/A'}</p>
									</div>
								</div>

								{/* Project Dates */}
								<div>
									<h4 className="font-semibold text-white mb-2">Project Timeline</h4>
									<div className="space-y-1 text-sm text-gray-300">
										<p><span className="font-medium">Start Date:</span> {new Date(charityInfo.charity_start_date).toLocaleDateString()}</p>
										<p><span className="font-medium">End Date:</span> {new Date(charityInfo.charity_end_date).toLocaleDateString()}</p>
									</div>
								</div>

								{/* Social Links */}
								{(charityInfo.charity_website || charityInfo.charity_fb || charityInfo.charity_x || charityInfo.charity_ig) && (
									<div>
										<h4 className="font-semibold text-white mb-2">Social Links</h4>
										<div className="space-y-1 text-sm">
											{charityInfo.charity_website && (
												<a href={charityInfo.charity_website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block">
													Website
												</a>
											)}
											{charityInfo.charity_fb && (
												<a href={charityInfo.charity_fb} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block">
													Facebook
												</a>
											)}
											{charityInfo.charity_x && (
												<a href={charityInfo.charity_x} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block">
													Twitter/X
												</a>
											)}
											{charityInfo.charity_ig && (
												<a href={charityInfo.charity_ig} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block">
													Instagram
												</a>
											)}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-center text-gray-400">
								Failed to load charity information
							</div>
						)}
					</div>

					{/* Right side - Evidence Viewer */}
					<div className="flex-1 p-6 bg-gray-900">
						{isLoadingData ? (
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						) : pendingEvidence.length === 0 ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<p className="text-xl text-gray-400 mb-2">No pending evidence submissions</p>
									<p className="text-sm text-gray-500">All evidence has been reviewed</p>
								</div>
							</div>
						) : (
							(() => {
								const currentEvidence = pendingEvidence[currentEvidenceIndex]
								return (
									<div className="h-full flex flex-col">
										{/* Evidence Navigation Header */}
																		<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-4">
										<button
											onClick={prevEvidence}
											disabled={currentEvidenceIndex === 0}
											className="p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
										>
											<ChevronLeft size={20} />
										</button>
										<span className="text-lg font-semibold text-white">
											Evidence {currentEvidenceIndex + 1} of {pendingEvidence.length}
										</span>
										<button
											onClick={nextEvidence}
											disabled={currentEvidenceIndex === pendingEvidence.length - 1}
											className="p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
										>
											<ChevronRight size={20} />
										</button>
									</div>
								</div>

																		{/* Evidence Image Viewer */}
								<div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden">
											{currentEvidence && (
												<>
													<div className="relative w-full h-full">
														<Image
															src={currentEvidence.evidence_images[currentImageIndex]}
															alt={`Evidence ${currentImageIndex + 1}`}
															fill
															className="object-contain"
														/>
													</div>

													{/* Image Navigation */}
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

													{/* Image Counter */}
													<div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
														{currentImageIndex + 1} of {currentEvidence.evidence_images.length}
													</div>
												</>
											)}
										</div>

										{/* Action Buttons */}
										<div className="flex items-center justify-center gap-4 mt-6">
											<Button
												onClick={() => handleEvidenceAction(currentEvidence.evidence_id, 'approve')}
												disabled={loading}
												className="bg-green-600 text-white px-8 py-3 text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
											>
												<Check size={16} />
												Approve Evidence
											</Button>
											<Button
												onClick={() => handleEvidenceAction(currentEvidence.evidence_id, 'deny')}
												disabled={loading}
												className="bg-red-600 text-white px-8 py-3 text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
											>
												<X size={16} />
												Deny Evidence
											</Button>
										</div>
									</div>
								)
							})()
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default EvidenceDetailModal 