'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield } from 'lucide-react'
import { useEffect } from 'react'

interface LockModalProps {
	open?: boolean
	title?: string
	description?: string
	message?: string
	onUnlock?: () => void
	showUnlockButton?: boolean
	canClose?: boolean
}

export default function LockModal({
	open = true,
	title = 'Page Locked',
	description = 'This page is temporarily locked for security reasons',
	message = 'This page has been locked to prevent unauthorized access. Please wait for an administrator to unlock it or contact support.',
	onUnlock,
	showUnlockButton = true,
	canClose = true,
}: LockModalProps) {
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

	const handleUnlock = () => {
		if (onUnlock) {
			onUnlock()
		}
	}

	const handleBackdropClick = () => {
		if (canClose && onUnlock) {
			onUnlock()
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
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
						onClick={handleBackdropClick}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden relative"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent rounded-2xl"></div>
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>

							<div className="relative p-6">
								<div className="text-center pb-4">
									<div className="flex items-center justify-center gap-3 mb-2">
										<motion.div
											animate={{ scale: [1, 1.1, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
											className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/30"
										>
											<Shield className="h-6 w-6 text-white" />
										</motion.div>
									</div>
									<h2 className="text-white text-2xl font-bold mb-2">
										{title}
									</h2>
									<p className="text-white/70 text-base">{description}</p>
								</div>

								<div className="py-8">
									<div className="text-center mb-6">
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 0.1,
												type: 'spring',
												stiffness: 150,
											}}
											className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-md border border-white/20 rounded-full mb-4 relative"
										>
											<motion.div
												animate={{
													scale: [1, 1.2, 1],
													opacity: [0.5, 0.8, 0.5],
												}}
												transition={{ duration: 2, repeat: Infinity }}
												className="absolute inset-0 rounded-full border border-white/10"
											/>
											<motion.div
												animate={{ y: [-2, 2, -2] }}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: 'easeInOut',
												}}
											>
												<Lock className="h-12 w-12 text-white/80" />
											</motion.div>
										</motion.div>
									</div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center"
									>
										<h3 className="text-xl font-semibold text-white mb-3">
											Access Restricted
										</h3>
										<p className="text-white/60 text-sm mb-4">{message}</p>
										<div className="flex items-center justify-center gap-2 text-xs text-white/50">
											<motion.div
												animate={{ opacity: [1, 0.3, 1] }}
												transition={{ duration: 1.5, repeat: Infinity }}
												className="w-2 h-2 bg-red-500 rounded-full"
											/>
											<span>Security lock active</span>
										</div>
									</motion.div>
								</div>

								{/* {showUnlockButton && (
									<div className="flex justify-center gap-3">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={handleUnlock}
											className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
										>
											<Shield className="h-4 w-4" />
											Unlock Page
										</motion.button>
									</div>
								)} */}
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
