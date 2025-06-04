'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'

interface SuccessModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	description?: string
	message?: string
	onClose?: () => void
	onContinue?: () => void
	showContinueButton?: boolean
}

export default function SuccessModal({
	open,
	onOpenChange,
	title = 'Success!',
	description = 'Your operation completed successfully',
	message = 'Everything went exactly as planned. You can now proceed with confidence.',
	onClose,
	onContinue,
	showContinueButton = true,
}: SuccessModalProps) {
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

	const handleClose = () => {
		if (onClose) {
			onClose()
		} else {
			onOpenChange(false)
		}
	}

	const handleContinue = () => {
		if (onContinue) {
			onContinue()
		} else {
			onOpenChange(false)
		}
	}

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
							<div className="absolute inset-0 bg-gradient-to-br from-[#9F3AD5]/10 to-transparent rounded-2xl"></div>
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9F3AD5] to-transparent"></div>

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
											className="bg-[#9F3AD5]/20 backdrop-blur-md p-2 rounded-full border border-[#9F3AD5]/30"
										>
											<CheckCircle2 className="h-6 w-6 text-[#9F3AD5]" />
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
										className="bg-white/5 backdrop-blur-md border border-[#9F3AD5]/20 rounded-xl p-6 text-center"
									>
										<div className="mb-4">
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{
													delay: 0.3,
													type: 'spring',
													stiffness: 150,
												}}
												className="inline-flex items-center justify-center w-16 h-16 bg-[#9F3AD5]/10 backdrop-blur-md border border-[#9F3AD5]/30 rounded-full mb-3"
											>
												<CheckCircle2 className="h-8 w-8 text-[#9F3AD5]" />
											</motion.div>
										</div>
										<motion.h3
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.4 }}
											className="text-xl font-semibold text-white mb-2"
										>
											Perfect!
										</motion.h3>
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.5 }}
											className="text-white/60 text-sm"
										>
											{message}
										</motion.p>
									</motion.div>
								</div>

								<div className="flex justify-center gap-3">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleClose}
										className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-lg transition-all duration-200"
									>
										Close
									</motion.button>
									{showContinueButton && (
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={handleContinue}
											className="bg-[#9F3AD5]/20 backdrop-blur-md border border-[#9F3AD5]/30 text-white hover:bg-[#9F3AD5]/30 px-6 py-2 rounded-lg transition-all duration-200"
										>
											Continue
										</motion.button>
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
