'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface LoadingModalProps {
	open: boolean
	onOpenChange?: (open: boolean) => void
	title?: string
	description?: string
}

export default function LoadingModal({
	open,
	onOpenChange = () => {},
	title = 'Processing Request',
	description = 'Please wait while we handle your request',
}: LoadingModalProps) {
	// Prevent body scroll when modal is open
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
							<div className="absolute inset-0 bg-gradient-to-br from-[#3494E6]/10 to-transparent rounded-2xl"></div>
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3494E6] to-transparent"></div>

							<div className="relative p-6">
								<div className="text-center pb-4">
									<h2 className="text-white text-2xl font-bold mb-2">
										{title}
									</h2>
									<p className="text-white/70 text-base">{description}</p>
								</div>

								<div className="flex flex-col items-center justify-center py-12">
									<div className="relative mb-8">
										<div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
											<motion.div
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ duration: 2, repeat: Infinity }}
												className="absolute w-20 h-20 rounded-full border-2 border-[#3494E6]/30"
											/>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: 'linear',
												}}
												className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#3494E6] border-r-[#3494E6]/50"
											/>
											<motion.div
												animate={{ rotate: -360 }}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: 'linear',
												}}
												className="absolute w-10 h-10 rounded-full border-2 border-transparent border-t-[#9F3AD5] border-r-[#9F3AD5]/50"
											/>
										</div>
									</div>
									<div className="text-center">
										<motion.p
											animate={{ opacity: [1, 0.5, 1] }}
											transition={{ duration: 1.5, repeat: Infinity }}
											className="text-xl font-semibold text-white mb-2"
										>
											Loading...
										</motion.p>
										<p className="text-sm text-white/60">
											This process is automatic and secure
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
