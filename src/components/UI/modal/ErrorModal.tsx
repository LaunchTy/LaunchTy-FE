'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

interface ErrorModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	description?: string
	errorCode?: string
	errorMessage?: string
	onRetry?: () => void
	onDismiss?: () => void
}

export default function ErrorModal({
	open,
	onOpenChange,
	title = 'Operation Failed',
	description = 'We encountered an issue processing your request',
	errorCode = '500 - Internal Server Error',
	errorMessage = 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
	onRetry,
	onDismiss,
}: ErrorModalProps) {
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

	const handleRetry = () => {
		if (onRetry) {
			onRetry()
		} else {
			onOpenChange(false)
		}
	}

	const handleDismiss = () => {
		if (onDismiss) {
			onDismiss()
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
							<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl"></div>
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

							<div className="relative p-6">
								<div className="text-center pb-4">
									<div className="flex items-center justify-center gap-3 mb-2">
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 0.1,
												type: 'spring',
												stiffness: 200,
											}}
											className="bg-red-500/20 backdrop-blur-md p-2 rounded-full border border-red-500/30"
										>
											<AlertCircle className="h-6 w-6 text-red-500" />
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
										className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-xl p-5 mb-6"
									>
										<div className="flex">
											<div className="flex-shrink-0">
												<AlertCircle className="h-5 w-5 text-red-400" />
											</div>
											<div className="ml-3">
												<p className="text-sm text-red-300">
													<strong>Error Code:</strong> {errorCode}
												</p>
												<p className="text-sm text-white/60 mt-1">
													{errorMessage}
												</p>
											</div>
										</div>
									</motion.div>
								</div>

								<div className="flex justify-center gap-3">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleDismiss}
										className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-lg transition-all duration-200"
									>
										Dismiss
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleRetry}
										className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white hover:bg-red-500/30 px-6 py-2 rounded-lg transition-all duration-200"
									>
										Retry
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
