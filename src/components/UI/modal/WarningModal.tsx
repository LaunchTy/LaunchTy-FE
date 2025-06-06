'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface WarningModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	description?: string
	message?: string
	warningType?: 'warning' | 'danger' | 'caution'
	onConfirm?: () => void
	onCancel?: () => void
	confirmText?: string
	cancelText?: string
	showCancelButton?: boolean
}

export default function WarningModal({
	open,
	onOpenChange,
	title = 'Warning',
	description = 'Please review the following information carefully',
	message = 'This action may have consequences. Are you sure you want to proceed?',
	warningType = 'warning',
	onConfirm,
	onCancel,
	confirmText = 'Proceed',
	cancelText = 'Cancel',
	showCancelButton = true,
}: WarningModalProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [open])

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm()
		} else {
			onOpenChange(false)
		}
	}

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		} else {
			onOpenChange(false)
		}
	}

	// Color schemes based on warning type
	const colorSchemes = {
		warning: {
			primary: '#F59E0B', // amber-500
			secondary: '#FCD34D', // amber-300
			bg: 'from-amber-500/10',
			border: 'border-amber-500/30',
			glow: 'hover:shadow-amber-500/20',
		},
		danger: {
			primary: '#EF4444', // red-500
			secondary: '#F87171', // red-400
			bg: 'from-red-500/10',
			border: 'border-red-500/30',
			glow: 'hover:shadow-red-500/20',
		},
		caution: {
			primary: '#F97316', // orange-500
			secondary: '#FB923C', // orange-400
			bg: 'from-orange-500/10',
			border: 'border-orange-500/30',
			glow: 'hover:shadow-orange-500/20',
		},
	}

	const colors = colorSchemes[warningType]

	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
						onClick={() => onOpenChange(false)}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden relative"
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${colors.bg} to-transparent rounded-2xl`}
							></div>
							<div
								className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent"
								style={{
									background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
								}}
							></div>

							{/* Close button */}
							<motion.button
								whileHover={{ scale: 1.1, rotate: 90 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => onOpenChange(false)}
								className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
							>
								<X className="h-4 w-4" />
							</motion.button>

							<div className="relative p-6">
								<div className="text-center pb-4">
									<div className="flex items-center justify-center gap-3 mb-2">
										<motion.div
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{
												delay: 0.1,
												type: 'spring',
												stiffness: 200,
											}}
											className={`bg-white/10 backdrop-blur-md p-2 rounded-full border ${colors.border}`}
											style={{ backgroundColor: `${colors.primary}20` }}
										>
											<motion.div
												animate={{ rotate: [0, -10, 10, -10, 0] }}
												transition={{ duration: 0.5, delay: 0.3 }}
											>
												<AlertTriangle
													className="h-6 w-6"
													style={{ color: colors.primary }}
												/>
											</motion.div>
										</motion.div>
									</div>
									<h2 className="text-white text-2xl font-bold mb-2">
										{title}
									</h2>
									<p className="text-white/70 text-base">{description}</p>
								</div>

								<div className="py-6">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className={`bg-white/5 backdrop-blur-md border ${colors.border} rounded-xl p-5 mb-6 relative overflow-hidden`}
									>
										{/* Animated warning stripes */}
										<motion.div
											animate={{ x: ['-100%', '100%'] }}
											transition={{
												duration: 3,
												repeat: Number.POSITIVE_INFINITY,
												ease: 'linear',
											}}
											className="absolute top-0 left-0 w-full h-1 opacity-50"
											style={{
												background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
											}}
										/>

										<div className="flex">
											<div className="flex-shrink-0">
												<motion.div
													animate={{ scale: [1, 1.1, 1] }}
													transition={{
														duration: 2,
														repeat: Number.POSITIVE_INFINITY,
													}}
												>
													<AlertTriangle
														className="h-5 w-5"
														style={{ color: colors.secondary }}
													/>
												</motion.div>
											</div>
											<div className="ml-3">
												<p
													className="text-sm font-semibold mb-1"
													style={{ color: colors.secondary }}
												>
													<strong>Important Notice</strong>
												</p>
												<p className="text-sm text-white/70">{message}</p>
											</div>
										</div>
									</motion.div>

									{/* Warning level indicator */}
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.3 }}
										className="flex items-center justify-center gap-2 mb-4"
									>
										<span className="text-xs text-white/50">
											Warning Level:
										</span>
										<div className="flex gap-1">
											{[1, 2, 3].map((level) => (
												<motion.div
													key={level}
													initial={{ opacity: 0, scale: 0 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ delay: 0.4 + level * 0.1 }}
													className={`w-2 h-4 rounded-full ${
														level <=
														(warningType === 'danger'
															? 3
															: warningType === 'caution'
																? 2
																: 1)
															? 'opacity-100'
															: 'opacity-30'
													}`}
													style={{
														backgroundColor:
															level <=
															(warningType === 'danger'
																? 3
																: warningType === 'caution'
																	? 2
																	: 1)
																? colors.primary
																: '#ffffff30',
													}}
												/>
											))}
										</div>
										<span
											className="text-xs capitalize"
											style={{ color: colors.secondary }}
										>
											{warningType}
										</span>
									</motion.div>
								</div>

								<div className="flex justify-center gap-3">
									{showCancelButton && (
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={handleCancel}
											className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-lg transition-all duration-200"
										>
											{cancelText}
										</motion.button>
									)}
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleConfirm}
										className={`backdrop-blur-md border text-white hover:bg-opacity-30 px-6 py-2 rounded-lg transition-all duration-200 ${colors.border}`}
										style={{ backgroundColor: `${colors.primary}20` }}
									>
										{confirmText}
									</motion.button>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
